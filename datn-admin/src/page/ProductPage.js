import React from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Select,
    Table,
    TextField,
    Typography,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { AddCircleOutline, Delete, Details, Edit } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import ProductService from '../service/ProductService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryService from '../service/CategoryService';
import SupplierService from '../service/SupplierService';
import ProductDetail from '../components/ProductDetail';
import { useNavigate } from 'react-router-dom';
import HandleError from '../utils/HandleError';


const columns = [
    { id: "STT", label: "STT", minWidth: 10 },
    { id: "images", label: "Ảnh", minWidth: 100 },
    { id: "name", label: "Tên sản phẩm", minWidth: 100 },
    { id: "price", label: "Giá", minWidth: 100 },
    { id: "material", label: "Chất liệu", minWidth: 100 },
    { id: "description", label: "Mô tả", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 150 },
];

function ProductPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});
    const [listCategory, setListCategory] = useState([]);
    const [listSupplier, setListSupplier] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const resCategory = await CategoryService.getAll({
                page: 0,
            });
            setListCategory(resCategory?.response?.content);
            const resSupplier = await SupplierService.getAll({
                page: 0,
            });
            setListSupplier(resSupplier?.response?.content);

            const res = await ProductService.getProduct({
                page: page,
                size: rowsPerPage,
            });
            setData(res?.response?.content);
            setCount(res?.response?.totalElements);

        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }

    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const dataSend = {
            id: item.id || null,
            name: data.get('name'),
            description: data.get('description'),
            price: data.get('price'),
            material: data.get('material'),
            categoryId: data.get('categoryId'),
            supplierId: data.get('supplierId'),
            imagesFile: data.get('upload-file'),
        }
        console.log(dataSend);
        try {
            if (item.id) {
                const res = await ProductService.update(dataSend);
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    setItem({});
                    setImagePreview(null);
                    setPage(0);
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await ProductService.create(dataSend);
                if (res.code === '0') {
                    toast.success('Thêm mới thành công');
                    setPage(0);
                    setImagePreview(null);
                    fetchData();
                } else {
                    toast.error('Thêm mới thất bại');
                }
            }
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (id) => {
        // confirm xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) {
            return;
        }

        try {
            const res = await ProductService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                setItem({});
                fetchData();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Grid container spacing={3}>
            <Loading isLoading={isLoading} />
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
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
                        borderRadius: 5,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: 'calc(100vh - 100px)', // Giới hạn chiều cao của modal và trừ điều chỉnh cho tiêu đề và nút đóng
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
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        {open && <ProductDetail productDetails={dataDetail} />}
                    </Typography>
                </Box>
            </Modal>


            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Sản phẩm
                </Typography>
                <IconButton onClick={() => {
                    setItem({});
                    setImagePreview(null);
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12} component='form' onSubmit={handleSubmit}>
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Tên Sản phẩm</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='name'
                        name='name'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.name || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, name: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Mô tả</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='description'
                        name='description'
                        multiline
                        fullWidth
                        margin="normal"
                        rows={4}
                        value={item.description || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, description: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Ảnh</Typography>
                </Grid>
                <Grid item xs={10} sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file"
                        name="upload-file"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImagePreview(URL.createObjectURL(file)); // Hiển thị xem trước ảnh
                            // Handle file upload logic here
                        }}
                    />
                    <label htmlFor="upload-file">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                        >
                            Chọn ảnh
                        </Button>
                    </label>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Ảnh xem trước"
                            style={{ marginLeft: '30px', maxWidth: '150px', maxHeight: '150px' }}
                        />
                    )}
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Giá</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='price'
                        name='price'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.price || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, price: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Chất liệu</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='material'
                        name='material'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.material || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, material: value };
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Danh mục</Typography>
                </Grid>
                <Grid item xs={10}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <Select
                            labelId="category-label"
                            id="categoryId"
                            name="categoryId"
                            value={item.categoryId || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log(value);
                                setItem((prev) => {
                                    return { ...prev, categoryId: value };
                                });
                            }}
                        >
                            {listCategory.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Nhà cung cấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <Select
                            labelId="supplier-label"
                            id="supplierId"
                            name="supplierId"
                            value={item.supplierId || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setItem((prev) => {
                                    return { ...prev, supplierId: value };
                                });
                            }}
                        >
                            {listSupplier.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                        <Button type='submit' variant="contained" fullWidth>
                            {item.id ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Grid item xs={12}
                sx={{
                    my: 4,
                    p: 2,
                    // border: 1,
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
}

export default ProductPage
