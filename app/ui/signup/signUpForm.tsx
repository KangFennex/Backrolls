'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { signIn, getSession } from "next-auth/react";
import { BackrollsLogo } from '../shared/BackrollsLogo';
import { useRouter } from 'next/navigation';
import { SignupFormErrors } from '../../lib/definitions';
import { SignupFormSkeleton, SignupSuccessMessage } from './SignupSkeleton';

export default function SignUpForm() {
    const router = useRouter();
    const [errors, setErrors] = useState<SignupFormErrors>({});
    const [pending, setPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const validateInputs = () => {
        const username = document.getElementById('username') as HTMLInputElement;
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Username validation
        if (!username.value || username.value.length < 4) {
            setUsernameError(true);
            setUsernameErrorMessage('Username must be at least 4 characters long.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        // Email validation
        if (!emailRegex.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // Password validation
        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must contain at least one special character.');
            isValid = false;
        }
        else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);

        // Clear previous errors
        setErrors({});
        setUsernameError(false);
        setUsernameErrorMessage('');
        setEmailError(false);
        setEmailErrorMessage('');
        setPasswordError(false);
        setPasswordErrorMessage('');

        if (!validateInputs()) {
            setPending(false);
            return;
        }

        try {
            const formData = new FormData(event.currentTarget);

            // Capture email and password for auto sign-in
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            setPending(false);

            if (result.success) {
                console.log("Account created successfully, attempting auto sign-in...");

                // Add a small delay to ensure database consistency
                await new Promise(resolve => setTimeout(resolve, 500));

                // Automatically sign in the user after successful signup
                try {
                    const signInResult = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                        callbackUrl: "/lounge"
                    });

                    console.log("Sign-in result:", signInResult);

                    if (signInResult?.ok) {
                        console.log("Auto sign-in successful, refreshing session...");
                        await getSession();

                        // Show success state
                        setIsSuccess(true);

                        // Redirect after 3 seconds
                        setTimeout(() => {
                            router.push('/lounge');
                        }, 3000);
                    } else {
                        console.error("Auto sign-in failed:", signInResult?.error);
                        // Redirect to login page if auto sign-in fails
                        alert("Account created successfully! Please log in.");
                        router.push('/login');
                    }
                } catch (signInError) {
                    console.error("Auto sign-in error:", signInError);
                    // Redirect to login page if auto sign-in fails
                    alert("Account created successfully! Please log in.");
                    router.push('/login');
                }
            } else if (result.errors) {
                setErrors(result.errors);
                console.log(result.errors);

                // Set specific field errors for MUI display
                if (result.errors.username) {
                    setUsernameError(true);
                    setUsernameErrorMessage(result.errors.username[0]);
                }
                if (result.errors.email) {
                    setEmailError(true);
                    setEmailErrorMessage(result.errors.email[0]);
                }
            } else if (result.error) {
                console.error('Signup error:', result.error);
                alert(`Signup failed: ${result.error}`);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            setPending(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setPending(true);
        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/lounge"
            });

            if (result?.error) {
                throw new Error("Google sign-up failed");
            } else if (result?.ok) {
                // Trigger session refresh
                await getSession();

                // Show success state
                setPending(false);
                setIsSuccess(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push("/lounge");
                }, 3000);
            }
        } catch (error) {
            console.error("Google sign-up failed:", error);
            setPending(false);
        }
    };

    // Show skeleton while loading
    if (pending) {
        return <SignupFormSkeleton />;
    }

    // Show success message after successful signup
    if (isSuccess) {
        return <SignupSuccessMessage />;
    }

    // Show normal form
    return (
        <Card
            sx={{
                minWidth: '320px',
                maxWidth: '350px',
                borderRadius: '15px',
                border: '2',
                borderColor: '#D8C3E0'
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '20px'
            }}>
                <BackrollsLogo />
            </Box>
            <Divider />
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                    padding: '30px'
                }}
            >
                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <TextField
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        id="username"
                        type="text"
                        name="username"
                        placeholder="ExtraSassy"
                        autoFocus
                        required
                        fullWidth
                        variant="standard"
                        color={usernameError ? 'error' : 'primary'}
                    ></TextField>
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        variant="standard"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="standard"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained">
                    Sign up
                </Button>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleSignUp}
                    sx={{
                        borderColor: '#db4437',
                        color: '#db4437',
                        '&:hover': {
                            borderColor: '#c23321',
                            backgroundColor: 'rgba(219, 68, 55, 0.04)',
                        }
                    }}
                    startIcon={
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    }
                >
                    Continue with Google
                </Button>
                <Typography variant="body2" color="textSecondary" align="center">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </Typography>
                {errors.general && (
                    <Typography variant="body2" color="error" align="center">
                        {errors.general}
                    </Typography>
                )}
            </Box>
        </Card>
    )
}