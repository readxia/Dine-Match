import { Grid, Box, Paper } from '@mui/material';

const FormLayout = ({ children }) => {

return (
<Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
        <Grid item xs={10.5} sm={12} sx={{ display: 'block', justifyContent: 'center'}}>
            <Paper sx={{
                width: '100%',
                maxWidth: '600px',
                padding: '20px',
                margin: '50px auto',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.817)',
            }}>
                {children}
            </Paper>
        </Grid>
    </Grid>
</Box>
)}

export default FormLayout;