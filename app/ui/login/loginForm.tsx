'use client';

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { BackrollsLogo } from '../shared/BackrollsLogo';
import ForgotPassword from "./forgotPassword";
import { useRouter } from "next/navigation";
import { LoginFormSkeleton, LoginSuccessMessage } from './LoginSkeleton';
import Alert from '@mui/material/Alert'; // Add this import

export default function LoginForm() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [authError, setAuthError] = useState(''); // Add this state for server errors
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Clear previous errors
        setAuthError('');
        setEmailError(false);
        setEmailErrorMessage('');
        setPasswordError(false);
        setPasswordErrorMessage('');

        if (!emailRegex.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        }

        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        setIsLoading(true);
        setAuthError(''); // Clear any previous auth errors

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                remember: rememberMe.toString(),
                callbackUrl: "/"
            });

            if (result?.error) {
                // The error message from your backend will be in result.error
                setAuthError(result.error);
                setIsLoading(false);
            } else {
                // Trigger session refresh to update auth state immediately
                await getSession();

                // Show success state
                setIsLoading(false);
                setIsSuccess(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setAuthError(''); // Clear auth errors for Google sign-in too
        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/"
            });

            if (result?.error) {
                setAuthError('Google sign-in failed. Please try again.');
                setIsLoading(false);
            } else if (result?.ok) {
                // Trigger session refresh
                await getSession();

                // Show success state
                setIsLoading(false);
                setIsSuccess(true);

                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        } catch (error) {
            console.error("Google sign-in failed:", error);
            setAuthError('Google sign-in failed. Please try again.');
            setIsLoading(false);
        }
    }

    // Show skeleton while loading
    if (isLoading) {
        return <LoginFormSkeleton />;
    }

    // Show success message after successful login
    if (isSuccess) {
        return <LoginSuccessMessage />;
    }

    // Show normal form
    return (
        <Card
            variant="outlined"
            className="loginForm"
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
                {/* Add Alert component to display server errors */}
                {authError && (
                    <Alert
                        severity="error"
                        sx={{
                            width: '100%',
                            '& .MuiAlert-message': {
                                width: '100%',
                                textAlign: 'center'
                            }
                        }}
                    >
                        {authError}
                    </Alert>
                )}

                <FormControl>
                    <FormLabel htmlFor="Email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="text"
                        name="email"
                        placeholder="ExtraSassy"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="standard"
                        color={emailError ? 'error' : 'primary'}
                    ></TextField>
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'baseline' }}
                        >
                            Forgot your password?
                        </Link>
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained">
                    Sign in
                </Button>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleSignIn}
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
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
                        <Link
                            href="/signup"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>
                    </span>
                </Typography>
            </Box>
        </Card>
    )
}