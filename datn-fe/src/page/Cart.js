import React, { useEffect, useState } from 'react';
import {
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Button, Grid, Icon, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/system';
import {
  Add,
  AspectRatio,
  Delete,
  DeleteForeverOutlined,
  Remove,
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

  return (
    <>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button
            onClick={() => {
              handleRemoveItem(deleteItemId);
              handleCloseModal();
            }}
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Container sx={{ minHeight: '70vh', marginTop: 5 }}>
        <Grid container md={12}>
          <Grid container item md={12} spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                GIỎ HÀNG
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant='body1' sx ={{textAlign: 'right'}}>
                <Button
                  variant='contained'
                  onClick={() => navigate('/')}
                >
                  Tiếp tục
                </Button>
                </Typography>
            </Grid>
            <Grid container alignItems='center' sx={{marginTop:5}}>
              <Grid
                item
                md={2}
                sx={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center'  }}
              >
                Ảnh
              </Grid>
              <Grid item md={2} sm={2.5}>
                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  Sản phẩm
                </Typography>
              </Grid>
              <Grid item md={1.5}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                  }}
                >
                  Giá
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                  }}
                >
                  Số lượng
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                  }}
                >
                  Tổng
                </Typography>
              </Grid>
              <Grid
                item
                md={0.5}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}
              ></Grid>
            </Grid>
          </Grid>
          {cartItems.map((item, index) => (
            <Grid
              item
              md={12}
              key={item.id}
              style={{
                backgroundColor: exceededItems.includes(item)
                  ? '#ffebee'
                  : '#f0f0f0',
                padding: '0px',
                margin: '10px 0',
                borderRadius: 10,
              }}
            >
              <Grid container alignItems='center' spacing={2}>
                <Grid item md={2}>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      style={{
                        height: '180px',
                        width: '100%',
                        borderRadius: 10,
                      }}
                      image={item.images}
                      alt={item.name}
                      onClick={() => {
                        navigate('/product/' + item.productId);
                      }}
                    />
                  </CardActionArea>
                </Grid>
                <Grid item md={2}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                  <Typography variant='body2'>
                    Size: {item.size.name}
                  </Typography>
                  <Typography variant='body2'>
                    Color: {item.color.name}
                  </Typography>
                </Grid>
                <Grid item md={1.5}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price)} VND
                  </Typography>
                </Grid>
                <Grid item md={3} style={{ display: 'flex' }}>
                  <Box sx={{ marginX: 'auto' }}>
                    <IconButton
                      variant='contained'
                      color='info'
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantityCart - 1)
                      }
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      id='quantity'
                      variant='filled'
                      InputProps={{
                        inputProps: { min: 1, style: { textAlign: 'center' } },
                        style: {
                          width: '80px',
                          border: 'none',
                          background: '#F0F0F0',
                        },
                      }}
                      value={item.quantityCart}
                      onChange={(e) => handleQuantityChange(e, item.id)}
                    />
                    <IconButton
                      variant='contained'
                      color='info'
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantityCart + 1)
                      }
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item md={2} sx={{ textAlign: 'center' }}>
                  <Typography variant='body1'>
                    {formatVietnameseCurrency(item.price * item.quantityCart)}{' '}
                    VND
                  </Typography>
                </Grid>
                <Grid item md={0.5}>
                  <IconButton
                    variant='contained'
                    color='info'
                    onClick={() => handleOpenModal(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}

          <Grid container style={{ margin: '20px 0' }}>
            <Grid item md={10}>
              <Typography
                variant='h6'
                sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
              >
                Thanh Toán:{' '}
                {formatVietnameseCurrency(
                  cartItems.reduce(
                    (total, item) => total + item.price * item.quantityCart,
                    0,
                  ),
                )}{' '}
                VND
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleCheckout}
                disabled={exceededItems.length > 0}
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
export default Cart;
