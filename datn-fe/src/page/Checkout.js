import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Button,
  Fade,
  Grid,
  Modal,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';
import UserService from '../service/UserService';
import { toast } from 'react-toastify';
import validator from 'validator';
import AuthService from '../service/AuthService';
import ProductService from '../service/ProductService';
import OrderService from '../service/OrderService';
import { 
  Add, 
  AddCircle, 
  AddCircleOutline, 
  LocationOn, 
  Phone, 
  Person, 
  ShoppingCart, 
  Payment, 
  LocalShipping,
  CheckCircle,
  CreditCard,
  Receipt,
  Close
} from '@mui/icons-material';

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
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Thông tin giao hàng', 'Xem lại đơn hàng', 'Thanh toán'];

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

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Person sx={{ mr: 1 }} />
                Thông tin người nhận
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Họ và tên'
                    value={fullName}
                    onChange={handleFullNameChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Số điện thoại'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    fullWidth
                    variant="outlined"
                    error={!isPhoneNumberValid}
                    helperText={!isPhoneNumberValid && 'Số điện thoại không hợp lệ'}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <LocationOn sx={{ mr: 1 }} />
                Địa chỉ giao hàng
              </Typography>
              
              {!isPhoneNumberValid && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Vui lòng nhập số điện thoại hợp lệ trước khi tiếp tục
                </Alert>
              )}

              <Grid container spacing={2}>
                {listAddress?.map((address) => (
                  <Grid item xs={12} md={6} lg={4} key={address.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: selectedAddress && selectedAddress.id === address.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        backgroundColor: selectedAddress && selectedAddress.id === address.id ? '#f3f8ff' : 'white',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: '#f3f8ff',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {address.exact}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {address.ward}, {address.district}, {address.province}
                        </Typography>
                        {address.isDefault && (
                          <Chip 
                            label="Mặc định" 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12} md={6} lg={4}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      border: '2px dashed #1976d2',
                      backgroundColor: '#f8f9fa',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                      },
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => navigate('/address')}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <AddCircleOutline sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        Thêm địa chỉ mới
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ShoppingCart sx={{ mr: 1 }} />
                Chi tiết đơn hàng
              </Typography>
              
              {checkoutItems?.map((item, index) => (
                <Card key={item.id} sx={{ mb: 2, backgroundColor: '#fafafa' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <Avatar
                          src={item.images}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Chip label={`Size: ${item.size.name}`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`Color: ${item.color.name}`} size="small" />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          Đơn giá
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {formatVietnameseCurrency(item.price)} VND
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          Số lượng
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.quantityCart}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          Thành tiền
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {formatVietnameseCurrency(item.price * item.quantityCart)} VND
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Receipt sx={{ mr: 1 }} />
                Mã giảm giá
              </Typography>

              <Grid container spacing={2}>
                {coupons?.map((coupon) => (
                  <Grid item xs={12} md={6} lg={4} key={coupon.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: coupon && coupon.id === selectedCoupon?.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        backgroundColor: coupon && coupon.id === selectedCoupon?.id ? '#f3f8ff' : 'white',
                        opacity: !(checkoutItems?.reduce((total, item) => total + item.price * item.quantityCart, 0) >= coupon.conditions) ? 0.5 : 1,
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: '#f3f8ff',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => {
                        if (checkoutItems?.reduce((total, item) => total + item.price * item.quantityCart, 0) >= coupon.conditions) {
                          handleCouponSelect(
                            checkoutItems?.reduce((total, item) => total + item.price * item.quantityCart, 0),
                            coupon,
                          );
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                          -{formatVietnameseCurrency(coupon.discountAmount)} VND
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cho đơn hàng từ {formatVietnameseCurrency(coupon.conditions)} VND
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {selectedCoupon && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleRemoveCoupon}
                    startIcon={<Close />}
                    color="error"
                  >
                    Loại bỏ mã giảm giá
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Payment sx={{ mr: 1 }} />
                Phương thức thanh toán
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      border: paymentMethod === 'PaymentOverVnpay' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: paymentMethod === 'PaymentOverVnpay' ? '#f3f8ff' : 'white',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: '#f3f8ff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => setPaymentMethod('PaymentOverVnpay')}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <CreditCard sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Thanh toán qua VNPay
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thanh toán an toàn qua cổng VNPay
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      border: paymentMethod === 'PaymentOnDelivery' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: paymentMethod === 'PaymentOnDelivery' ? '#f3f8ff' : 'white',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: '#f3f8ff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => setPaymentMethod('PaymentOnDelivery')}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <LocalShipping sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Thanh toán khi nhận hàng
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thanh toán tiền mặt khi nhận hàng
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && (!isPhoneNumberValid || !selectedAddress)) {
      toast.warning('Vui lòng điền đầy đủ thông tin và chọn địa chỉ giao hàng');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
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
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '500px',
              margin: 'auto',
              marginTop: '100px',
              boxShadow: 24,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                Xác nhận đặt hàng
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>
            
            <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant='body1' sx={{ mb: 1, fontWeight: 'bold' }}>
                  Người nhận: {fullName}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  Địa chỉ: {selectedAddress ? `${selectedAddress.exact}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}` : ''}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  Số điện thoại: {phoneNumber}
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Tổng thanh toán: {formatVietnameseCurrency(totalAmount)} VND
                </Typography>
              </CardContent>
            </Card>

            <Button
              variant='contained'
              color='primary'
              onClick={handleCheckout}
              fullWidth
              size="large"
              sx={{ fontWeight: 'bold' }}
            >
              Xác nhận đặt hàng
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Thanh toán đơn hàng
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
          >
            Quay lại
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Tổng thanh toán: {formatVietnameseCurrency(totalAmount)} VND
            </Typography>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenModal}
                disabled={!isPhoneNumberValid || !selectedAddress}
                sx={{ fontWeight: 'bold', px: 4 }}
              >
                Thanh toán
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNext}
                sx={{ fontWeight: 'bold', px: 4 }}
              >
                Tiếp tục
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Checkout;
