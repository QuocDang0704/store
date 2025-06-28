import React from 'react';
import {
    Box,
    Button,
    Grid,
    IconButton,
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
    Chip
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, LocalOffer as VoucherIcon } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';
import VoucherService from '../service/VoucherService';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "discountAmount", label: "Số tiền giảm", minWidth: 150, align: 'right' },
    { id: "conditions", label: "Điều kiện", minWidth: 150 },
    { id: "quantity", label: "Số lượng", minWidth: 120, align: 'center' },
    { id: "createdDate", label: "Ngày tạo", minWidth: 150 },
    { id: "expirationDate", label: "Ngày hết hạn", minWidth: 150 },
    { id: "action", label: "Hành động", minWidth: 150, align: 'center' },
];
function VoucherPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await VoucherService.getAll({
                page: page,
                size: rowsPerPage,
            });
            var vouchers = res?.response?.content;
            const formattedVouchers = vouchers.map(voucher => ({
                ...voucher,
                createdDate: format(new Date(voucher.createdDate), 'yyyy-MM-dd'),
                expirationDate: format(new Date(voucher.expirationDate), 'yyyy-MM-dd')
            }));
            setData(formattedVouchers);
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (voucher = {}) => {
        setItem(voucher);
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setItem({});
        setIsFormOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try {
            setIsSubmitting(true);
            if (item.id) {
                const res = await VoucherService.update({
                    id: item.id,
                    discountAmount: data.get('discountAmount'),
                    conditions: data.get('conditions'),
                    quantity: data.get('quantity'),
                    createdDate: format(new Date(data.get('createdDate')), 'yyyy-MM-dd'),
                    expirationDate: format(new Date(data.get('expirationDate')), 'yyyy-MM-dd'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await VoucherService.create({
                    discountAmount: data.get('discountAmount'),
                    conditions: data.get('conditions'),
                    quantity: data.get('quantity'),
                    createdDate: data.get('createdDate'),
                    expirationDate: data.get('expirationDate'),
                });
                if (res.code === '0') {
                    toast.success('Thêm mới thành công');
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
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await VoucherService.delete(id);
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
    }

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
                        <VoucherIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Mã giảm giá
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
                        Thêm mã giảm giá
                    </Button>
                </Box>
            </Paper>

            {/* Voucher Form Dialog */}
            <Dialog
                open={isFormOpen}
                onClose={handleCloseForm}
                maxWidth="sm"
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
                    <VoucherIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        {item.id ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id='discountAmount'
                                    name='discountAmount'
                                    label="Số tiền giảm"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.discountAmount || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='conditions'
                                    name='conditions'
                                    label="Điều kiện"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.conditions || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='quantity'
                                    name='quantity'
                                    label="Số lượng"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.quantity || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày tạo"
                                    id='createdDate'
                                    name='createdDate'
                                    inputFormat="yyyy-MM-dd"
                                    value={item?.createdDate ? dayjs(item?.createdDate) : null}
                                    onChange={(date) => {
                                        setItem((prev) => ({ ...prev, createdDate: date.format('YYYY-MM-DD') }));
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày hết hạn"
                                    id='expirationDate'
                                    name='expirationDate'
                                    inputFormat="yyyy-MM-dd"
                                    value={item?.expirationDate ? dayjs(item?.expirationDate) : null}
                                    onChange={(date) => {
                                        setItem((prev) => ({ ...prev, expirationDate: date.format('YYYY-MM-DD') }));
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                />
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

            {/* Data Table */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                    <Typography variant="h6" fontWeight="bold" color="text.secondary">
                        Danh sách mã giảm giá ({data.length} mã)
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
                                            <VoucherIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có mã giảm giá nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm mã giảm giá đầu tiên để bắt đầu
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
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" fontWeight="600" color="success.main">
                                                {formatVietnameseCurrency(row.discountAmount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="600" color="error.main" >
                                                {formatVietnameseCurrency(row.conditions)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={row.quantity} color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.createdDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.expirationDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Chỉnh sửa" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleOpenForm(row)}
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
                    count={data.length}
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

export default VoucherPage;