import React from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
} from '@mui/material';
import AuthService from '../service/AuthService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const initialValues = {
  email: '',
  firstName: '',
  lastName: '',
  userName: '',
  password: '',
  gender: '', // Sử dụng radio button nên không cần giá trị mặc định ở đây
  phone: '',
  dob: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  firstName: Yup.string().required('Họ là bắt buộc'),
  lastName: Yup.string().required('Tên là bắt buộc'),
  userName: Yup.string().required('Tên đăng nhập là bắt buộc'),
  password: Yup.string().required('Mật khẩu là bắt buộc'),
  gender: Yup.string().required('Giới tính là bắt buộc'),
  phone: Yup.string()
    .matches(/^(0\d{9,10})$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  dob: Yup.string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Ngày sinh không hợp lệ theo định dạng yyyy-MM-dd',
    )
    .required('Ngày sinh là bắt buộc'),
});

function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    console.log(values);
    const res = await AuthService.register(values);
    toast.success('Đăng ký thành công');
    navigate('/login');
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  return (
    <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <img src={logo} alt='KidsShop Logo' style={{ width: 70, marginBottom: 8 }} />
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#4fc3f7', marginBottom: 1, textAlign: 'center' }}>
          Đăng ký KidsShop
        </Typography>
      </Box>
      <Box sx={{ background: '#fff', borderRadius: 3, boxShadow: 3, p: 4, width: '100%', maxWidth: 450 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label='Email'
            type='email'
            name='email'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label='Họ'
            name='firstName'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            label='Tên'
            name='lastName'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            label='Tên đăng nhập'
            name='userName'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />
          <TextField
            label='Mật khẩu'
            type='password'
            name='password'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControl component='fieldset' sx={{ marginBottom: 2 }}>
            <FormLabel component='legend'>Giới tính</FormLabel>
            <RadioGroup
              aria-label='gender'
              name='gender'
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              row
            >
              <FormControlLabel value='0' control={<Radio color='primary' />} label='Nam' />
              <FormControlLabel value='1' control={<Radio color='secondary' />} label='Nữ' />
            </RadioGroup>
            {formik.touched.gender && formik.errors.gender && (
              <Typography color='error'>{formik.errors.gender}</Typography>
            )}
          </FormControl>
          <TextField
            label='Số điện thoại'
            name='phone'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            label='Ngày sinh (yyyy-MM-dd)'
            name='dob'
            variant='outlined'
            fullWidth
            sx={{ marginBottom: 2 }}
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
          />
          <Button
            variant='contained'
            color='primary'
            type='submit'
            sx={{ width: '100%', py: 1.5, fontWeight: 'bold', fontSize: 18, borderRadius: 2, mt: 1, mb: 2 }}
          >
            Đăng ký
          </Button>
          <Typography align='center' variant='body2'>
            Đã có tài khoản?{' '}
            <span style={{ color: '#f06292', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/login')}>
              Đăng nhập KidsShop
            </span>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}
export default Register;
