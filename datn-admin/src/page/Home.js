import React, { Fragment, useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../components/AppWidgetSummary';
import icon1 from "../assets/icons/ic_glass_bag.png";
import icon2 from "../assets/icons/ic_glass_users.png";
import icon3 from "../assets/icons/ic_glass_buy.png";
import icon4 from "../assets/icons/ic_glass_message.png";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Select, MenuItem } from '@mui/material';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import ProductService from '../service/ProductService';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { Delete, Details, Edit } from '@mui/icons-material';
import HandleError from '../utils/HandleError';
import OrderService from '../service/OrderService';
import { set } from 'date-fns';
import UserService from '../service/UserService';
import { se } from 'date-fns/locale';

const columns = [
  { id: "STT", label: "STT", minWidth: 10 },
  { id: "images", label: "Ảnh", minWidth: 100 },
  { id: "name", label: "Tên sản phẩm", minWidth: 100 },
  { id: "price", label: "Giá", minWidth: 100 },
  { id: "material", label: "Chất liệu", minWidth: 100 },
  { id: "description", label: "Mô tả", minWidth: 100 },
  { id: "totalQuantity", label: "Số lượng còn lại", minWidth: 50 },
  // { id: "action", label: "Hành động", minWidth: 150 },
];

function Home() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // biến chứa tổng tiền bán hàng theo tháng
  const [arrayRevenue, setArrayRevenue] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // biến chứa tổng tiền chi theo tháng
  const [arrayExpense, setArrayExpense] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [year, setYear] = useState(2024);
  const [listYear, setListYear] = useState([]);
  const [totalUser, setTotalUser] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, year]);

  const fetchData = async () => {
    try {
      const res = await ProductService.getProduct({
        page: page,
      });
      const data = res?.response?.content.map((item) => {
        const initialValue = 0;
        var totalQuantity = item.productDetails.reduce((total, i) => total + i.quantity, initialValue);

        return {
          ...item,
          totalQuantity: totalQuantity,
        };
      });
      setData(data);
      setCount(res?.response?.totalElements);

      const res1 = await OrderService.getListYear();
      setListYear(res1?.response);

      const res2 = await OrderService.getTotalAmountByMonth({
        year: year,
      });
      const dataChart1 = res2?.response?.map((item) => item.totalAmount);
      console.log(dataChart1);
      setArrayRevenue(dataChart1);

      const res3 = await OrderService.getTotalImportAmountByMonth({
        year: year,
      });
      const dataChart2 = res3?.response?.map((item) => item.totalAmount);
      setArrayExpense(dataChart2);

      setTotalRevenue(dataChart1.reduce((a, b) => a + b, 0));
      setTotalExpense(dataChart2.reduce((a, b) => a + b, 0));

      const res4 = await UserService.getAllUser({
        page: 0,
      });
      let customerCount = 0;
      res4?.response?.content.forEach(user => {
        const roles = user.role;
        if (roles && roles.length > 0) {
          roles.forEach(role => {
            if (role.name === "CUSTOMER") {
              customerCount++;
            }
          });
        }
      });
      setTotalUser(customerCount);
    } catch (e) {
      HandleError.component(e, navigate);
    } finally {
      setIsLoading(false);
    }

  };

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    },
  };

  const series = [{
    name: 'Tổng tiền bán hàng',
    data: arrayRevenue,
  }, {
    name: 'Tổng tiền chi',
    data: arrayExpense,
  }
  ];

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };
  return (
    <Container maxWidth="xl">
      <Loading isLoading={isLoading} />
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Kidi xin chào 👋
      </Typography>
      <Select
        labelId="year-label"
        label="Năm"
        id="year"
        name="year"
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
        }}
      >
        {listYear.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <Grid container spacing={3}>
        <Grid container item xs={12} md={12} lg={12} justifyContent={'space-between'}>
          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Tổng doanh thu"
              total={formatVietnameseCurrency(totalRevenue)}
              color="success"
              icon={<img alt="icon" src={icon1} />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Tổng số khách hàng"
              total={formatVietnameseCurrency(totalUser)}
              color="info"
              icon={<img alt="icon" src={icon2} />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Tổng số tiền đã chi"
              total={formatVietnameseCurrency(totalExpense)}
              color="warning"
              icon={<img alt="icon" src={icon3} />}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid xs={12} md={12} lg={12}>
            <Box>
              <Chart options={options} series={series} type="bar" height={350} />
            </Box>
          </Grid>
          <Grid xs={12} md={12} lg={12}>

            <Typography variant="h5" sx={{ mt: 5 }}>
              Sản phẩm còn tồn kho
            </Typography>
            <Grid item xs={12}
              sx={{
                my: 2,
                p: 2,
                borderRadius: 1,
              }}>
              <TableContainer >
                <Table stickyHeader aria-label="sticky table">
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
                        <TableRow hover
                          role="checkbox" tabIndex={-1} key={row.id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id}
                              >
                                {column.id === "STT" ? page * 10 + index + 1 : ""}

                                {column.id === "images" ? (
                                  <img src={value} alt="product" style={{ width: 50, height: 50 }} />
                                ) : column.id === "action" ? (
                                  <Fragment>
                                    <IconButton
                                      size='small'
                                      onClick={() => {
                                        setItem({
                                          ...row,
                                          categoryId: row.category.id,
                                          supplierId: row.supplier.id,
                                        });
                                        console.log({
                                          ...row,
                                          categoryId: row.category.id,
                                          supplierId: row.supplier.id,
                                        });
                                        setImagePreview(row.images);
                                        window.scrollTo(0, 0);
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size='small'
                                      onClick={() => handleDelete(row.id)}
                                    >
                                      <Delete />
                                    </IconButton>
                                    <IconButton
                                      size='small'
                                      onClick={() => {
                                        handleOpen();
                                        setDataDetail(row);
                                      }}
                                    >
                                      <Details />
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
      </Grid>
    </Container >
  )
}

export default Home