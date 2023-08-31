import React from 'react';
import '../Landing.css';
import { Container, Typography, Box } from '@mui/material';
import dineMatchLogo from '../../assets/DMlogo.jpg';

const Footer = () => {
  return (
    <Box mt={5}>
      <Container maxWidth="sm">
        <Box textAlign="center">
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © DineMatch'}
          </Typography>
          <img src={dineMatchLogo} alt="DineMatch Logo" className="footerLogo" />
        </Box>
        <Typography variant="body2" color="textSecondary" align="center">
          DineMatch {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
