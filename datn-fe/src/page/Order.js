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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, LocalShipping, ShoppingCart, CheckCircle, Cancel, Schedule } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { toast } from 'react-toastify';

const listActiveTab = [
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
      status: activeTab,
    };
    const res = await OrderService.getAllOrdersByStatus(req);
    const data = res?.response?.content?.map((item, index) => {
      return {
        ...item,
        paymentMethods: item.paymentMethods == "PaymentOnDelivery" ? "Thanh toán khi nhận hàng" : "Thanh toán qua Vnpay",
      }
    });
    console.log(data);
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
    const res = await OrderService.updateOrderStatusById(orderItem.id, {
      status: item.value,
    });
    handleCloseModal();
    toast.success('Cập nhật đơn hàng thành công');
    await fetchData();
  };
  return (
    <Container>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth='md' // Thay đổi kích thước modal
        sx={{ padding: '20px' }} // Thêm padding
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ paddingRight: 10 }}>
            Chọn trạng thái bạn muốn thực hiện:
          </DialogContentText>
        </DialogContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
          sx={{ margin: 2, width: '100%' }}
        >
          {listStatusChange?.map((item) => (
            <Button
              key={item.value}
              variant="contained"
              color="info"
              sx={{
                borderRadius: '24px',
                minWidth: 140,
                fontWeight: 'bold',
                boxShadow: 3,
                textTransform: 'none',
                flex: 1,
                fontSize: '1rem',
                py: 1.2,
                px: 2,
                letterSpacing: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#0288d1',
                  color: '#fff',
                  boxShadow: 6,
                },
              }}
              onClick={() => handleUpdateStatus(item)}
            >
              {item.name}
            </Button>
          ))}
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '24px',
              minWidth: 140,
              fontWeight: 'bold',
              boxShadow: 3,
              textTransform: 'none',
              flex: 1,
              fontSize: '1rem',
              py: 1.2,
              px: 2,
              letterSpacing: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: '#fff',
                boxShadow: 6,
              },
            }}
            startIcon={<Edit />}
            onClick={() => navigate(`/order-detail/${orderItem.id}`)}
          >
            Xem chi tiết
          </Button>
        </Stack>
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
                                if (order.status === 'WaitForConfirmation') {
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
