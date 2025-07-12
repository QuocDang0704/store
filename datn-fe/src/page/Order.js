import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../service/OrderService';
import {
  Container,
  Typography,
  ButtonGroup,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CardActionArea,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  Divider,
  Paper,
  Avatar,
  Stack,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit,
  LocalShipping,
  ShoppingCart,
  CheckCircle,
  Cancel,
  Schedule,
  Close,
  Warning,
  Info,
  Assignment,
  Payment,
  LocationOn,
  Person,
  Phone,
  Receipt
} from '@mui/icons-material';
import { Stack as MuiStack } from '@mui/system';
import { toast } from 'react-toastify';

const listActiveTab = [
  {
    value: 'WaitingForPayment',
    name: 'Chờ thanh toán',
  },
  {
    value: 'WaitForConfirmation',
    name: 'Chờ xác nhận',
  },
  {
    value: 'PreparingGoods',
    name: 'Đang chuẩn bị hàng',
  },
  {
    value: 'Delivery',
    name: 'Đang giao hàng',
  },
  {
    value: 'Success',
    name: 'Giao thành công',
  },
  {
    value: 'Cancel',
    name: 'Hủy',
  },
];

function Order() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('WaitForConfirmation');
  const [listElements, setListElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderItem, setOrderItem] = useState({});
  const [listStatusChange, setListStatusChange] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    var req = {
      sort: ['id,desc'],
      status: activeTab === 'WaitingForPayment' ? 'WaitForConfirmation' : activeTab,
    };
    const res = await OrderService.getAllOrdersByStatus(req);
    let data = res?.response?.content?.map((item, index) => {
      return {
        ...item,
        paymentMethods: item.paymentMethods == "PaymentOnDelivery" ? "Thanh toán khi nhận hàng" : "Thanh toán qua Vnpay",
      }
    }) || [];
    if (activeTab === 'WaitingForPayment') {
      data = data.filter(item => item.paymentMethods === 'Thanh toán qua Vnpay' && item.isPayment === false);
    }
    if (activeTab === 'WaitForConfirmation') {
      data = data.filter(item => (
        (item.paymentMethods === 'Thanh toán qua Vnpay' && item.isPayment !== false)
        || item.paymentMethods === 'Thanh toán khi nhận hàng'
      )
      );
    }

    setListElements(data);
    setIsLoading(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.value);
  };

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const getStatusName = (statusValue) => {
    const status = listActiveTab.find((tab) => tab.value === statusValue);
    return status ? status.name : statusValue;
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'WaitForConfirmation':
        return <Schedule sx={{ color: '#f44336' }} />;
      case 'PreparingGoods':
        return <ShoppingCart sx={{ color: '#ff9800' }} />;
      case 'Delivery':
        return <LocalShipping sx={{ color: '#2196f3' }} />;
      case 'Success':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'Cancel':
        return <Cancel sx={{ color: '#9e9e9e' }} />;
      default:
        return <Schedule sx={{ color: '#000000' }} />;
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'WaitForConfirmation':
        return '#f44336'; // Red
      case 'PreparingGoods':
        return '#ff9800'; // Orange
      case 'Delivery':
        return '#2196f3'; // Blue
      case 'Success':
        return '#4caf50'; // Green
      case 'Cancel':
        return '#9e9e9e'; // Grey
      default:
        return '#000000'; // Black
    }
  };

  const handleOpenModal = (item) => {
    setOrderItem(item);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setOrderItem(null);
  };
  const handleUpdateStatus = async (item) => {
    console.log(item);
    setIsLoading(true);
    if (item.value === 'Payment') {
      const res = await OrderService.unpaidVnpayOrders(orderItem.id);
      console.log(res?.response);
      window.location.href = res?.response?.link;
    } else {
      const res = await OrderService.updateOrderStatusById(orderItem.id, {
        status: item.value,
      });
    }

    handleCloseModal();
    toast.success('Cập nhật đơn hàng thành công');
    await fetchData();
  };

  return (
    <Container>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }
        }}
      >
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          p: 3,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                <Assignment />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Quản lý đơn hàng
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mã đơn hàng: {orderItem?.code}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: 0 }}>
          {/* Order Information */}
          <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={3}>
              {/* Customer Info */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                      <Person sx={{ mr: 1, color: '#1976d2' }} />
                      Thông tin khách hàng
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tên khách hàng
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {orderItem?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 1, fontSize: 16, color: '#1976d2' }} />
                        {orderItem?.phone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Địa chỉ giao hàng
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationOn sx={{ mr: 1, mt: 0.2, fontSize: 16, color: '#1976d2' }} />
                        {orderItem?.address}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Details */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                      <Receipt sx={{ mr: 1, color: '#1976d2' }} />
                      Chi tiết đơn hàng
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Trạng thái hiện tại
                      </Typography>
                      <Chip
                        icon={getStatusIcon(orderItem?.status)}
                        label={getStatusName(orderItem?.status)}
                        size="medium"
                        sx={{
                          backgroundColor: getStatusColor(orderItem?.status),
                          color: 'white',
                          fontWeight: 'bold',
                          mt: 1
                        }}
                      />
                    </Box>
                    {activeTab === 'WaitingForPayment' && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Đơn hàng này chưa được thanh toán qua VNPAY.
                      </Alert>
                    )}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phương thức thanh toán
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Payment sx={{ mr: 1, fontSize: 16, color: '#1976d2' }} />
                        {orderItem?.paymentMethods}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tổng tiền
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {formatVietnameseCurrency(orderItem?.total)} VND
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Action Section */}
          <Box sx={{ p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Info sx={{ mr: 1, color: '#1976d2' }} />
              Chọn hành động
            </Typography>

            {listStatusChange && listStatusChange.length > 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Bạn có thể cập nhật trạng thái đơn hàng hoặc xem chi tiết đơn hàng
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Đơn hàng này không thể cập nhật trạng thái. Bạn chỉ có thể xem chi tiết.
                </Typography>
              </Alert>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="stretch"
            >
              {listStatusChange?.map((item) => (
                <Button
                  key={item.value}
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: '12px',
                    minWidth: 160,
                    fontWeight: 'bold',
                    boxShadow: 3,
                    textTransform: 'none',
                    flex: 1,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    letterSpacing: 0.5,
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => handleUpdateStatus(item)}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  borderRadius: '12px',
                  minWidth: 160,
                  fontWeight: 'bold',
                  boxShadow: 2,
                  textTransform: 'none',
                  flex: 1,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3,
                  letterSpacing: 0.5,
                  transition: 'all 0.3s ease',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
                startIcon={<Edit />}
                onClick={() => navigate(`/order-detail/${orderItem.id}`)}
              >
                Xem chi tiết
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <div className='main'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 md:col-span-9'>
              <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', marginTop: '10px' }}>
                Đơn hàng
              </Typography>
            </div>
            <div className='col-span-12'>
              <ButtonGroup
                color='primary'
                aria-label='outlined primary button group'
              >
                {listActiveTab?.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? 'contained' : 'outlined'}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.name}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            <div className='col-span-12'>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Typography variant="h6" color="textSecondary">
                    Đang tải dữ liệu...
                  </Typography>
                </Box>
              ) : listElements.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Typography variant="h6" color="textSecondary">
                    Không có đơn hàng nào trong trạng thái này
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3} sx={{ marginTop: '5px', marginBottom: '30px' }}>
                  {listElements.map((order) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={order.id} style={{ display: 'flex', borderRadius: '10px', boxShadow: 3, }}>
                      <Card
                        sx={{
                          minHeight: 340,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          },
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Header với mã đơn hàng và trạng thái */}
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box>
                              <Chip
                                icon={getStatusIcon(order.status)}
                                label={getStatusName(order.status)}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(order.status),
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Typography variant="caption" color="textSecondary" display="block">
                                Mã đơn hàng
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                {order.code}
                              </Typography>
                            </Box>

                          </Box>

                          {activeTab === 'WaitingForPayment' && (
                            <Box mb={1}>
                              <Chip
                                label="Chưa thanh toán qua VNPAY"
                                color="warning"
                                sx={{ fontWeight: 'bold', fontSize: '0.8rem', mb: 1 }}
                              />
                            </Box>
                          )}

                          <Divider sx={{ my: 1.5 }} />

                          {/* Thông tin khách hàng */}
                          <Box mb={2}>
                            <Typography variant="body2" fontWeight="bold" color="textPrimary" gutterBottom>
                              {order.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              📞 {order.phone}
                            </Typography>
                          </Box>

                          {/* Địa chỉ */}
                          <Box mb={2}>
                            <Typography variant="caption" color="textSecondary" display="block">
                              📍 Địa chỉ giao hàng
                            </Typography>
                            <Typography variant="body2" color="textPrimary" sx={{
                              wordBreak: 'break-word',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {order.address}
                            </Typography>
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          {/* Phương thức thanh toán và tổng tiền */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                              <Typography variant="caption" color="textSecondary" display="block">
                                Thanh toán
                              </Typography>
                              <Typography variant="body2" color="textPrimary">
                                {order.paymentMethods}
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="caption" color="textSecondary" display="block">
                                Tổng tiền
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                {formatVietnameseCurrency(order.total)} VND
                              </Typography>
                            </Box>
                          </Box>

                          {/* Mô tả */}
                          {order.description && (
                            <Box mb={2}>
                              <Typography variant="caption" color="textSecondary" display="block">
                                Ghi chú
                              </Typography>
                              <Typography variant="body2" color="textPrimary" sx={{
                                fontStyle: 'italic',
                                wordBreak: 'break-word',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {order.description}
                              </Typography>
                            </Box>
                          )}

                          <Box flexGrow={1} />
                          <Box display="flex" gap={1} mt={2}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              sx={{ borderRadius: '20px', flex: 1 }}
                              onClick={() => {
                                if (order.status === 'WaitForConfirmation'
                                  && order.paymentMethods === 'Thanh toán qua Vnpay'
                                  && order.isPayment === false
                                ) {
                                  setListStatusChange([
                                    {
                                      value: 'Cancel',
                                      name: 'Hủy đơn hàng',
                                    },
                                    {
                                      value: 'Payment',
                                      name: 'Thanh toán đơn hàng',
                                    },
                                  ]);
                                } else if (order.status === 'WaitForConfirmation') {
                                  setListStatusChange([
                                    {
                                      value: 'Cancel',
                                      name: 'Hủy đơn hàng',
                                    },
                                  ]);
                                } else if (order.status === 'Delivery') {
                                  setListStatusChange([
                                    {
                                      value: 'Success',
                                      name: 'Giao thành công',
                                    },
                                  ]);
                                } else {
                                  setListStatusChange(null);
                                }
                                handleOpenModal(order);
                              }}
                            >
                              Cập nhật
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ borderRadius: '20px', flex: 1 }}
                              onClick={() => navigate(`/order-detail/${order.id}`)}
                            >
                              Chi tiết
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Order;
