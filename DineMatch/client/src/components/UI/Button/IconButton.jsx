import IconButton from '@mui/material/IconButton';
// this is for both the favorite and delete buttons, importing from material ui
// rIconButton is component
// Icon

const rIconButton = ({ onClick, children, type }) => {
    return (
        <IconButton
          type={type}
          variant="contained"
          size="md"
          sx={{
            backgroundColor: 'red',
            borderRadius: '20px',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkred',
            },
            '&:active': {
              backgroundColor: 'red',
            },
          }}
          onClick={onClick}
        >
          {children}
        </IconButton>
    );
  };
  
  export default rIconButton;