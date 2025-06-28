import React, { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Slider,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Container,
  Button,
  Paper,
  Icon,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import Banner from '../components/Banner';
import { Box, Stack } from '@mui/system';
import { toast } from 'react-toastify';
import Loading from '../utils/Loading';
import ProductService from '../service/ProductService';
import { useNavigate } from 'react-router-dom';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import CategoryService from '../service/CategoryService';
import HandleError from '../utils/HandleError';
import SupplierService from '../service/SupplierService';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // tìm kiếm
  const [search, setSearch] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    categoryId: '',
    supplierId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const gridRef = useRef(null);
  const [sortType, setSortType] = useState('price,asc');
  const [listCategory, setListCategory] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchProduct();
  }, [page, pageSize, sortType]);
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page]);
  const fetchProduct = async () => {
    const resCategory = await CategoryService.getAll({
      page: 0
    });
    setListCategory(resCategory?.response?.content);

    const resSupplier = await SupplierService.getAll({
      page: 0
    });
    setListSupplier(resSupplier?.response?.content);


    const res = await ProductService.getProductCustomer({
      page: page - 1,
      size: pageSize,
      sort: [sortType],
      ...search,
    });
    setProducts(res?.response?.content);
    console.log(res?.response?.content);
    setCount(res?.response?.totalElements);
    setIsLoading(false);
  };

  const handleSearch = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const data = new FormData(e.currentTarget);

      const searchData = {
        page: page - 1,
        size: pageSize,
        sort: [sortType],
        name: data.get('searchName'),
        minPrice: data.get('minPrice').replace(/\D/g, '') || 0,
        maxPrice: data.get('maxPrice').replace(/\D/g, '') || 0,
        categoryId: data.get('categoryId'),
        supplierId: data.get('supplierId'),
      };
      console.log(searchData, "searchData");
      const res = await ProductService.getProductCustomer(searchData);
      setProducts(res?.response?.content);
      setCount(res?.response?.totalElements);
      setIsLoading(false);
      toast.success('Tìm kiếm thành công!');
    } catch (error) {
      HandleError.component(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };
  const formatVietnameseCurrency = (value) => {
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Banner />
      <Grid container spacing={2} marginTop={3}>
        <Grid item xs={12} sm={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <form onSubmit={handleSearch}>
              <div className='sidebar col-md-3 col-sm-5'>
                <div className='sidebar-filter margin-bottom-25'>
                  <Typography variant='h6' style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Tìm kiếm sản phẩm</Typography>
                  <div style={{ marginTop: '15px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Tên sản phẩm </label>
                    <TextField
                      name='searchName'
                      id='searchName'
                      placeholder='Nhập tên sản phẩm'
                      variant='outlined'
                      value={search?.name || ''}
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value;
                        document
                          .getElementById('searchName')
                          .setAttribute('value', value);
                        setSearch({ ...search, name: value });
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Khoảng giá từ</label>
                    <TextField
                      name='minPrice'
                      id='minPrice'
                      type='text'
                      placeholder='Nhập giá 1'
                      variant='outlined'
                      value={search?.minPrice || ''}
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = formatVietnameseCurrency(value);
                        document.getElementById('minPrice').value =
                          formattedValue;
                        setSearch({ ...search, minPrice: formattedValue });
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Khoảng giá đến</label>
                    <TextField
                      name='maxPrice'
                      id='maxPrice'
                      type='text'
                      placeholder='Nhập giá 2'
                      variant='outlined'
                      value={search?.maxPrice || ''}
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formattedValue = formatVietnameseCurrency(value);
                        document.getElementById('maxPrice').value =
                          formattedValue;
                        setSearch({ ...search, maxPrice: formattedValue });
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Danh mục</label>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <Select
                        labelId="category-label"
                        id="categoryId"
                        name="categoryId"
                        label="Danh mục"
                        value={search?.categoryId || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          document
                            .getElementById('categoryId')
                            .setAttribute('value', value);
                          setSearch({ ...search, categoryId: value });
                        }}
                      >
                        <MenuItem value=" ">
                          <em>          </em>
                        </MenuItem>
                        {listCategory.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Danh mục</label>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <Select
                        labelId="category-label"
                        id="supplierId"
                        name="supplierId"
                        label="Nhà cung cấp"
                        value={search?.supplierId || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          document
                            .getElementById('supplierId')
                            .setAttribute('value', value);
                          setSearch({ ...search, supplierId: value });
                        }}
                      >
                        <MenuItem value=" ">
                          <em>          </em>
                        </MenuItem>
                        {listSupplier.map((supplier) => (
                          <MenuItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <Button type='submit' variant='contained' color='primary'
                    sx={{ marginTop: 2 }}>
                    Tìm kiếm
                  </Button>
                  {/* thêm bỏ lọc */}
                  <Button
                    variant='contained'
                    color='secondary'
                    sx={{ marginTop: 2 }}
                    onClick={() => {
                      setSearch({
                        name: '',
                        minPrice: '',
                        maxPrice: '',
                      });
                      document.getElementById('searchName').value = '';
                      document.getElementById('minPrice').value = '';
                      document.getElementById('maxPrice').value = '';
                      document
                        .getElementById('categoryId')
                        .setAttribute('value', " ");
                    }}
                  >
                    Bỏ lọc
                  </Button>
                </div>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-start'
            sx={{ marginBottom: 1 }}
          >
            <Button
              variant='outlined'
              color='info'
              sx={{ borderRadius: '20px' }}
              endIcon={<Icon as={ArrowUpward} />}
              onClick={() => {
                setSortType('price,asc');
              }}
            >
              Sắp xếp theo giá tăng dần
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              sx={{ borderRadius: '20px' }}
              endIcon={<Icon as={ArrowDownward} />}
              onClick={() => {
                setSortType('price,desc');
              }}
            >
              Sắp xếp theo giá giảm dần
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {products?.map((product) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                key={product?.id}
                onClick={() => navigate('/product/' + product?.id)}
              >
                <Card sx={{ border: '1px solid #e0e0e0' }}>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      height='450'
                      image={product?.images}
                      alt={product?.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography
                        noWrap
                        variant='body2'
                        gutterBottom
                        sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                      >
                        {product?.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ fontWeight: 'bold', color: 'red' }}
                      >
                        Giá: {formatVietnameseCurrency(product?.price)} VND
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} >
            <Paper sx={{ p: 2 }}>
              <Stack
                direction='row'
                spacing={1}
                justifyContent='flex-start'
                sx={{ marginBottom: 1 }}
              >
                <Grid item xs={12} md={4}>
                  <Typography variant='body1' sx={{ textAlign: 'left' }}>
                    <Button
                      variant='contained'
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Trước
                    </Button>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant='body1' sx={{ textAlign: 'center' }}>
                    Trang {page} trên {Math.ceil(count / pageSize)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}
                >
                  <Typography
                    variant='body1' sx={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      disabled={page === Math.ceil(count / pageSize) || count === 0}
                      onClick={() => setPage(page + 1)}
                    >
                      Tiếp
                    </Button>
                  </Typography>
                </Grid>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
