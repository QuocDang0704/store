import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PaymentFailed() {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '50px' }}
      >
        Thanh toán thất bại
      </Typography>
      <Typography
        variant='body1'
        gutterBottom
        sx={{ textAlign: 'center', marginTop: '20px' }}
      >
        Đã có lỗi xảy ra trong quá trình thanh toán.
      </Typography>
      <Typography
        variant='body1'
        gutterBottom
        sx={{ textAlign: 'center', marginTop: '20px' }}
      >
        Vui lòng thử lại hoặc <Link to='/'>quay lại trang chủ</Link>.
      </Typography>
      <Button
        variant='contained'
        color='primary'
        component={Link}
        to='/'
        sx={{ marginTop: '20px', textAlign: 'center' }}
      >
        Quay lại trang chủ
      </Button>
    </Container>
  );
}

export default PaymentFailed;
