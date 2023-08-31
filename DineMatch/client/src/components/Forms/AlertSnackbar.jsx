import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) { 
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertSnackbar = (props) => {
    const { serverError, successMessage } = props; // This is a prop that will hold the server error message.
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(!!serverError); // This is a state that will check if the error snackbar is open or not.
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(!!successMessage);

    useEffect(() => {
        setErrorSnackbarOpen(!!serverError);
        setSuccessSnackbarOpen(!!successMessage);
    }, [serverError, successMessage]);

    const handleClose = (type) => {
        if (type === 'error') {
            setErrorSnackbarOpen(false);
        } else if (type === 'success') {
            setSuccessSnackbarOpen(false);
        }
    };

    return (
        <>
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={7000}
                onClose={() => handleClose('error')}
            >
                <Alert
                    onClose={() => handleClose('error')}
                    severity="error"
                    sx={{ width: '100%', fontSize: '1.5rem' }}
                >
                    {serverError}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={7000}
                onClose={() => handleClose('success')}
            >
                <Alert
                    onClose={() => handleClose('success')}
                    severity="success"
                    sx={{ width: '100%', fontSize: '1.5rem' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AlertSnackbar;
