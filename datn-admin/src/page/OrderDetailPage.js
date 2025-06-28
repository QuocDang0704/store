import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Container,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../service/AuthService';
import OrderService from '../service/OrderService';
import { useParams } from 'react-router-dom';
import HandleError from '../utils/HandleError';
import ProductService from '../service/ProductService';
import {
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

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
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'warning';
      case 'Đang chuẩn bị hàng':
        return 'info';
      case 'Đang giao hàng':
        return 'primary';
      case 'Thành công':
        return 'success';
      case 'Đã hủy':
        return 'error';
      default:
        return 'default';
    }
  };

  const printInvoice = () => {
    console.log('print');
    const printContent = document.getElementById('invoice-content');
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;

    window.print();

    document.body.innerHTML = originalContents;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Chi tiết đơn hàng
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Quản lý và xem chi tiết thông tin đơn hàng
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={printInvoice}
          sx={{ px: 3, py: 1.5, borderRadius: 2 }}
        >
          In hóa đơn
        </Button>
      </Box>

      <div id="invoice-content">
        {/* Order Information Card */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
              Thông tin đơn hàng
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Khách hàng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.user?.firstName} {data.user?.lastName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                      <ReceiptIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Mã đơn hàng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        #{data.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày đặt hàng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.orderDate}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                      <PaymentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phương thức thanh toán
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.paymentMethod}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                      <LocationIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Địa chỉ giao hàng
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 40, height: 40 }}>
                      <PhoneIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Trạng thái:
              </Typography>
              <Chip
                label={data.status}
                color={getStatusColor(data.status)}
                variant="filled"
                sx={{ fontSize: '1rem', fontWeight: 600, px: 2, py: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ bgcolor: 'primary.main', p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Chi tiết sản phẩm
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Thông tin</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem' }}>Giá</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem' }}>Số lượng</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1rem' }}>Tổng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.orderDetails?.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img
                            src={'http://localhost:8080/' + item.productDetail.images}
                            alt={item.productDetail.id}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0',
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Sản phẩm #{item.productDetail.id}
                          </Typography>
                          <Chip
                            label={`Size: ${item.productDetail.size.name}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          <Chip
                            label={`Màu: ${item.productDetail.color.name}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {formatVietnameseCurrency(item.price)} VND
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.quantity}
                          color="info"
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {formatVietnameseCurrency(item.price * item.quantity)} VND
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3, bgcolor: 'primary.main' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Tổng tiền đơn hàng
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                {formatVietnameseCurrency(data.total)} VND
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default OrderDetailPage;
