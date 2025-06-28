import React from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Table,
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
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Visibility as DetailsIcon,
    Edit as EditIcon,
    Inventory as ImportIcon,
    Person as PersonIcon,
    Work as RoleIcon,
    Schedule as DateIcon,
    AttachMoney as PriceIcon,
    Visibility as ViewIcon,
    List as ListIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import ProductService from '../service/ProductService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryService from '../service/CategoryService';
import SupplierService from '../service/SupplierService';
import ProductDetail from '../components/ProductDetail';
import { useNavigate } from 'react-router-dom';
import WarehouseEntryService from '../service/WarehouseEntryService';
import { format } from 'date-fns';
import ProductImportListItem from '../components/ProductImportListItem';
import HandleError from '../utils/HandleError';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "nameStaff", label: "Người tạo", minWidth: 180 },
    { id: "roleStaff", label: "Chức vụ", minWidth: 150 },
    { id: "createdDate", label: "Thời gian tạo", minWidth: 180 },
    { id: "totalPrice", label: "Tổng giá trị", minWidth: 150, align: 'right' },
    { id: "action", label: "Chi tiết", minWidth: 120, align: 'center' },
];

function ProductImportListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [listProductDetail, setListProductDetail] = useState([]);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await WarehouseEntryService.getAll({
                page: page,
                size: rowsPerPage,
            });
            const data = res?.response?.content.map((item, index) => {
                const role = item?.user?.role.map((item) => item.name).join(', ');
                const totalPrice = item?.warehouseEntryDetails?.reduce((total, item) => total + item.price * item.quantity, 0);

                return {
                    nameStaff: item?.user?.userName,
                    roleStaff: role,
                    totalPrice: formatVietnameseCurrency(totalPrice),
                    createdDate: format(new Date(item.createdDate), 'dd/MM/yyyy HH:mm'),
                    ...item,
                }
            });
            setData(data);
            setCount(res?.response?.totalElements);

        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const formatVietnameseCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleViewDetail = async (row) => {
        setOpen(true);

        const list = row?.warehouseEntryDetails?.map((item, index) => {
            return {
                id: item?.id,
                images: item?.productDetail?.images,
                quantity: item?.quantity,
                price: formatVietnameseCurrency(item?.price),
                sizeName: item?.productDetail?.size?.name,
                colorName: item?.productDetail?.color?.name,
            }
        });
        setListProductDetail(list);
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Loading isLoading={isLoading} />

            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ImportIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Nhập hàng
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            label={`${count} đơn nhập`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                </Box>
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
                        onClick={() => navigate('/product/import')}
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
                        Nhập hàng
                    </Button>
                </Box>
            </Paper>

            {/* Detail Modal */}
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
                    {open && (
                        <ProductImportListItem list={listProductDetail} />
                    )}
                </Box>
            </Modal>

            {/* Data Table */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                    <Typography variant="h6" fontWeight="bold" color="text.secondary">
                        Danh sách đơn nhập hàng
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
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ImportIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có đơn nhập hàng nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy tạo đơn nhập hàng đầu tiên để bắt đầu
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.map((row, index) => (
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
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {row.nameStaff}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <RoleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {row.roleStaff}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {row.createdDate}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                <PriceIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                <Typography variant="subtitle2" fontWeight="600" color="success.main">
                                                    {row.totalPrice}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xem chi tiết" TransitionComponent={Fade}>
                                                <IconButton
                                                    onClick={() => handleViewDetail(row)}
                                                    sx={{
                                                        color: 'primary.main',
                                                        '&:hover': {
                                                            backgroundColor: 'primary.light',
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {data.length > 0 && (
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
                )}
            </Paper>
        </Box>
    );
}

export default ProductImportListPage;
