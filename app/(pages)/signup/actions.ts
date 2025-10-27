'use server'

import { SignupFormSchema } from "../../lib/definitions"
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function createJWT(user) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    return await new SignJWT({ id: user.id, username: user.username, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
}

export async function userExists(email: string, username?: string) {
    try {
        const query = supabase.from('profiles')
            .select('email, username')
            .or(`email.eq.${email}${username ? `,username.eq.${username}` : ''}`);

        const { data, error } = await query;

        if (error) {
            // If table doesn't exist, treat as no users exist yet
            if (error.code === 'PGRST205') {
                return { exists: false };
            }
            console.error('Error checking user existence:', error);
            return { exists: false, error: error.message };
        }

        if (data && data.length > 0) {
            const existingUser = data[0];
            if (existingUser.email === email) {
                return { exists: true, field: 'email', error: 'Email has already been used' };
            }
            if (username && existingUser.username === username) {
                return { exists: true, field: 'username', error: 'Username already taken' }
            }
        }
        return { exists: false };

    } catch (error) {
        console.error('Error in userExists:', error);
        return { exists: false };
    }
}

export async function signup(state, formData) {
    try {
        // Validate fields
        const validationResult = SignupFormSchema.safeParse({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!validationResult.success) {
            return {
                errors: validationResult.error.flatten().fieldErrors,
            };
        }

        const { username, email, password } = validationResult.data;
        console.log('Signup attempt for:', { username, email });

        // Check if user already exists
        const existenceCheck = await userExists(email, username);
        console.log('Existence check result:', existenceCheck);

        if (existenceCheck.exists) {
            return { errors: { [existenceCheck.field]: [existenceCheck.error] } };
        }

        // Use Supabase Auth for registration
        console.log('Attempting Supabase auth signup...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            console.error('Supabase auth error:', authError);
            return { error: authError.message };
        }

        if (!authData.user) {
            console.error('No user data returned from Supabase');
            return { error: 'User creation failed' };
        }

        console.log('Auth successful, user ID:', authData.user.id);

        // Create JWT token
        console.log('Creating JWT...');
        const jwt = await createJWT({
            id: authData.user.id,
            username,
            email
        });
        console.log('JWT created successfully');

        // Delay to allow for the database trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to get profile with retries
        let profile = null;
        let retryCount = 0;
        const maxRetries = 3;

        while (!profile && retryCount < maxRetries) {
            try {
                console.log(`Fetching profile (attempt ${retryCount + 1})...`);
                const { data: profileData, error: profileFetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                if (profileFetchError) {
                    if (profileFetchError.code === 'PGRST116') {
                        // Profile not found, wait and retry
                        console.log('Profile not found yet, waiting...');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        retryCount++;
                        continue;
                    } else {
                        throw profileFetchError;
                    }
                }

                profile = profileData;
                console.log('Profile found:', profile);
                break;

            } catch (profileError) {
                console.log(`Profile fetch attempt ${retryCount + 1} failed:`, profileError);
                retryCount++;

                if (retryCount >= maxRetries) {
                    console.log('Max retries reached, creating profile manually...');
                    try {
                        const { data: newProfile, error: insertError } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: authData.user.id,
                                    username: username,
                                    email: email
                                }
                            ])
                            .select()
                            .single();

                        if (insertError) {
                            console.error('Error creating profile manually:', insertError);
                            // Don't fail the signup, just use basic user info
                        } else {
                            profile = newProfile;
                            console.log('Profile created manually:', profile);
                        }
                    } catch (manualCreateError) {
                        console.error('Manual profile creation failed:', manualCreateError);
                    }
                    break;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }

        console.log('Signup successful, returning result');
        return {
            success: true,
            user: profile || {
                id: authData.user.id,
                username: username,
                email: email
            },
            token: jwt
        };

    } catch (error) {
        console.error('Unexpected error in signup - Full details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return {
            success: false,
            error: `Unexpected error: ${error.message}`
        };
    }
}