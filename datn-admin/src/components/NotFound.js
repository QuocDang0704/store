import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NotFound404 from '../assets/404.png';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth='md'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant='h1'>404</Typography>
            <Typography variant='h6'>
              The page you’re looking for doesn’t exist.
            </Typography>
            <Typography
              variant='h6'
              noWrap
              component='a'
              href='/'
              sx={{
                mt: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Button variant='contained'>Back Home</Button>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src={NotFound404} alt='' width='100%' />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default NotFound;
