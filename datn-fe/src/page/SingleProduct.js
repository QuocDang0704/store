import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import ProductService from '../service/ProductService';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/system';
import {
  AddCircleOutline,
  RemoveCircleOutline,
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
      toast.success('Thêm vào giỏ hàng thành công');
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
    <Container>
      <Grid container spacing={5} marginY={'5px'}>
        <Grid item xs={12} md={6} container justifyContent='center'>
          <Grid item style={{ marginBottom: '20px' }}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component='img'
                  style={{ width: '540px', height: '720px' }}
                  image={
                    mainImage || (product?.images ? product.images[0] : null)
                  }
                  alt={product?.name}
                />
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {product?.productDetails.map((detail) => (
                <Grid item key={detail.id}>
                  <Card>
                    <CardActionArea onClick={() => setMainImage(detail.images)}>
                      <CardMedia
                        component='img'
                        style={{ height: '90px', width: '90px' }}
                        image={detail.images}
                        alt={product?.name}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold' }}>
            {product?.name}
          </Typography>
          <Typography
            variant='body1'
            gutterBottom
            sx={{ opacity: 0.5, marginBottom: '10px', fontSize: 14 }}
          >
            Chất liệu: {product?.material}
          </Typography>
          <Typography
            variant='h5'
            gutterBottom
            sx={{ fontWeight: 'bold', marginY: '20px', color: 'red' }}
          >
            {formatVietnameseCurrency(product?.price)} VND
          </Typography>

          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontSize: '16px', marginTop: '30px' }}
          >
            Màu sắc: {selectedColor.name}
          </Typography>
          <Grid container spacing={1}>
            {productTemp?.productDetails
              // Lọc bỏ các màu trùng lặp
              .filter(
                (detail, index, self) =>
                  index ===
                  self.findIndex((t) => t.color.id === detail.color.id),
              )
              // Map qua danh sách màu
              .map((detail) => (
                <Grid item key={detail.color.id}>
                  <Button
                    variant='contained'
                    style={{
                      backgroundColor: detail.color.hex,
                      width: '30px',
                      height: '30px',
                      boxShadow:
                        selectedColor?.id === detail.color.id
                          ? '0 0 0 2px #fff, 0 0 0 4px ' + detail.color.hex
                          : 'none',
                    }}
                    onClick={() => {
                      setSelectedColor(detail.color);
                      setSelectedSize(null);
                    }}
                  />
                </Grid>
              ))}
          </Grid>

          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontSize: '16px', marginTop: '20px' }}
          >
            Kích cỡ: {selectedSize?.name}
          </Typography>
          <Grid container spacing={1}>
            {productTemp?.productDetails
              // Lọc bỏ các kích thước trùng lặp
              .filter(
                (detail, index, self) =>
                  index === self.findIndex((t) => t.size.id === detail.size.id),
              )
              // Map qua danh sách kích thước
              .map((detail) => (
                <Grid item key={detail.size.id}>
                  <Button
                    variant='contained'
                    style={{
                      width: 'auto',
                      whiteSpace: 'nowrap',
                      backgroundColor: listSizeActive.includes(detail.size.id)
                        ? selectedSize?.id === detail.size.id
                          ? '#2196f3'
                          : '#ffffff'
                        : '#f0f0f0', // Màu nền khi nút bị vô hiệu hóa
                      color: listSizeActive.includes(detail.size.id)
                        ? selectedSize?.id === detail.size.id
                          ? '#fff'
                          : '#000'
                        : '#a0a0a0', // Màu chữ khi nút bị vô hiệu hóa
                      boxShadow: listSizeActive.includes(detail.size.id)
                        ? selectedSize?.id === detail.size.id
                          ? '0 0 0 2px #fff, 0 0 0 4px #2196f3'
                          : '0 0 0 2px #C0C0C0'
                        : '0 0 0 2px #e0e0e0', // Bóng khi nút bị vô hiệu hóa
                    }}
                    onClick={() => handleChangeSize(detail)}
                    disabled={!listSizeActive.includes(detail.size.id)}
                  >
                    {detail.size.name}
                  </Button>
                </Grid>
              ))}
          </Grid>

          <Grid
            container
            spacing={1}
            alignItems='center'
            style={{ marginTop: '20px' }}
          >
            <Grid item>
              <IconButton onClick={decreaseQuantity}>
                <RemoveCircleOutline />
              </IconButton>
            </Grid>
            <Grid item>
              <TextField
                id='quantity'
                variant='filled'
                error={error != ''} // Hiển thị viền đỏ khi có lỗi
                InputProps={{
                  inputProps: { min: 1, style: { textAlign: 'center' } },
                  style: {
                    width: '50px',
                    height: '40px',
                    background: '#FFFFFF',
                    textAlign: 'center',
                  },
                }}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </Grid>
            <Grid item>
              <IconButton onClick={increaseQuantity}>
                <AddCircleOutline />
              </IconButton>
            </Grid>

            <Grid item>
              <Typography variant='body1'>
                Còn lại {remainingQuantity} sản phẩm
              </Typography>
            </Grid>
          </Grid>
          {!(selectedColor && selectedSize) && (
            <Typography variant='body1' style={{ color: 'red' }}>
              Vui lòng chọn màu, kích cỡ và số lượng hợp lệ
            </Typography>
          )}
          {error && (
            <Typography variant='body1' style={{ color: 'red' }}>
              {error}
            </Typography>
          )}

          <Grid item style={{ marginTop: '40px' }}>
            <Button
              variant='contained'
              color='primary'
              disabled={
                !(
                  selectedColor &&
                  selectedSize &&
                  quantity > 0 &&
                  remainingQuantity > quantity
                )
              }
              onClick={addToCartHandler}
            >
              Thêm vào giỏ hàng
            </Button>
          </Grid>
          <br />
          {/* Thêm các thuộc tính khác vào đây */}
          <Typography variant='h6' gutterBottom style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Đặc điểm nổi bật:
          </Typography>
          <Typography variant='body1' gutterBottom>
            Chất liệu: {product?.material}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Nhà cung cấp: {product?.supplier.name}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Địa chỉ nhà cung cấp: {product?.supplier.address}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Email nhà cung cấp: {product?.supplier.email}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <img
                    src='https://www.coolmate.me/images/icons/icon3.svg'
                    alt='Đổi trả với số điện thoại'
                  />
                </div>
                <Typography
                  variant='body2'
                  sx={{ fontSize: '14px', marginLeft: '10px' }}
                >
                  Đổi trả cực dễ chỉ cần liên hệ trực tiếp với cửa hàng qua Hotline
                </Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <img
                    src='https://www.coolmate.me/images/icons/icon5.svg'
                    alt='Đổi hàng trong 60 ngày'
                  />
                </div>
                <Typography
                  variant='body2'
                  sx={{ fontSize: '14px', marginLeft: '10px' }}
                >
                  10 ngày đổi trả vì bất kỳ lý do gì từ cửa hàng
                </Typography>
              </div>
            </Grid>

            <br />
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <img
                    src='https://www.coolmate.me/images/icons/icon2.svg'
                    alt='Hotline 0388 343 898'
                    style={{ width: '25px' }}
                  />
                </div>
                <Typography
                  variant='body2'
                  sx={{ fontSize: '14px', marginLeft: '10px' }}
                >
                  Hotline 0388 343 898 hỗ trợ từ 8h30 - 22h mỗi ngày
                </Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <img
                    src='https://www.coolmate.me/images/icons/icon1.svg'
                    alt='Trả hàng tận nơi'
                  />
                </div>
                <Typography
                  variant='body2'
                  sx={{ fontSize: '14px', marginLeft: '10px' }}
                >
                  Đến cửa hàng nhận hoàn trả hàng, hoàn tiền trong 24h
                </Typography>
              </div>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleProduct;
