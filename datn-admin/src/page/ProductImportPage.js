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
} from '@mui/material';
import { useState } from 'react';
import Loading from '../utils/Loading';
import { Delete } from '@mui/icons-material';
import { set } from 'date-fns';
import ListProductDetail from '../components/ListProductDetail';
import ProductService from '../service/ProductService';
import { toast } from 'react-toastify';
import WarehouseEntryService from '../service/WarehouseEntryService';
import AuthService from '../service/AuthService';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'STT', label: 'STT', minWidth: 10 },
  { id: 'images', label: 'Ảnh', minWidth: 100 },
  { id: 'name', label: 'Tên sản phẩm', minWidth: 100 },
  { id: 'quantity', label: 'Số lượng', minWidth: 100 },
  { id: 'price', label: 'Giá nhập', minWidth: 150 },
  { id: 'priceSelling', label: 'Giá bán', minWidth: 100 },
  { id: 'size', label: 'Kích cỡ', minWidth: 100 },
  { id: 'color', label: 'Màu sắc', minWidth: 100 },
  { id: 'material', label: 'Chất liệu', minWidth: 100 },
  { id: 'description', label: 'Mô tả', minWidth: 100 },
  { id: 'action', label: 'Hành động', minWidth: 100 },
];

const fakeData = [
  {
    id: 1,
    images: 'https://via.placeholder.com/150',
    name: 'Áo thun nam',
    size: 'M',
    color: 'Đen',
    material: 'Cotton',
    description: 'Áo thun nam hàng hiệu',
  },
  {
    id: 2,
    images: 'https://via.placeholder.com/150',
    name: 'Áo thun nữ',
    size: 'M',
    color: 'Đen',
    material: 'Cotton',
    description: 'Áo thun nữ hàng hiệu',
  },
  {
    id: 3,
    images: 'https://via.placeholder.com/150',
    name: 'Áo thun trẻ em',
    size: 'M',
    color: 'Đen',
    material: 'Cotton',
    description: 'Áo thun trẻ em hàng hiệu',
  },
];

function ProductImportPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [listProductDetail, setListProductDetail] = useState([]);
  const [findName, setFindName] = useState('');

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
    console.log(data);

    const warehouseEntryDetails = data.map((item) => {
      return {
        productDetailId: item.id,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      }
    });
    try {
      const res = await WarehouseEntryService.create({
        userId: user.id,
        warehouseEntryDetails: warehouseEntryDetails,
      });

      if (res.code == '0') {
        toast.success('Tạo phiếu nhập thành công');
      } else {
        toast.error('Tạo phiếu nhập thất bại');
      }
    } catch (error) {
      HandleError.component(error, navigate);
    }
  };

  const addAction = (row) => {
    if (data.some((item) => item.id === row.id)) {
      toast.warning('Sản phẩm đã tồn tại trong danh sách');
      return;
    }

    setData([...data, row]);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleRenderData = useCallback(() => {
    return data?.map((row, index) => {
      return (
        <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell key={column.id}>
                {column.id === 'STT' ? row.id : ''}
                {column.id === 'quantity' ? (
                  <TextField
                    aria-label='Số lượng'
                    placeholder='Số lượng'
                    InputProps={{
                      inputProps: { min: 1, style: { textAlign: 'center' } },
                    }}
                    value={row.quantity || 0}
                    onChange={(event, val) => {
                      setData(
                        data.map((item) => {
                          if (item.id === row.id) {
                            return { ...item, quantity: event.target.value };
                          }
                          return item;
                        }),
                      );
                    }}
                  />
                ) : column.id === 'price' ? (
                  <TextField
                    aria-label='Giá nhập'
                    placeholder='Giá nhập'
                    InputProps={{
                      inputProps: { min: 1, style: { textAlign: 'center' } },
                    }}
                    value={row.price || 0}
                    onChange={(event, val) => {
                      setData(
                        data.map((item) => {
                          if (item.id === row.id) {
                            return { ...item, price: event.target.value };
                          }
                          return item;
                        }),
                      );
                    }}
                  />
                ) : column.id === 'images' ? (
                  <img
                    src={value}
                    alt='product'
                    style={{ width: 50, height: 50 }}
                  />
                ) : column.id === 'action' ? (
                  <Fragment>
                    <IconButton
                      size='small'
                      onClick={() => handleDelete(row.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Fragment>
                ) : (
                  value
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  }, [data, setData]);

  return (
    <Grid container spacing={3}>
      <Loading isLoading={isLoading} />
      <Modal
        keepMounted
        open={openProductDetail}
        onClose={() => {
          setOpenProductDetail(false);
        }}
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
            // border: '1px solid #000',
            boxShadow: 24,
            p: 4,
            maxHeight: 'calc(100vh - 100px)', // Giới hạn chiều cao của modal và trừ điều chỉnh cho tiêu đề và nút đóng
            minHeight: 'calc(100vh - 100px)',
            overflowY: 'hidden', // Ẩn thanh cuộn mặc định
            '&::-webkit-scrollbar': {
              width: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '3px',
            },
            '&:hover': {
              overflowY: 'auto', // Hiển thị thanh cuộn khi di chuột vào modal
            },
          }}
        >
          {openProductDetail && (
            <ListProductDetail list={listProductDetail} changeFindName={changeFindName} addAction={addAction} />
          )}
        </Box>
      </Modal>

      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 0 5px 0',
        }}
      >
        <Typography variant='h4' fontWeight='bold'>
          Nhập sản phẩm
        </Typography>
      </Grid>
      <Grid container item xs={12} component={'form'} onSubmit={handleSubmit}>
        {/* container that have button add product to import list  */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            className='btn btn-primary'
            onClick={() => {
              setOpenProductDetail(true);
            }}
          >
            Thêm sản phẩm vào danh sách nhập
          </Button>
          <Button
            type='submit'
            className='btn btn-primary'
          >
            Lưu
          </Button>
        </Grid>

        <TableContainer>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{handleRenderData()}</TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ProductImportPage;
