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
  Box,
  Paper,
  Chip,
  Avatar,
  Divider,
  Grid,
  Card,
  CardContent,
  Badge,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import { Stack } from '@mui/system';
import { toast } from 'react-toastify';
import HandleError from '../utils/HandleError';
import Loading from '../utils/Loading';

const listActiveTab = [
  {
    value: 'WaitingForPayment',
    name: 'Chờ thanh toán',
    icon: <AttachMoney />, // Bổ sung icon
    color: '#f44336',
    bgColor: '#ffebee',
  },
  {
    value: 'WaitForConfirmation',
    name: 'Chờ xác nhận',
    icon: <Schedule />,
    color: '#f44336',
    bgColor: '#ffebee'
  },
  {
    value: 'PreparingGoods',
    name: 'Đang chuẩn bị hàng',
    icon: <ShoppingCart />,
    color: '#ff9800',
    bgColor: '#fff3e0'
  },
  {
    value: 'Delivery',
    name: 'Đang giao hàng',
    icon: <LocalShipping />,
    color: '#2196f3',
    bgColor: '#e3f2fd'
  },
  {
    value: 'Success',
    name: 'Giao thành công',
    icon: <CheckCircle />,
    color: '#4caf50',
    bgColor: '#e8f5e8'
  },
  {
    value: 'Cancel',
    name: 'Hủy',
    icon: <Cancel />,
    color: '#9e9e9e',
    bgColor: '#f5f5f5'
  },
];

function OrderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('WaitForConfirmation');
  const [listElements, setListElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderItem, setOrderItem] = useState({});
  const [listStatusChange, setListStatusChange] = useState([]);
  const [statusStats, setStatusStats] = useState({});

  useEffect(() => {
    fetchAllStatusData();
    fetchData();
  }, [activeTab]);

  const fetchAllStatusData = async () => {
    try {
      const allStats = {};
      let listActiveTab_filter = listActiveTab.filter(item => item.value !== 'WaitingForPayment');

      // Fetch data for all statuses
      for (const tab of listActiveTab_filter) {
        try {
          const req = {
            sort: ['id,desc'],
            status: tab.value,
          };
          const res = await OrderService.getByStatus(req);

          let data = res?.response?.content?.map((item, index) => {
            return {
              ...item,
              paymentMethods: item.paymentMethods == "PaymentOnDelivery" ? "Thanh toán khi nhận hàng" : "Thanh toán qua Vnpay",
            }
          }) || [];
          if (tab.value === 'WaitForConfirmation') {
            allStats['WaitingForPayment'] = data.filter(item => item.paymentMethods === 'Thanh toán qua Vnpay' && item.isPayment === false).length;
            allStats['WaitForConfirmation'] = data.filter(item =>
              (item.paymentMethods === 'Thanh toán qua Vnpay' && item.isPayment !== false)
              || item.paymentMethods === 'Thanh toán khi nhận hàng'
            ).length;
          } else {
            allStats[tab.value] = data?.length || 0;
          }
        } catch (error) {
          console.error(`Error fetching data for status ${tab.value}:`, error);
          allStats[tab.value] = 0;
        }
      }

      setStatusStats(allStats);
    } catch (error) {
      console.error('Error fetching all status data:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      var req = {
        sort: ['id,desc'],
        status: activeTab === 'WaitingForPayment' ? 'WaitForConfirmation' : activeTab,
      };
      const res = await OrderService.getByStatus(req);
      let data = res?.response?.content?.map((item, index) => {
        return {
          ...item,
          paymentMethods: item.paymentMethods == "PaymentOnDelivery" ? "Thanh toán khi nhận hàng" : "Thanh toán qua Vnpay",
        }
      });
      console.log(data);
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
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsLoading(false);
    }
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

  const getStatusInfo = (statusValue) => {
    return listActiveTab.find((tab) => tab.value === statusValue) || listActiveTab[0];
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Tên khách hàng',
      width: 150,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontWeight: 700 }}>
            {params.value?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight="600">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'code',
      headerName: 'Mã đơn hàng',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="filled"
          sx={{ 
            fontFamily: 'monospace',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
            color: '#fff',
            boxShadow: 2,
            borderRadius: 2
          }}
        />
      ),
    },
    {
      field: 'paymentMethods',
      headerName: 'Phương thức thanh toán',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          icon={<AttachMoney />}
          label={params.value}
          size="small"
          color={params.value.includes('Vnpay') ? 'primary' : 'default'}
          variant="filled"
          sx={{ fontWeight: 600, boxShadow: 1, borderRadius: 2 }}
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Tổng tiền',
      width: 160,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="h6" fontWeight="bold" sx={{
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 18,
          textAlign: 'center',
        }}>
          {formatVietnameseCurrency(params.value)} VND
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 170,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.value);
        return (
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.name}
            size="small"
            sx={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
              fontWeight: 'bold',
              border: `1.5px solid ${statusInfo.color}`,
              boxShadow: 1,
              borderRadius: 2
            }}
          />
        );
      },
    },
    {
      field: 'isPayment',
      headerName: 'Thanh toán',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Đã thanh toán' : 'Chưa thanh toán'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="filled"
          sx={{ fontWeight: 600, boxShadow: 1, borderRadius: 2 }}
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 250,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Tooltip title={params.value || 'Không có mô tả'}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value || 'Không có mô tả'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 300,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 250,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Cập nhật trạng thái">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  if (params.row.status === 'WaitForConfirmation'
                    && params.row.paymentMethods === 'Thanh toán qua Vnpay'
                    && params.row.isPayment === false
                  ) {
                    setListStatusChange(null);
                  } else if (params.row.status === 'WaitForConfirmation') {
                    setListStatusChange([
                      {
                        value: 'PreparingGoods',
                        name: 'Xác nhận đơn hàng',
                        icon: <ShoppingCart />,
                      },
                    ]);
                  } else if (params.row.status === 'PreparingGoods') {
                    setListStatusChange([
                      {
                        value: 'Delivery',
                        name: 'Giao hàng',
                        icon: <LocalShipping />,
                      },
                    ]);
                  } else {
                    setListStatusChange(null);
                  }
                  handleOpenModal(params.row);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <IconButton
                size="small"
                color="info"
                onClick={() => navigate(`/order-detail/${params.row.id}`)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const handleOpenModal = (item) => {
    setOrderItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOrderItem(null);
  };

  const handleUpdateStatus = async (item) => {
    setIsLoading(true);
    try {
      const res = await OrderService.updateOrderStatusById(orderItem.id, {
        status: item.value,
      });
      handleCloseModal();
      toast.success('Cập nhật đơn hàng thành công');
      await fetchData();
      await fetchAllStatusData(); // Refresh stats after update
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fffff', minHeight: '100vh', py: 3 }}>
      <Loading isLoading={isLoading} />

      {/* Stats Cards */}
      <Container maxWidth="xl" sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          {listActiveTab.map((tab) => (
            <Grid item xs={12} sm={6} md={2.4} key={tab.value}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: activeTab === tab.value ? `2px solid ${tab.color}` : '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
                onClick={() => handleTabClick(tab)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 1,
                    color: tab.color
                  }}>
                    {tab.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color={tab.color}>
                    {statusStats[tab.value] || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tab.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{
            p: 3,
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <TrendingUp />
            <Typography variant="h5" fontWeight="bold">
              Quản lý đơn hàng
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Đơn hàng - {getStatusInfo(activeTab).name}
            </Typography>

            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={listElements}
                columns={columns}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                hideFooterPagination={false}
                loading={isLoading}
                rowSpacingType="margin"
                sx={{
                  border: 'none',
                  borderRadius: 4,
                  boxShadow: 4,
                  backgroundColor: '#fff',
                  fontFamily: 'inherit',
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 17,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottom: '2.5px solid #1976d2',
                    minHeight: 64,
                    maxHeight: 64,
                    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.08)',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1.5px solid #e0e0e0',
                    fontSize: 15,
                    padding: '14px 10px',
                    alignItems: 'center',
                    fontWeight: 500,
                  },
                  '& .MuiDataGrid-row': {
                    transition: 'background 0.2s, border-left 0.2s',
                    marginBottom: 1.5,
                    borderLeft: '4px solid transparent',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #f0f7ff 0%, #e3f2fd 100%)',
                      borderLeft: '4px solid #1976d2',
                    },
                  },
                  '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: '#e3f2fd !important',
                    borderLeft: '4px solid #1976d2',
                  },
                  '& .MuiDataGrid-selectedRowCount': {
                    color: '#1976d2',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1.5px solid #e0e0e0',
                    background: '#fafbfc',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    boxShadow: '0 -2px 8px 0 rgba(33,150,243,0.04)',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: 480,
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Edit />
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Chọn hành động bạn muốn thực hiện cho đơn hàng <strong>#{orderItem?.code || 'N/A'}</strong>:
          </DialogContentText>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin đơn hàng:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Khách hàng:</strong> {orderItem?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Tổng tiền:</strong> {orderItem?.total ? formatVietnameseCurrency(orderItem.total) + ' VND' : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {orderItem?.address || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          {listStatusChange?.map((item) => (
            <Button
              key={item.value}
              variant='contained'
              color='primary'
              startIcon={item.icon}
              sx={{
                borderRadius: '20px',
                px: 3,
                py: 1
              }}
              onClick={() => handleUpdateStatus(item)}
            >
              {item.name}
            </Button>
          ))}
          <Button
            variant='outlined'
            color='info'
            startIcon={<Visibility />}
            sx={{ borderRadius: '20px', px: 3, py: 1 }}
            onClick={() => orderItem?.id && navigate(`/order-detail/${orderItem.id}`)}
            disabled={!orderItem?.id}
          >
            Xem chi tiết
          </Button>
          <Button
            variant='outlined'
            onClick={handleCloseModal}
            sx={{ borderRadius: '20px', px: 3, py: 1 }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderPage;
