import Button from '@mui/material/Button';


const rButton = ({ onClick, children, disabled, type, ...props }) => {
    return (
        <>
            {disabled ? 
                <Button 
                    type={type}
                    variant="contained" 
                    size="large" 
                    disabled
                    sx={{ 
                        backgroundColor: 'orange',
                        borderRadius: '20px',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'darkorange', 
                        },
                        '&:active': {
                        backgroundColor: 'red',
                        },
                    }}
                    onClick={onClick}
                >
                    {children}
                </Button> :
                    <Button 
                        type={type}
                        variant="contained" 
                        size="large" 
                        sx={{ 
                            backgroundColor: 'orange',
                            borderRadius: '20px',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'darkorange', 
                            },
                            '&:active': {
                            backgroundColor: 'red',
                            },
                        }}
                        onClick={onClick}
                        {...props}
                    >
                        {children}
                    </Button>
            }
        </>
    )
}

export default rButton