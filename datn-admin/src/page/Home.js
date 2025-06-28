import React, { Fragment, useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../components/AppWidgetSummary';
import icon1 from "../assets/icons/ic_glass_bag.png";
import icon2 from "../assets/icons/ic_glass_users.png";
import icon3 from "../assets/icons/ic_glass_buy.png";
import icon4 from "../assets/icons/ic_glass_message.png";
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  IconButton, 
  Select, 
  MenuItem,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Alert,
  Stack
} from '@mui/material';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import ProductService from '../service/ProductService';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { Delete, Details, Edit, TrendingUp, People, ShoppingCart, Warning } from '@mui/icons-material';
import HandleError from '../utils/HandleError';
import OrderService from '../service/OrderService';
import { set } from 'date-fns';
import UserService from '../service/UserService';
import { se } from 'date-fns/locale';

const columns = [
  { id: "STT", label: "STT", minWidth: 60, align: 'center' },
  { id: "images", label: "Ảnh sản phẩm", minWidth: 120, align: 'center' },
  { id: "name", label: "Tên sản phẩm", minWidth: 200, align: 'left' },
  { id: "price", label: "Giá bán", minWidth: 120, align: 'right' },
  { id: "material", label: "Chất liệu", minWidth: 120, align: 'left' },
  { id: "totalQuantity", label: "Tồn kho", minWidth: 100, align: 'center' },
  { id: "status", label: "Trạng thái", minWidth: 120, align: 'center' },
];

function Home() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      background: 'transparent'
    },
    colors: ['#00AB55', '#FF4842'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      labels: {
        style: {
          colors: '#637381',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Số tiền (VNĐ)',
        style: {
          color: '#637381',
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          colors: '#637381',
          fontSize: '12px'
        },
        formatter: function (value) {
          return formatVietnameseCurrency(value);
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return formatVietnameseCurrency(value) + ' VNĐ';
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      markers: {
        radius: 12
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  };

  const series = [{
    name: 'Doanh thu',
    data: arrayRevenue,
  }, {
    name: 'Chi phí',
    data: arrayExpense,
  }
  ];

  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const getStatusChip = (quantity) => {
    if (quantity === 0) {
      return <Chip label="Hết hàng" color="error" size="small" />;
    } else if (quantity <= 10) {
      return <Chip label="Sắp hết" color="warning" size="small" />;
    } else {
      return <Chip label="Còn hàng" color="success" size="small" />;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Loading isLoading={isLoading} />
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#212B36' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#637381' }}>
          Chào mừng bạn đến với hệ thống quản lý KisShop
        </Typography>
      </Box>

      {/* Year Selector */}
      <Card sx={{ mb: 3, p: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="year-label">Chọn năm</InputLabel>
          <Select
            labelId="year-label"
            label="Chọn năm"
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
        </FormControl>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', minHeight: 140 }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                    Tổng doanh thu
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#00AB55' }}>
                    {formatVietnameseCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
                    VNĐ
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(0, 171, 85, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp sx={{ fontSize: 32, color: '#00AB55' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', minHeight: 140 }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                    Tổng khách hàng
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1890FF' }}>
                    {formatVietnameseCurrency(totalUser)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
                    người
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <People sx={{ fontSize: 32, color: '#1890FF' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', minHeight: 140 }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                    Tổng chi phí
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FA8C16' }}>
                    {formatVietnameseCurrency(totalExpense)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
                    VNĐ
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(250, 140, 22, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart sx={{ fontSize: 32, color: '#FA8C16' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', minHeight: 140 }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#637381', mb: 1 }}>
                    Lợi nhuận
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: totalRevenue - totalExpense >= 0 ? '#00AB55' : '#FF4842' }}>
                    {formatVietnameseCurrency(totalRevenue - totalExpense)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#637381', mt: 0.5 }}>
                    VNĐ
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: totalRevenue - totalExpense >= 0 ? 'rgba(0, 171, 85, 0.1)' : 'rgba(255, 72, 66, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp sx={{ 
                    fontSize: 32, 
                    color: totalRevenue - totalExpense >= 0 ? '#00AB55' : '#FF4842' 
                  }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#212B36' }}>
            Biểu đồ doanh thu và chi phí theo tháng
          </Typography>
          <Chart options={options} series={series} type="bar" height={400} />
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              Sản phẩm tồn kho
            </Typography>
            <Chip 
              label={`${data.filter(item => item.totalQuantity === 0).length} sản phẩm hết hàng`}
              color="error"
              icon={<Warning />}
            />
          </Box>

          <TableContainer component={Paper} sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#ffffff'
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ 
                        minWidth: column.minWidth,
                        fontWeight: 700,
                        color: '#1a1a1a',
                        backgroundColor: '#f5f5f5',
                        borderBottom: '2px solid #e0e0e0',
                        fontSize: '14px',
                        padding: '16px 12px'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row, index) => {
                  return (
                    <TableRow 
                      hover
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f0f8ff' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell 
                            key={column.id}
                            align={column.align}
                            sx={{ 
                              borderBottom: '1px solid #e8e8e8',
                              color: '#333333',
                              fontSize: '14px',
                              padding: '12px',
                              fontWeight: 500
                            }}
                          >
                            {column.id === "STT" && (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#666666' }}>
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            )}
                            {column.id === "images" && (
                              <Box
                                component="img"
                                src={value}
                                alt="product"
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 2,
                                  objectFit: 'cover',
                                  border: '2px solid #e0e0e0',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                            )}
                            {column.id === "name" && (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {value}
                              </Typography>
                            )}
                            {column.id === "price" && (
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#00AB55' }}>
                                {formatVietnameseCurrency(value)} VNĐ
                              </Typography>
                            )}
                            {column.id === "material" && (
                              <Typography variant="body2" sx={{ color: '#666666' }}>
                                {value}
                              </Typography>
                            )}
                            {column.id === "totalQuantity" && (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                {value}
                              </Typography>
                            )}
                            {column.id === "status" && getStatusChip(row.totalQuantity)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home