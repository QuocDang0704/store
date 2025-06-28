import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Tooltip,
  Fade,
  Avatar,
} from '@mui/material';
import { useState } from 'react';
import Loading from '../utils/Loading';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Inventory as ImportIcon,
  ShoppingCart as CartIcon,
  AttachMoney as PriceIcon,
  Inventory2 as QuantityIcon,
  Visibility as ViewIcon,
  List as ListIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import ListProductDetail from '../components/ListProductDetail';
import ProductService from '../service/ProductService';
import { toast } from 'react-toastify';
import WarehouseEntryService from '../service/WarehouseEntryService';
import AuthService from '../service/AuthService';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'STT', label: 'STT', minWidth: 80, align: 'center' },
  { id: 'images', label: 'Ảnh', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Tên sản phẩm', minWidth: 200 },
  { id: 'size', label: 'Kích cỡ', minWidth: 100, align: 'center' },
  { id: 'color', label: 'Màu sắc', minWidth: 120, align: 'center' },
  { id: 'quantity', label: 'Số lượng', minWidth: 120, align: 'center' },
  { id: 'price', label: 'Giá nhập', minWidth: 150, align: 'right' },
  { id: 'priceSelling', label: 'Giá bán', minWidth: 150, align: 'right' },
  { id: 'total', label: 'Thành tiền', minWidth: 150, align: 'right' },
  { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' },
];

function ProductImportPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [listProductDetail, setListProductDetail] = useState([]);
  const [findName, setFindName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    fetchData();
  }, [findName]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await ProductService.getProductDetail({
        page: 0,
        name: findName,
      });
      const data = res?.response?.content?.map((item, index) => {
        return {
          ...item,
          name: item.product.name,
          images: item.images,
          material: item.product.material,
          description: item.product.description,
          size: item.size.name,
          color: item.color.name,
          priceSelling: item.product.price,
        };
      })
      setListProductDetail(data);
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  const changeFindName = (e) => {
    setFindName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.length === 0) {
      toast.warning('Danh sách sản phẩm trống');
      return;
    }

    // Validate data
    const invalidItems = data.filter(item => !item.quantity || item.quantity <= 0 || !item.price || item.price <= 0);
    if (invalidItems.length > 0) {
      toast.error('Vui lòng nhập đầy đủ số lượng và giá nhập cho tất cả sản phẩm');
      return;
    }

    const warehouseEntryDetails = data.map((item) => {
      return {
        productDetailId: item.id,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      }
    });

    try {
      setIsSubmitting(true);
      const res = await WarehouseEntryService.create({
        userId: user.id,
        warehouseEntryDetails: warehouseEntryDetails,
      });

      if (res.code == '0') {
        toast.success('Tạo phiếu nhập thành công');
        setData([]); // Clear data after successful import
      } else {
        toast.error('Tạo phiếu nhập thất bại');
      }
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAction = (row) => {
    if (data.some((item) => item.id === row.id)) {
      toast.warning('Sản phẩm đã tồn tại trong danh sách');
      return;
    }

    setData([...data, { ...row, quantity: 1, price: 0 }]);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return data.reduce((total, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseInt(item.price) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const formatVietnameseCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  const handleRenderData = useCallback(() => {
    return data?.map((row, index) => {
      const total = (parseInt(row.quantity) || 0) * (parseInt(row.price) || 0);
      
      return (
        <TableRow 
          hover 
          key={row.id}
          sx={{ 
            '&:hover': { 
              backgroundColor: '#f8f9fa' 
            } 
          }}
        >
          <TableCell align="center" sx={{ fontWeight: 600 }}>
            {index + 1}
          </TableCell>
          <TableCell align="center">
            <Avatar
              src={row.images}
              alt={row.name}
              sx={{ width: 50, height: 50, mx: 'auto' }}
            />
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1" fontWeight="600">
              {row.name}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Chip label={row.size} size="small" color="primary" variant="outlined" />
          </TableCell>
          <TableCell align="center">
            <Chip label={row.color} size="small" color="secondary" variant="outlined" />
          </TableCell>
          <TableCell align="center">
            <TextField
              type="number"
              size="small"
              placeholder="SL"
              InputProps={{
                inputProps: { 
                  min: 1, 
                  style: { textAlign: 'center' },
                  startAdornment: <QuantityIcon sx={{ fontSize: 16, mr: 0.5 }} />
                },
              }}
              value={row.quantity || ''}
              onChange={(event) => {
                setData(
                  data.map((item) => {
                    if (item.id === row.id) {
                      return { ...item, quantity: event.target.value };
                    }
                    return item;
                  }),
                );
              }}
              sx={{ width: 80 }}
            />
          </TableCell>
          <TableCell align="right">
            <TextField
              type="number"
              size="small"
              placeholder="Giá nhập"
              InputProps={{
                inputProps: { 
                  min: 0, 
                  style: { textAlign: 'right' },
                  startAdornment: <PriceIcon sx={{ fontSize: 16, mr: 0.5 }} />
                },
              }}
              value={row.price || ''}
              onChange={(event) => {
                setData(
                  data.map((item) => {
                    if (item.id === row.id) {
                      return { ...item, price: event.target.value };
                    }
                    return item;
                  }),
                );
              }}
              sx={{ width: 120 }}
            />
          </TableCell>
          <TableCell align="right">
            <Typography variant="body2" color="text.secondary">
              {formatVietnameseCurrency(row.priceSelling)}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="subtitle2" fontWeight="600" color="success.main">
              {formatVietnameseCurrency(total)}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Xóa khỏi danh sách" TransitionComponent={Fade}>
              <IconButton
                size="small"
                onClick={() => handleDelete(row.id)}
                sx={{ 
                  color: 'error.main',
                  '&:hover': { 
                    backgroundColor: 'error.light',
                    color: 'white'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  }, [data, setData]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Loading isLoading={isLoading} />
      
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ImportIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Nhập sản phẩm
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip 
              label={`${data.length} sản phẩm`} 
              color="primary" 
              variant="outlined"
              icon={<CartIcon />}
              sx={{ fontWeight: 600 }}
            />
            {data.length > 0 && (
              <Chip 
                label={`Tổng: ${formatVietnameseCurrency(calculateTotal())}`} 
                color="success" 
                variant="filled"
                icon={<PriceIcon />}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            startIcon={<ListIcon />}
            onClick={() => navigate('/import/list')}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: 'info.main',
              '&:hover': {
                backgroundColor: 'info.dark'
              }
            }}
          >
            Xem danh sách nhập hàng
          </Button>
        </Box>
      </Paper>

      {/* Product Selection Modal */}
      <Modal
        keepMounted
        open={openProductDetail}
        onClose={() => setOpenProductDetail(false)}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 900,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '3px',
            },
            '&:hover': {
              overflowY: 'auto',
            },
          }}
        >
          {openProductDetail && (
            <ListProductDetail list={listProductDetail} changeFindName={changeFindName} addAction={addAction} />
          )}
        </Box>
      </Modal>

      {/* Action Buttons */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProductDetail(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Thêm sản phẩm vào danh sách
          </Button>
          <Button
            type='submit'
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSubmitting || data.length === 0}
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: 'success.main',
              '&:hover': {
                backgroundColor: 'success.dark'
              }
            }}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Lưu phiếu nhập'}
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Danh sách sản phẩm nhập ({data.length} sản phẩm)
          </Typography>
        </Box>
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#f5f5f5',
                      color: 'text.primary',
                      borderBottom: '2px solid #e0e0e0'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Chưa có sản phẩm nào trong danh sách
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hãy thêm sản phẩm vào danh sách để bắt đầu nhập hàng
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                handleRenderData()
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default ProductImportPage;
