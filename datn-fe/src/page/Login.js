import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginImg from '../assets/login.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../service/AuthService';
import { useEffect } from 'react';
import HandleError from '../utils/HandleError';
import { CircularProgress } from '@mui/material';

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='/'>
        KidsShop
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4fc3f7', // Màu xanh dương nhạt
    },
    secondary: {
      main: '#f06292', // Màu hồng nhạt
    },
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const currentClient = AuthService.getClientId();
    if (currentClient) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      if (!data.get('username') || !data.get('password')) {
        toast.warning('Requie username and password');
        return;
      }
      setIsloading(true);
      await AuthService.login({
        username: data.get('username'),
        password: data.get('password'),
        isRemember: data.get('is-remember'),
      });
      setIsloading(false);
      toast.success('Đăng nhập thành công');
      navigate('/');
    } catch (error) {
      setIsloading(false);
      HandleError.component(error, navigate);
    }

    console.log({
      username: data.get('username'),
      password: data.get('password'),
      isRemember: data.get('is-remember'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(' + LoginImg + ')',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Đăng nhập KidsShop
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='username'
                label='Tên đăng nhập'
                name='username'
                autoComplete='username'
                autoFocus
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Mật khẩu'
                type='password'
                id='password'
                autoComplete='current-password'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id='is-remember'
                    value={true}
                    name='is-remember'
                    color='primary'
                  />
                }
                label='Ghi nhớ đăng nhập'
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2, fontWeight: 'bold', fontSize: 16 }}
              >
                {isLoading ? <CircularProgress color='inherit' /> : 'Đăng nhập'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2'>
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href='/register' variant='body2'>
                    {'Chưa có tài khoản? Đăng ký KidsShop'}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
