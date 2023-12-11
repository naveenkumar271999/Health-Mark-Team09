import { Typography, Button, Box } from '@mui/material';
import { Link as RouteLink } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <Box sx={styles.root}>
            <Box sx={styles.content}>
                <Typography variant='h2' sx={styles.formHeading}>404</Typography>
                <Typography variant='h6' sx={styles.formHeading}>Page Not Found</Typography>
                <Typography sx={styles.registerText}>
                    <Button component={RouteLink} to="/" variant="contained" color="primary" disableelevation="true">
                        Go Back
                    </Button>
                </Typography>
            </Box>
        </Box>
    );
};

const styles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '100vh',
        height: '100vh',
        width: '100%',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px',
        minWidth: '60%',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px 0px rgba(1,1,1,0.1)',
    },
    formHeading: {
        paddingBottom: '10px',
        fontWeight: '500',
        width: '100%',
        textAlign: 'center',
    },
    registerText: {
        width: '100%',
        textAlign: 'center',
        marginTop: '12px',
        marginBottom: '12px',
    },
}

export default ErrorPage;
