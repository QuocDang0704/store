import React, { useEffect, useState } from 'react';
import {
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Paper,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import { Button, Grid, Icon, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';
import {
  Add,
  AspectRatio,
  Delete,
  DeleteForeverOutlined,
  Remove,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Security,
  Refresh,
  Support,
} from '@mui/icons-material';
import { GridDeleteIcon } from '@mui/x-data-grid';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [exceededItems, setExceededItems] = useState([]);

  useEffect(() => {
    const exceededItems = cartItems.filter(
      (item) => item.quantityCart > item.quantity,
    );
    setExceededItems(exceededItems);
  }, [cartItems]);

  useEffect(() => {
    setCartItems(
      localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [],
    );
  }, []);

  const handleOpenModal = (id) => {
    setDeleteItemId(id);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setDeleteItemId(null);
  };

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const handleRemoveItem = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleQuantityChange = (event, id) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Chỉ cho phép nhập số
      if (value <= 0) {
        return;
      }
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantityCart: value };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    }
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      return;
    }
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantityCart: quantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handleCheckout = () => {
    const refreshToken =
      localStorage.getItem('refresh_token') ??
      sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      alert('Vui lòng đăng nhập');
      return;
    }

    sessionStorage.setItem('checkout', JSON.stringify(cartItems));
    navigate('/checkout');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantityCart, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantityCart, 0);

  return (
    <>
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🗑️ Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseModal}
            variant='outlined'
            sx={{ borderRadius: '8px' }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              handleRemoveItem(deleteItemId);
              handleCloseModal();
            }}
            variant='contained'
            color='error'
            sx={{ borderRadius: '8px' }}
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ marginBottom: 4 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShoppingCart sx={{ fontSize: '2rem', color: '#1976d2' }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#2c3e50' }}>
                  Giỏ hàng
                </Typography>
                <Chip 
                  label={`${totalItems} sản phẩm`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant='outlined'
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Cảnh báo sản phẩm vượt quá số lượng */}
        {exceededItems.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ marginBottom: 3, borderRadius: '8px' }}
          >
            ⚠️ Có {exceededItems.length} sản phẩm vượt quá số lượng tồn kho. Vui lòng điều chỉnh số lượng.
          </Alert>
        )}

        {/* Danh sách sản phẩm */}
        {cartItems.length > 0 ? (
          <>
            {/* Header bảng */}
            <Paper sx={{ p: 2, marginBottom: 2, backgroundColor: '#f8f9fa' }}>
              <Grid container alignItems='center' spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    Sản phẩm
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                    Giá
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                    Số lượng
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                    Tổng
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                    Thao tác
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item, index) => (
              <Paper
                key={item.id}
                sx={{
                  p: 2,
                  marginBottom: 2,
                  borderRadius: '12px',
                  border: exceededItems.includes(item) ? '2px solid #ff9800' : '1px solid #e0e0e0',
                  backgroundColor: exceededItems.includes(item) ? '#fff3e0' : '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Grid container alignItems='center' spacing={2}>
                  {/* Hình ảnh và thông tin sản phẩm */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box
                        sx={{ 
                          borderRadius: '8px',
                          overflow: 'hidden',
                          width: '80px',
                          height: '80px',
                          cursor: 'pointer'
                        }}
                      >
                        <CardMedia
                          component='img'
                          sx={{
                            height: '80px',
                            width: '80px',
                            objectFit: 'cover'
                          }}
                          image={item.images}
                          alt={item.name}
                          onClick={() => {
                            navigate('/product/' + item.productId);
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#6c757d', marginBottom: 0.5 }}>
                          📏 Size: {item.size.name}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#6c757d' }}>
                          🎨 Màu: {item.color.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Giá */}
                  <Grid item xs={12} md={2}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#e74c3c', textAlign: 'center' }}>
                      {formatVietnameseCurrency(item.price)} ₫
                    </Typography>
                  </Grid>

                  {/* Số lượng */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => handleUpdateQuantity(item.id, item.quantityCart - 1)}
                        sx={{
                          backgroundColor: '#f5f5f5',
                          '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        variant='outlined'
                        InputProps={{
                          inputProps: { min: 1, style: { textAlign: 'center' } },
                          sx: {
                            width: '60px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          },
                        }}
                        value={item.quantityCart}
                        onChange={(e) => handleQuantityChange(e, item.id)}
                      />
                      <IconButton
                        onClick={() => handleUpdateQuantity(item.id, item.quantityCart + 1)}
                        sx={{
                          backgroundColor: '#f5f5f5',
                          '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    {exceededItems.includes(item) && (
                      <Typography variant='caption' sx={{ color: '#ff9800', textAlign: 'center', display: 'block', marginTop: 1 }}>
                        ⚠️ Vượt quá tồn kho ({item.quantity})
                      </Typography>
                    )}
                  </Grid>

                  {/* Tổng */}
                  <Grid item xs={12} md={2}>
                    <Typography variant='body1' sx={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' }}>
                      {formatVietnameseCurrency(item.price * item.quantityCart)} ₫
                    </Typography>
                  </Grid>

                  {/* Thao tác */}
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        onClick={() => handleOpenModal(item.id)}
                        sx={{
                          backgroundColor: '#ffebee',
                          color: '#e74c3c',
                          '&:hover': {
                            backgroundColor: '#ffcdd2',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* Tổng thanh toán */}
            <Paper sx={{ p: 3, marginTop: 3, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      Tổng thanh toán:
                    </Typography>
                    <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#e74c3c' }}>
                      {formatVietnameseCurrency(totalPrice)} ₫
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{ color: '#6c757d', marginTop: 1 }}>
                    Bao gồm {totalItems} sản phẩm
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant='contained'
                    size='large'
                    fullWidth
                    onClick={handleCheckout}
                    disabled={exceededItems.length > 0}
                    sx={{
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      backgroundColor: '#27ae60',
                      '&:hover': {
                        backgroundColor: '#229954',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(39, 174, 96, 0.3)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💳 Thanh toán
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Dịch vụ */}
            <Paper sx={{ p: 3, marginTop: 3, backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                🛡️ Dịch vụ của chúng tôi
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping sx={{ color: '#27ae60' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Giao hàng miễn phí
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security sx={{ color: '#3498db' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Bảo hành chính hãng
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Refresh sx={{ color: '#f39c12' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Đổi trả 30 ngày
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Support sx={{ color: '#e74c3c' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Hỗ trợ 24/7
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          /* Giỏ hàng trống */
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #dee2e6'
          }}>
            <ShoppingCart sx={{ fontSize: '4rem', color: '#6c757d', marginBottom: 2 }} />
            <Typography variant="h5" sx={{ 
              color: '#6c757d', 
              marginBottom: 2,
              fontWeight: 'bold'
            }}>
              😔 Giỏ hàng trống
            </Typography>
            <Typography variant="body1" sx={{ color: '#6c757d', marginBottom: 3 }}>
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </Typography>
            <Button
              variant='contained'
              size='large'
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              🛍️ Mua sắm ngay
            </Button>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default Cart;
