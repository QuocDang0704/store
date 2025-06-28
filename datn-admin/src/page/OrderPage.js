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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import { Stack } from '@mui/system';
import { toast } from 'react-toastify';
import HandleError from '../utils/HandleError';
import Loading from '../utils/Loading';

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

function OrderPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('WaitForConfirmation');
  const [listElements, setListElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderItem, setOrderItem] = useState({});
  const [listStatusChange, setListStatusChange] = useState([]);

  useEffect(() => {

    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      var req = {
        sort: ['id,desc'],
        status: activeTab,
      };
      const res = await OrderService.getByStatus(req);
      const data = res?.response?.content?.map((item, index) => {
        return {
          ...item,
          paymentMethods: item.paymentMethods == "PaymentOnDelivery" ? "Thanh toán khi nhận hàng" : "Thanh toán qua Vnpay",
        }
      });
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

  const columns = [
    {
      field: 'name',
      headerName: 'Tên khách hàng',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'code',
      headerName: 'Mã đơn hàng',
      width: 220,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'paymentMethods',
      headerName: 'Phương thức thanh toán',
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'total',
      headerName: 'Tổng tiền',
      width: 150,
      valueFormatter: (params) =>
        formatVietnameseCurrency(params.value) + ' VND',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 170,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Tooltip title={getStatusName(params.value)}>
          <span
            style={{
              backgroundColor: getStatusColor(params.value),
              padding: '4px 8px',
              borderRadius: '4px',
              color: 'white',
            }}
          >
            {getStatusName(params.value)}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 300,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 350,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 150,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <IconButton
            aria-label='update'
            onClick={() => {
              if (params.row.status === 'WaitForConfirmation') {
                setListStatusChange([
                  {
                    value: 'PreparingGoods',
                    name: 'Xác nhận đơn hàng',
                  },
                ]);
              } else if (params.row.status === 'PreparingGoods') {
                setListStatusChange([
                  {
                    value: 'Delivery',
                    name: 'Giao hàng',
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
        );

      },
    },
  ];

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
    try {
      setIsLoading(true);
      const res = await OrderService.updateOrderStatusById(orderItem.id, {
        status: item.value,
      });
      handleCloseModal();
      toast.success('Cập nhật đơn hàng thành công');
      await fetchData();
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
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
          direction='row'
          spacing={1}
          justifyContent='flex-start'
          sx={{ margin: 2 }}
        >
          {listStatusChange?.map((item) => (
            <Button
              key={item.value}
              variant='contained'
              color='info'
              sx={{ borderRadius: '20px' }}
              onClick={() => handleUpdateStatus(item)}
            >
              {item.name}
            </Button>
          ))}
          <Button
            variant='contained'
            color='info'
            sx={{ borderRadius: '20px' }}
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
              <Typography variant='h4' gutterBottom>
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
              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  rows={listElements}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  hideFooterPagination={false}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default OrderPage;
