import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Button,
  Fade,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/system';
import UserService from '../service/UserService';
import { toast } from 'react-toastify';
import validator from 'validator';
import AuthService from '../service/AuthService';
import ProductService from '../service/ProductService';
import OrderService from '../service/OrderService';
import { Add, AddCircle, AddCircleOutline } from '@mui/icons-material';

function Checkout() {
  const navigate = useNavigate();
  const currentClient = AuthService.getClientId();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [listAddress, setListAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [fullName, setFullName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PaymentOverVnpay');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setCheckoutItems(
        sessionStorage.getItem('checkout')
          ? JSON.parse(sessionStorage.getItem('checkout'))
          : navigate('/cart'),
      );
      setTotalAmount(
        JSON.parse(sessionStorage.getItem('checkout')).reduce(
          (total, item) =>
            Number(total) + Number(item.price * item.quantityCart),
          0,
        ),
      );
    } catch (error) {
      toast.warning('Bạn cần quay lại giỏ hàng');
      navigate('/cart');
    }

    const res2 = await UserService.getVoucher();
    const resUser = await UserService.getUserByUserName(currentClient);

    var address = resUser?.response?.addresses?.find(
      (address) => address.isDefault,
    );
    setSelectedAddress(address);
    setCoupons(res2?.response?.content);
    setListAddress(resUser?.response?.addresses);
    setPhoneNumber(resUser?.response?.phone);

    setFullName(currentClient);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCouponSelect = (initTotal, selectedCoupon) => {
    setSelectedCoupon(selectedCoupon);
    setTotalAmount(Number(initTotal) - Number(selectedCoupon?.discountAmount));
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setTotalAmount(
      checkoutItems?.reduce(
        (total, item) => Number(total) + Number(item.price * item.quantityCart),
        0,
      ),
    );
  };

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };
  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    setPhoneNumber(value);
    setIsPhoneNumberValid(validator.isMobilePhone(value, 'vi-VN'));
  };
  const handleFullNameChange = (event) => {
    const { value } = event.target;
    setFullName(value);
  };

  const handleCheckout = async () => {
    if (selectedAddress) {
      sessionStorage.setItem(
        'checkout',
        JSON.stringify({
          address: selectedAddress,
          items: checkoutItems,
        }),
      );
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      var orderDetailDtos = checkoutItems.map((item) => ({
        productDetailId: item.id,
        price: item.price,
        quantity: item.quantityCart,
        totalPrice: Number(item.price) * Number(item.quantityCart),
      }));
      var totalInit = checkoutItems?.reduce(
        (total, item) => total + item.price * item.quantityCart,
        0,
      );

      const reqCheckOut = {
        voucherId: selectedCoupon ? selectedCoupon.id : null,
        total: totalAmount,
        totalInit: totalInit == null ? totalAmount : totalInit,
        paymentMethods: paymentMethod,
        shipPrice: 0,
        description: 'Đơn hàng được tạo ngày ' + `${year}-${month}-${day}`,
        address:
          selectedAddress.exact +
          ', ' +
          selectedAddress.ward +
          ', ' +
          selectedAddress.district +
          ', ' +
          selectedAddress.province,
        phone: phoneNumber,
        name: fullName,
        orderDetailDtos: orderDetailDtos,
      };

      console.log(reqCheckOut);
      const response = await OrderService.createOrder(reqCheckOut);
      toast.success('Tạo đơn hàng thành công');
      console.log(response, paymentMethod);
      localStorage.removeItem('cart');
      if (paymentMethod == 'PaymentOverVnpay') {
        window.location.href = response?.response?.link;
      }
      navigate('/');
    } else {
      toast.warning('Vui lòng chọn địa chỉ giao hàng');
    }
  };

  return (
    <>
      <Container sx={{ marginTop: 3 }}>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Fade in={openModal}>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '400px',
                margin: 'auto',
                marginTop: '100px',
              }}
            >
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
                Xác Nhận Đặt Hàng
              </Typography>
              <Typography variant='body1' gutterBottom>
                Người nhận: {fullName}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Địa Chỉ Giao Hàng:{' '}
                {selectedAddress
                  ? `${selectedAddress.exact}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
                  : ''}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Số Điện Thoại: {phoneNumber}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Tổng Thanh Toán: {formatVietnameseCurrency(totalAmount)}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={handleCheckout}
                fullWidth
              >
                Xác Nhận Đặt Hàng
              </Button>
            </Box>
          </Fade>
        </Modal>

        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold' }}>
          Thanh Toán Hóa Đơn
        </Typography>
        <Grid container spacing={3} sx={{ marginTop: '30px' }}>
          <Grid item xs={12}>
            <TextField
              label='Họ và tên'
              value={fullName}
              onChange={handleFullNameChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label='Số điện thoại'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              fullWidth
              error={!isPhoneNumberValid}
              helperText={!isPhoneNumberValid && 'Số điện thoại không hợp lệ'}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              sx={{ fontWeight: 'bold', marginBottom: '20px' }}
            >
              Địa Chỉ Giao Hàng
            </Typography>
            <Grid container spacing={2}>
              {listAddress?.map((address) => (
                <Grid item xs={3} key={address.id}>
                  <Button
                    sx={{
                      padding: '5px 10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                    variant={
                      selectedAddress && selectedAddress.id === address.id
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() => handleAddressSelect(address)}
                    fullWidth
                  >
                    {address.exact}, {address.ward}, {address.district},{' '}
                    {address.province}
                  </Button>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Button
                  sx={{
                    padding: '5px 10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    height: '60px',
                  }}
                  onClick={() => navigate('/address')}
                  variant={'outlined'}
                  fullWidth
                >
                  <Typography
                    sx={{
                      padding: '5px 10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Thêm địa chỉ giao hàng{' '}
                  </Typography>
                  <AddCircleOutline sx={{ fontSize: 30 }} />
                </Button>
              </Grid>
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
          {checkoutItems?.map((item, index) => (
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
                    src={item.images}
                    alt={item.name}
                    style={{
                      width: '100%',
                      maxWidth: '150px',
                      maxHeight: '150px',
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='subtitle1'>{item.name}</Typography>
                  <Typography variant='body2'>
                    Size: {item.size.name}
                  </Typography>
                  <Typography variant='body2'>
                    Color: {item.color.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price)} VND
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography variant='body1'>{item.quantityCart}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price * item.quantityCart)}{' '}
                    VND
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography
              variant='h5'
              sx={{ fontWeight: 'bold', marginBottom: '20px' }}
            >
              Mã Giảm Giá
            </Typography>
            <Grid container spacing={2}>
              {coupons?.map((coupon) => (
                <Grid item xs={3} key={coupon.id}>
                  <Button
                    sx={{
                      padding: '5px 10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                    variant={
                      coupon && coupon.id === selectedCoupon?.id
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      handleCouponSelect(
                        checkoutItems?.reduce(
                          (total, item) =>
                            total + item.price * item.quantityCart,
                          0,
                        ),
                        coupon,
                      )
                    }
                    fullWidth
                    disabled={
                      !(
                        checkoutItems?.reduce(
                          (total, item) =>
                            total + item.price * item.quantityCart,
                          0,
                        ) >= coupon.conditions
                      )
                    }
                  >
                    Giảm {formatVietnameseCurrency(coupon.discountAmount)} VND
                    cho đơn hàng từ{' '}
                    {formatVietnameseCurrency(coupon.conditions)} VND
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={4}>
            {selectedCoupon ? (
              <Button variant='outlined' onClick={handleRemoveCoupon}>
                Loại bỏ mã giảm giá
              </Button>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              sx={{ fontWeight: 'bold', marginBottom: '20px' }}
            >
              Phương Thức Thanh Toán
            </Typography>
            <Grid container item spacing={3} xs={12}>
              <Grid item xs={2}>
                <Button
                  variant={
                    paymentMethod === 'PaymentOverVnpay'
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => setPaymentMethod('PaymentOverVnpay')}
                  fullWidth
                  sx={{
                    marginBottom: '10px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  Thanh toán qua VNPay
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant={
                    paymentMethod === 'PaymentOnDelivery'
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => setPaymentMethod('PaymentOnDelivery')}
                  fullWidth
                  sx={{
                    marginBottom: '10px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  Thanh toán khi nhận hàng
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid container style={{ margin: '20px 0' }}>
            <Grid item xs={10}>
              <Typography
                variant='h6'
                sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
              >
                Tổng Thanh Toán:{' '}
                {totalAmount !==
                checkoutItems?.reduce(
                  (total, item) => total + item.price * item.quantityCart,
                  0,
                ) ? (
                  <>
                    <span
                      style={{ textDecoration: 'line-through', opacity: 0.5 }}
                    >
                      {formatVietnameseCurrency(
                        checkoutItems?.reduce(
                          (total, item) =>
                            total + item.price * item.quantityCart,
                          0,
                        ),
                      )}{' '}
                      VND
                    </span>
                    <> {formatVietnameseCurrency(totalAmount)}</>
                  </>
                ) : (
                  formatVietnameseCurrency(
                    checkoutItems?.reduce(
                      (total, item) => total + item.price * item.quantityCart,
                      0,
                    ),
                  )
                )}{' '}
                VND
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant='contained'
                color='primary'
                disabled={!isPhoneNumberValid || !selectedAddress}
                onClick={handleOpenModal}
              >
                Thanh Toán
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Checkout;
