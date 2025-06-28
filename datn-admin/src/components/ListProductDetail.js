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
  { id: 'name', label: 'Tên sản phẩm', minWidth: 100 },
  { id: 'quantity', label: 'Số lượng', minWidth: 100 },
  { id: 'size', label: 'Kích cỡ', minWidth: 100 },
  { id: 'color', label: 'Màu sắc', minWidth: 100 },
  { id: 'material', label: 'Chất liệu', minWidth: 100 },
  { id: 'description', label: 'Mô tả', minWidth: 100 },
  { id: 'action', label: 'Hành động', minWidth: 100 },
];



const ListProductDetail = ({list, addAction, changeFindName}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(list);
  }, [list]);

  
  const handleAdd = (row) => {
    addAction(row);
  }

  const handleChangeName = (value) => {
    changeFindName(value);
  }


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
          {/* input search */}
          <TextField
            id='outlined-basic'
            label='Tìm kiếm'
            variant='outlined'
            size='small'
            sx={{ width: '300px' }}
            onChange={handleChangeName}
          />
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
                            {column.id === 'STT' ? row.id : ''}

                            {column.id === 'images' ? (
                              <img
                                src={value}
                                alt='product'
                                style={{ width: 50, height: 50 }}
                              />
                            ) : column.id === 'action' ? (
                              <Fragment>
                                <IconButton
                                  size='small'
                                  onClick={() => handleAdd(row)}
                                >
                                  <Add />
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
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListProductDetail;
