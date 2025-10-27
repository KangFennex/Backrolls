'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { GLogo } from '../sharedComponents';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [pending, setPending] = useState(false);

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

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            setPending(false);

            if (result.success) {
                router.push('/lounge');
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
                    {pending ? "Submitting..." : "Sign up"}
                </Button>
            </Box>
        </Card>
    )
}