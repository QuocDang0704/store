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
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Tooltip,
    Fade,
    Chip,
    Avatar
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon, Inventory as ProductIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import ProductService from '../service/ProductService';
import CategoryService from '../service/CategoryService';
import SupplierService from '../service/SupplierService';
import ProductDetail from '../components/ProductDetail';
import { useNavigate } from 'react-router-dom';
import HandleError from '../utils/HandleError';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "images", label: "Ảnh", minWidth: 100, align: 'center' },
    { id: "name", label: "Tên sản phẩm", minWidth: 200 },
    { id: "price", label: "Giá", minWidth: 120, align: 'right' },
    { id: "material", label: "Chất liệu", minWidth: 120 },
    { id: "description", label: "Mô tả", minWidth: 200 },
    { id: "action", label: "Hành động", minWidth: 150, align: 'center' },
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
    const [openDetail, setOpenDetail] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const resCategory = await CategoryService.getAll({ page: 0 });
            setListCategory(resCategory?.response?.content);
            const resSupplier = await SupplierService.getAll({ page: 0 });
            setListSupplier(resSupplier?.response?.content);
            const res = await ProductService.getProduct({ page: page, size: rowsPerPage });
            setData(res?.response?.content);
            setCount(res?.response?.totalElements);
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDetail = (row) => {
        setDataDetail(row);
        setOpenDetail(true);
    };
    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    const handleOpenForm = (product = {}) => {
        setItem(product);
        setImagePreview(product.images || null);
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setItem({});
        setImagePreview(null);
        setIsFormOpen(false);
    };

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
        };
        try {
            setIsSubmitting(true);
            if (item.id) {
                const res = await ProductService.update(dataSend);
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    handleCloseForm();
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
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Thêm mới thất bại');
                }
            }
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await ProductService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                fetchData();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const formatVietnameseCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value || 0);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Loading isLoading={isLoading} />
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ProductIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Sản phẩm
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenForm()}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        Thêm sản phẩm mới
                    </Button>
                </Box>
            </Paper>

            {/* Product Form Dialog */}
            <Dialog 
                open={isFormOpen} 
                onClose={handleCloseForm}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <ProductIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        {item.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id='name'
                                    name='name'
                                    label="Tên sản phẩm"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.name || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='description'
                                    name='description'
                                    label="Mô tả"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    defaultValue={item?.description || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Chọn ảnh
                                        <input
                                            accept="image/*"
                                            type="file"
                                            name="upload-file"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setImagePreview(URL.createObjectURL(file));
                                            }}
                                        />
                                    </Button>
                                    {imagePreview && (
                                        <Avatar
                                            src={imagePreview}
                                            alt="Ảnh xem trước"
                                            sx={{ width: 80, height: 80, borderRadius: 2, ml: 2 }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='price'
                                    name='price'
                                    label="Giá"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.price || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='material'
                                    name='material'
                                    label="Chất liệu"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.material || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        labelId="category-label"
                                        id="categoryId"
                                        name="categoryId"
                                        defaultValue={item.categoryId || ""}
                                    >
                                        {listCategory.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Select
                                        labelId="supplier-label"
                                        id="supplierId"
                                        name="supplierId"
                                        defaultValue={item.supplierId || ""}
                                    >
                                        {listSupplier.map((supplier) => (
                                            <MenuItem key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button
                            onClick={handleCloseForm}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ 
                                borderRadius: 2, 
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            {isSubmitting ? 'Đang xử lý...' : (item.id ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Product Detail Modal */}
            <Modal
                keepMounted
                open={openDetail}
                onClose={handleCloseDetail}
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
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        {openDetail && <ProductDetail productDetails={dataDetail} />}
                    </Typography>
                </Box>
            </Modal>

            {/* Data Table */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                    <Typography variant="h6" fontWeight="bold" color="text.secondary">
                        Danh sách sản phẩm ({count} sản phẩm)
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
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ProductIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có sản phẩm nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm sản phẩm đầu tiên để bắt đầu
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, index) => (
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
                                            {page * rowsPerPage + index + 1}
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
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" fontWeight="600" color="success.main">
                                                {formatVietnameseCurrency(row.price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.material}
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
                                                {row.description || 'Không có mô tả'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Chỉnh sửa" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleOpenForm({
                                                            ...row,
                                                            categoryId: row.category.id,
                                                            supplierId: row.supplier.id,
                                                        })}
                                                        sx={{ 
                                                            color: 'primary.main',
                                                            '&:hover': { 
                                                                backgroundColor: 'primary.light',
                                                                color: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa" TransitionComponent={Fade}>
                                                    <IconButton
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
                                                <Tooltip title="Xem chi tiết" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleOpenDetail(row)}
                                                        sx={{ 
                                                            color: 'info.main',
                                                            '&:hover': { 
                                                                backgroundColor: 'info.light',
                                                                color: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#fafafa'
                    }}
                />
            </Paper>
        </Box>
    );
}

export default ProductPage;
