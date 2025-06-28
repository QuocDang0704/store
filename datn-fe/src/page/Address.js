import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import AddressService from '../service/AddressService';
import Loading from '../utils/Loading';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { color } from '@mui/system';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddressPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titleForm, setTitleForm] = useState('Thêm mới địa chỉ');
  const [initialValues, setInitialValues] = useState({
    id: 0,
    district: '',
    exact: '',
    province: '',
    ward: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await AddressService.getAddress();
    setAddresses(res?.response?.content);
    setIsLoading(false);
  };

  const handleSubmit = async (newAddress) => {
    toast.success(titleForm + ' thành công');
    const res = await AddressService.createAddress(newAddress);
    fetchData();
  };

  const setValueInit = (address) => {
    if (address == null) {
      setInitialValues({
        id: 0,
        district: '',
        exact: '',
        province: '',
        ward: '',
        isDefault: false,
      });
    } else {
      setInitialValues({
        id: address.id,
        district: address.district,
        exact: address.exact,
        province: address.province,
        ward: address.ward,
        isDefault: address.isDefault,
      });
    }
  };
  const validationSchema = Yup.object({
    district: Yup.string().required('Vui lòng nhập quận/huyện'),
    exact: Yup.string().required('Vui lòng nhập số nhà, đường'),
    province: Yup.string().required('Vui lòng nhập tỉnh/thành phố'),
    ward: Yup.string().required('Vui lòng nhập phường/xã'),
  });

  const onEdit = async (address) => {
    setTitleForm('Cập nhật địa chỉ');
    setValueInit(address);
  };
  const onDelete = async (address) => {
    console.log('delete', address);

    const res = await AddressService.delete(address.id);
    toast.success('Xóa thành công');
    fetchData();
  };

  return (
    <Container sx={{ minHeight: '70vh', marginTop: 5 }}>
    <Grid container md={12}>
      <Grid container item md={12} spacing={2}>
      <Loading isLoading={isLoading} />
      <Grid item xs={12} md={6}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
        ĐỊA CHỈ GIAO HÀNG
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
          <Typography variant='body1' sx ={{textAlign: 'right'}}>
          <Button
            variant='contained'
            onClick={() => navigate('/checkout')}
          >
            QUAY LẠI ĐƠN HÀNG
          </Button>
          </Typography>
      </Grid>
      <Grid item xs={12}>
      {addresses.map((address) => (
        <Box key={address.id} sx={{ border: 1, padding: 2, marginBottom: 2 }}>
          <Typography variant='subtitle1'>
            {address.exact}, {address.ward}, {address.district},{' '}
            {address.province}
          </Typography>
          {address.isDefault && (
            <Typography variant='caption'>Địa chỉ mặc định</Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 1,
            }}
          >
            <Button
              variant='outlined'
              color='primary'
              onClick={() => onEdit(address)}
            >
              Sửa
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => onDelete(address)}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} /> 
      <Button variant="contained" sx={{ backgroundColor: '#C0C0C0', color: 'black' }}
        onClick={() => {
          setTitleForm('Thêm mới địa chỉ');
          setValueInit(null);
        }}
      >
        Thêm mới
      </Button>
        <Box sx={{ border: 1, padding: 2, marginTop: 2, marginBottom: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginY: 1 }}>{titleForm}</Typography>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);

            setValueInit(null);
            // resetForm();
          }}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  name='exact'
                  label='Số nhà, đường'
                  fullWidth
                />
                <ErrorMessage name='exact' component='div' />
              </Grid>
              <Grid item xs={6}>
                <Field as={TextField} name='ward' label='Phường/Xã' fullWidth />
                <ErrorMessage name='ward' component='div' />
              </Grid>
              <Grid item xs={6}>
                <Field
                  as={TextField}
                  name='district'
                  label='Quận/Huyện'
                  fullWidth
                />
                <ErrorMessage name='district' component='div' />
              </Grid>
              <Grid item xs={6}>
                <Field
                  as={TextField}
                  name='province'
                  label='Tỉnh/Thành phố'
                  fullWidth
                />
                <ErrorMessage name='province' component='div' />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='h7' gutterBottom>
                  {'Đặt làm địa chỉ mặc định '}
                </Typography>
                <Field as={TextField} name='isDefault' type='checkbox' />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: '#C0C0C0', color: 'black' }}
                  color='primary'
                  type='submit'
                >
                  {titleForm}
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Box>
      </Grid>
      </Grid>
      </Grid>
    </Container>
  );
};

export default AddressPage;
