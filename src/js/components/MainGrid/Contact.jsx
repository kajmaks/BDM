import React from 'react';
import { Button, FormControl, TextField, Box } from '@mui/material';
import { Label } from '@mui/icons-material';

const ContactSection = () => {
  return (
    <FormControl
      sx={{
        width: '100%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        variant="outlined"
        label="Imię i nazwisko"
        margin="normal"
        fullWidth
        required
        type="text"
        placeholder="Jan Kowalski"
      />
      <TextField
        variant="outlined"
        label="Email"
        margin="normal"
        fullWidth
        required
        type="email"
        placeholder="jan.kowalski@gmail.com"
      />
      <TextField
        multiline
        margin="normal"
        rows={6}
        variant="outlined"
        fullWidth
        required
        type="text"
        label="Pole Tekstowe"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" sx={{ width: '20%' }} color="primary" type="submit">
          Wyślij
        </Button>
      </Box>
    </FormControl>
  );
};

export default ContactSection;
