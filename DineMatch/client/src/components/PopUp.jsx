import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from './UI/Button/Button';


const Popup = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleYes = () => {
    navigate('/TasteProfile');
  };

  const handleNo = () => {
    setOpen(false);
    navigate('/Discover');
  };

  return (
    <Dialog
      open={open}
      onClose={handleNo}
      maxWidth="md"
      fullWidth={true}
      PaperProps={{
        className: 'popup-dialog', // Add the CSS class name
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '3.5rem', fontFamily: 'Galada' }}>
        Welcome Back to DineMatch!
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', fontSize: '2rem', fontFamily: 'Helvetica' }}>
        <Typography variant="body1" sx={{fontSize: '1.5rem'}}>
          Do you want to update your taste profile?
        </Typography>
      </DialogContent>

      <DialogActions style={{ justifyContent: 'center', gap: '8px', paddingBottom: '40px' }}>
        <Stack direction="row" spacing={2}>
          <Button onClick={handleYes}>Yes</Button>
          <Button onClick={handleNo}>No</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
