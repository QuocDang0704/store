import { Add } from '@mui/icons-material';
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
} from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';

const columns = [
  { id: 'STT', label: 'STT', minWidth: 10 },
  { id: 'images', label: 'Ảnh', minWidth: 100 },
  // { id: 'productName', label: 'Tên sản phẩm', minWidth: 100 },
  { id: 'quantity', label: 'Số lượng', minWidth: 100 },
  { id: 'price', label: 'Giá nhập', minWidth: 100 },
  { id: 'sizeName', label: 'Kích cỡ', minWidth: 100 },
  { id: 'colorName', label: 'Màu sắc', minWidth: 100 },
];



const ProductImportListItem = ({list}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
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
            Danh sách sản phẩm chi tiết
          </Typography>
        </Grid>
        <Grid container >
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
              <TableBody>
                {data?.map((row, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
                            {column.id === "STT" ? index + 1 : ""}

                            {column.id === 'images' ? (
                              <img
                                src={value}
                                alt='product'
                                style={{ width: 50, height: 50 }}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductImportListItem;
