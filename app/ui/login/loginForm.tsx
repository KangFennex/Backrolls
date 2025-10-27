'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { GLogo } from '../sharedComponents';
import ForgotPassword from "../forgotPassword";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
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
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                callbackUrl: "/lounge"
            });

            if (result?.error) {
                throw new Error("Couldn't log you in")
                setIsLoading(false);
            }

            else {
                // Redirect on success
                setIsLoading(false);
                router.push("/lounge");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    }

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
                <GLogo />
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
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained">
                    {isLoading ? 'Signing in...' : 'Sign in'}
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