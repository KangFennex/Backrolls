import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

export function LoginFormSkeleton() {
    return (
        <Card
            variant="outlined"
            className="loginForm"
            sx={{
                minWidth: '320px',
                maxWidth: '350px',
                borderRadius: '15px',
                border: '2',
                borderColor: '#D8C3E0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Logo section skeleton */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '20px'
            }}>
                <Skeleton
                    variant="rectangular"
                    width={120}
                    height={40}
                    sx={{ borderRadius: '8px' }}
                />
            </Box>

            <Divider />

            {/* Form section skeleton */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
                padding: '30px'
            }}>
                {/* Email field */}
                <Box>
                    <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={35} sx={{ borderRadius: '4px' }} />
                </Box>

                {/* Password field */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Skeleton variant="text" width="30%" height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={35} sx={{ borderRadius: '4px' }} />
                </Box>

                {/* Remember me checkbox */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="rectangular" width={20} height={20} />
                    <Skeleton variant="text" width="35%" height={20} />
                </Box>

                {/* Submit button */}
                <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={40} 
                    sx={{ borderRadius: '4px', mt: 1 }} 
                />
                
                {/* OR divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <Skeleton variant="rectangular" width="45%" height={1} />
                    <Skeleton variant="text" width="10%" height={20} sx={{ mx: 1 }} />
                    <Skeleton variant="rectangular" width="45%" height={1} />
                </Box>
                
                {/* Google button */}
                <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={40} 
                    sx={{ borderRadius: '4px' }} 
                />                {/* Sign up link */}
                <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                </Box>
            </Box>

            {/* Shimmer effect overlay */}
            <div className="shimmer-overlay">
                <div className="shimmer-effect-login"></div>
            </div>
        </Card>
    );
}

export function LoginSuccessMessage() {
    return (
        <Card
            variant="outlined"
            className="loginForm"
            sx={{
                minWidth: '320px',
                maxWidth: '350px',
                borderRadius: '15px',
                border: '2',
                borderColor: '#4CAF50',
                backgroundColor: '#f8fff8'
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '60px 30px',
                textAlign: 'center'
            }}>
                {/* Success icon */}
                <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    animation: 'successPulse 1.5s ease-in-out infinite'
                }}>
                    ✓
                </Box>

                {/* Success message */}
                <Box>
                    <h2 style={{
                        color: '#4CAF50',
                        margin: '0 0 8px 0',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        Welcome Back!
                    </h2>
                    <p style={{
                        color: '#666',
                        margin: 0,
                        fontSize: '16px'
                    }}>
                        Login successful. Redirecting...
                    </p>
                </Box>

                {/* Progress indicator */}
                <Box sx={{ width: '100%' }}>
                    <div className="success-progress-bar">
                        <div className="success-progress-fill"></div>
                    </div>
                </Box>
            </Box>
        </Card>
    );
}