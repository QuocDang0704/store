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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Security as RoleIcon } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import RoleService from '../service/RoleService';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "name", label: "Tên chức năng", minWidth: 200 },
    { id: "description", label: "Mô tả chi tiết", minWidth: 250 },
    { id: "funtion", label: "Chức năng", minWidth: 180 },
    { id: "action", label: "Hành động", minWidth: 150, align: 'center' },
];

function RoleManagement() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await RoleService.getAll({
                page: page,
                size: rowsPerPage,
            });
            setData(res?.response?.content);
            setIsLoading(false);
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (role = {}) => {
        setItem(role);
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setItem({});
        setIsFormOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            setIsSubmitting(true);
            if (item.id) {
                const res = await RoleService.update({
                    id: item.id,
                    name: formData.get('name'),
                    funtion: formData.get('funtion'),
                    description: formData.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await RoleService.create({
                    name: formData.get('name'),
                    funtion: formData.get('funtion'),
                    description: formData.get('description'),
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
        if (!window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await RoleService.delete(id);
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
    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Loading isLoading={isLoading} />
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <RoleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Vai trò
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
                        Thêm vai trò mới
                    </Button>
                </Box>
            </Paper>

            {/* Role Form Dialog */}
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
                    <RoleIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        {item.id ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id='name'
                                    name='name'
                                    label="Tên chức năng"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.name || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='funtion'
                                    name='funtion'
                                    label="Chức năng"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    defaultValue={item?.funtion || ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='description'
                                    name='description'
                                    label="Mô tả chi tiết"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    defaultValue={item?.description || ""}
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
                        Danh sách vai trò ({data.length} vai trò)
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
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <RoleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có vai trò nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm vai trò đầu tiên để bắt đầu
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
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" fontWeight="600">
                                                {row.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.description || 'Không có mô tả'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.funtion} color="info" variant="outlined" />
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

export default RoleManagement;