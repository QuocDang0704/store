import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Box,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import ProductService from '../service/ProductService';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/system';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Refresh,
  Support,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SingleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [productTemp, setProductTemp] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [listSizeActive, setListSizeActive] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    updateRemainingQuantity();
    updateListSize();
  }, [selectedColor, selectedSize]);

  const addToCartHandler = () => {
    if (selectedColor && selectedSize && quantity) {
      const selectedProductDetail = product.productDetails.find(
        (detail) =>
          detail.color.id === selectedColor.id &&
          detail.size.id === selectedSize.id,
      );
      var productData = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantityCart: quantity,
        ...selectedProductDetail,
      };
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = cart.findIndex(
        (item) => item.id === selectedProductDetail.id,
      );

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantityCart =
          Number(cart[existingProductIndex].quantityCart) + Number(quantity);
      } else {
        cart.push(productData);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('🛒 Đã thêm vào giỏ hàng thành công!');
      navigate('/cart');
    }
  };

  const fetchProduct = async () => {
    const response = await ProductService.getProductById(id);
    setProduct(response?.response);
    setProductTemp(response?.response);
    if (response?.response?.productDetails.length > 0) {
      setMainImage(response?.response?.productDetails[0].images);
    }

    var productDetail = response?.response.productDetails[0];
    setSelectedColor(productDetail.color);
    setSelectedSize(productDetail.size);
  };
  const updateRemainingQuantity = () => {
    if (selectedColor && selectedSize) {
      const selectedProductDetail = product.productDetails.find(
        (detail) =>
          detail.color.id === selectedColor.id &&
          detail.size.id === selectedSize.id,
      );
      if (selectedProductDetail) {
        setRemainingQuantity(selectedProductDetail.quantity);
      }
    }
  };

  const updateListSize = () => {
    let temp = [];
    if (selectedColor) {
      product.productDetails.forEach((detail) => {
        if (detail.color.id === selectedColor.id) {
          temp.push(detail.size.id);
        }
      });
    }
    setListSizeActive(temp);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(Number(quantity) - Number(1));
    }
  };

  const increaseQuantity = () => {
    setQuantity(Number(quantity) + Number(1));
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Chỉ cho phép nhập số
      setQuantity(value);
      if (value > remainingQuantity) {
        setError('Vui lòng nhập số lượng nhỏ hơn ' + remainingQuantity);
        return;
      }
      setError('');
    }
  };
  const handleChangeSize = (detail) => {
    setSelectedSize(detail.size);

    const selectedProductDetail = product.productDetails.find(
      (i) => i.color.id === selectedColor.id && i.size.id === detail.size.id,
    );
    setMainImage(selectedProductDetail?.images);
  };

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Phần hình ảnh sản phẩm */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Hình ảnh chính */}
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                marginBottom: 2
              }}
            >
              <CardMedia
                component='img'
                sx={{ 
                  width: '100%', 
                  height: '600px',
                  objectFit: 'cover'
                }}
                image={
                  mainImage || (product?.images ? product.images[0] : null)
                }
                alt={product?.name}
              />
            </Paper>
            
            {/* Thumbnail images */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product?.productDetails.map((detail) => (
                <Paper
                  key={detail.id}
                  elevation={2}
                  sx={{ 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: mainImage === detail.images ? '2px solid #1976d2' : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => setMainImage(detail.images)}
                >
                  <CardMedia
                    component='img'
                    sx={{ height: '80px', width: '80px', objectFit: 'cover' }}
                    image={detail.images}
                    alt={product?.name}
                  />
                </Paper>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Phần thông tin sản phẩm */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Tên sản phẩm */}
            <Typography 
              variant='h3' 
              sx={{ 
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: 2,
                lineHeight: 1.2
              }}
            >
              {product?.name}
            </Typography>

            {/* Giá sản phẩm */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
              <Typography
                variant='h4'
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#e74c3c',
                  fontSize: '2.5rem'
                }}
              >
                {formatVietnameseCurrency(product?.price)} ₫
              </Typography>
              <Chip 
                label="HOT" 
                color="error" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Thông tin cơ bản */}
            <Paper sx={{ p: 2, marginBottom: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant='body1' sx={{ color: '#6c757d', marginBottom: 1 }}>
                📦 Chất liệu: <strong>{product?.material}</strong>
              </Typography>
              <Typography variant='body1' sx={{ color: '#6c757d' }}>
                🏢 Nhà cung cấp: <strong>{product?.supplier?.name}</strong>
              </Typography>
            </Paper>

            {/* Chọn màu sắc */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                🎨 Màu sắc: {selectedColor?.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {productTemp?.productDetails
                  .filter(
                    (detail, index, self) =>
                      index ===
                      self.findIndex((t) => t.color.id === detail.color.id),
                  )
                  .map((detail) => (
                    <Button
                      key={detail.color.id}
                      variant='contained'
                      sx={{
                        backgroundColor: detail.color.hex,
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        borderRadius: '50%',
                        boxShadow:
                          selectedColor?.id === detail.color.id
                            ? '0 0 0 3px #fff, 0 0 0 6px ' + detail.color.hex
                            : '0 2px 8px rgba(0,0,0,0.2)',
                        border: '1.5px solid #888',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => {
                        setSelectedColor(detail.color);
                        setSelectedSize(null);
                      }}
                    />
                  ))}
              </Box>
            </Box>

            {/* Chọn kích cỡ */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                📏 Kích cỡ: {selectedSize?.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {productTemp?.productDetails
                  .filter(
                    (detail, index, self) =>
                      index === self.findIndex((t) => t.size.id === detail.size.id),
                  )
                  .map((detail) => (
                    <Button
                      key={detail.size.id}
                      variant={listSizeActive.includes(detail.size.id) ? 'contained' : 'outlined'}
                      disabled={!listSizeActive.includes(detail.size.id)}
                      sx={{
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        backgroundColor: listSizeActive.includes(detail.size.id)
                          ? selectedSize?.id === detail.size.id
                            ? '#1976d2'
                            : '#f5f5f5'
                          : '#f0f0f0',
                        color: listSizeActive.includes(detail.size.id)
                          ? selectedSize?.id === detail.size.id
                            ? '#fff'
                            : '#333'
                          : '#999',
                        border: selectedSize?.id === detail.size.id
                          ? '2px solid #1976d2'
                          : '2px solid #e0e0e0',
                        '&:hover': {
                          backgroundColor: selectedSize?.id === detail.size.id
                            ? '#1565c0'
                            : '#e3f2fd',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleChangeSize(detail)}
                    >
                      {detail.size.name}
                    </Button>
                  ))}
              </Box>
            </Box>

            {/* Chọn số lượng */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                🔢 Số lượng
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={decreaseQuantity}
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <RemoveCircleOutline />
                </IconButton>
                <TextField
                  id='quantity'
                  variant='outlined'
                  error={error !== ''}
                  InputProps={{
                    inputProps: { min: 1, style: { textAlign: 'center' } },
                    sx: {
                      width: '80px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    },
                  }}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <IconButton 
                  onClick={increaseQuantity}
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <AddCircleOutline />
                </IconButton>
                <Typography variant='body2' sx={{ color: '#6c757d' }}>
                  Còn lại: <strong>{remainingQuantity}</strong> sản phẩm
                </Typography>
              </Box>
              {error && (
                <Typography variant='body2' sx={{ color: '#e74c3c', marginTop: 1 }}>
                  ⚠️ {error}
                </Typography>
              )}
            </Box>

            {/* Nút hành động */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              <Button
                variant='contained'
                size='large'
                startIcon={<ShoppingCart />}
                disabled={
                  !(
                    selectedColor &&
                    selectedSize &&
                    quantity > 0 &&
                    remainingQuantity >= quantity
                  )
                }
                onClick={addToCartHandler}
                sx={{
                  flex: 1,
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
                🛒 Thêm vào giỏ hàng
              </Button>
              <IconButton
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Favorite />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Share />
              </IconButton>
            </Box>

            {/* Thông báo lỗi */}
            {!(selectedColor && selectedSize) && (
              <Paper sx={{ p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', marginBottom: 3 }}>
                <Typography variant='body2' sx={{ color: '#856404', textAlign: 'center' }}>
                  ⚠️ Vui lòng chọn màu sắc và kích cỡ
                </Typography>
              </Paper>
            )}

            <Divider sx={{ marginY: 3 }} />

            {/* Thông tin chi tiết */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                📋 Thông tin chi tiết
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant='body2' sx={{ marginBottom: 1 }}>
                  🏢 <strong>Nhà cung cấp:</strong> {product?.supplier?.name}
                </Typography>
                <Typography variant='body2' sx={{ marginBottom: 1 }}>
                  📍 <strong>Địa chỉ:</strong> {product?.supplier?.address}
                </Typography>
                <Typography variant='body2' sx={{ marginBottom: 1 }}>
                  📧 <strong>Email:</strong> {product?.supplier?.email}
                </Typography>
                <Typography variant='body2'>
                  🏷️ <strong>Chất liệu:</strong> {product?.material}
                </Typography>
              </Paper>
            </Box>

            {/* Dịch vụ */}
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2, color: '#2c3e50' }}>
                🛡️ Dịch vụ của chúng tôi
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                    <LocalShipping sx={{ color: '#27ae60' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Giao hàng miễn phí
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                    <Security sx={{ color: '#3498db' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Bảo hành chính hãng
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                    <Refresh sx={{ color: '#f39c12' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Đổi trả 30 ngày
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                    <Support sx={{ color: '#e74c3c' }} />
                    <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                      Hỗ trợ 24/7
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleProduct;
