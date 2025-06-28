import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/system';
import { toast } from 'react-toastify';
import AuthService from '../service/AuthService';
import OrderService from '../service/OrderService';
import { useParams } from 'react-router-dom';
import { ca, fi } from 'date-fns/locale';
import HandleError from '../utils/HandleError';
import { set } from 'date-fns';
import ProductService from '../service/ProductService';

function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentClient = AuthService.getClientId();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getById(id);
      var order = res?.response;
      order = {
        ...order,
        status: convertStatus(order.status),
        orderDate: new Date(order.createdDate).toLocaleDateString('vi-VN'),
      }

      console.log(order);
      setData(order);
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };
  const convertStatus = (status) => {
    switch (status) {
      case 'WaitForConfirmation':
        return 'Chờ xác nhận';
      case 'PreparingGoods':
        return 'Đang chuẩn bị hàng';
      case 'Delivery':
        return 'Đang giao hàng';
      case 'Success':
        return 'Thành công';
      case 'Cancel':
        return 'Đã hủy';
      default:
        return '';
    }
  }
  const printInvoice = () => {
    console.log('print');
    const printContent = document.getElementById('invoice-content');
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContents;
  };

  return (
    <>
      <Container sx={{ marginTop: 3 }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold' }}>
          Chi tiết đơn hàng
        </Typography>
        <Grid container style={{ margin: '20px 0' }} justifyContent={'flex-end'}>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={printInvoice}>In hóa đơn</Button>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: '30px' }} id='invoice-content'>
          <Grid container item spacing={3} justifyContent={'flex-start'}>
            <Grid item xs={5}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
                Thông tin đơn hàng
              </Typography>
              
              <Typography variant='body1' >
                Khách hàng: {data.user?.firstName} {data.user?.lastName}
              </Typography>

              <Typography variant='body1' >
                Mã đơn hàng: {data.id}
              </Typography>

              <Typography variant='body1' >
                Ngày đặt hàng: {data.orderDate}
              </Typography>

              <Typography variant='body1' >
                Trạng thái: {data.status}
              </Typography>

              <Typography variant='body1' >
                Phương thức thanh toán: {data.paymentMethod}
              </Typography>

              <Typography variant='body1' >
                Địa chỉ: {data.address}
              </Typography>

              <Typography variant='body1' >
                Số điện thoại: {data.phone}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems='center'>
              <Grid
                item
                xs={2.5}
                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              >
                Ảnh
              </Grid>
              <Grid item xs={2}>
                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  Sản phẩm
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  Giá
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  Số lượng
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  Tổng
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {data?.orderDetails?.map((item, index) => (
            <Grid
              item
              xs={12}
              key={item.id}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '0px',
                margin: '10px 0',
                borderRadius: '10px',
              }}
            >
              <Grid container alignItems='center'>
                <Grid item xs={2.5}>
                  <img
                    src={'http://localhost:8080/' + item.productDetail.images}
                    alt={item.productDetail.id}
                    style={{
                      width: '100%',
                      maxWidth: '150px',
                      maxHeight: '150px',
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  {/* <Typography variant='subtitle1'>{item.name}</Typography> */}
                  <Typography variant='body2'>
                    Size: {item.productDetail.size.name}
                  </Typography>
                  <Typography variant='body2'>
                    Color: {item.productDetail.color.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price)} VND
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography variant='body1'>{item.quantity}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price * item.quantity)}{' '}
                    VND
                  </Typography>
                </Grid>

              </Grid>
            </Grid>
          ))}
          <Grid container style={{ margin: '20px 0' }} justifyContent={'flex-end'}>
            <Grid item xs={4}>
              <Typography variant='body1' sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Tổng tiền: {formatVietnameseCurrency(data.total)} VND
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default OrderDetailPage;
