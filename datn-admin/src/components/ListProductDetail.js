import { 
  Add as AddIcon,
  Search as SearchIcon,
  Inventory as ProductIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Fade,
  Button,
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';

const columns = [
  { id: 'STT', label: 'STT', minWidth: 80, align: 'center' },
  { id: 'images', label: 'Ảnh', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Tên sản phẩm', minWidth: 200 },
  { id: 'size', label: 'Kích cỡ', minWidth: 100, align: 'center' },
  { id: 'color', label: 'Màu sắc', minWidth: 120, align: 'center' },
  { id: 'material', label: 'Chất liệu', minWidth: 120 },
  { id: 'description', label: 'Mô tả', minWidth: 200 },
  { id: 'action', label: 'Thêm vào danh sách', minWidth: 150, align: 'center' },
];

const ListProductDetail = ({list, addAction, changeFindName}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(list);
  }, [list]);

  
  const handleAdd = (row) => {
    addAction(row);
  }

  const handleChangeName = (e) => {
    changeFindName(e);
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        pb: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ProductIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography variant='h5' fontWeight='bold' color="primary">
            Danh sách sản phẩm chi tiết
          </Typography>
        </Box>
        <TextField
          id='outlined-basic'
          label='Tìm kiếm sản phẩm'
          variant='outlined'
          size='small'
          sx={{ width: '300px' }}
          onChange={handleChangeName}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {/* Data Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
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
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ProductIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Không tìm thấy sản phẩm nào
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hãy thử tìm kiếm với từ khóa khác
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((row, index) => {
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
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.material || 'Chưa có thông tin'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {row.description || 'Chưa có mô tả'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Thêm vào danh sách nhập" TransitionComponent={Fade}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleAdd(row)}
                            sx={{
                              borderRadius: 2,
                              px: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              backgroundColor: 'success.main',
                              '&:hover': {
                                backgroundColor: 'success.dark'
                              }
                            }}
                          >
                            Thêm
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ListProductDetail;
