import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TextField,
    Typography,
    Paper,
    Stack,
    Tooltip,
    Fade
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { Edit as EditIcon, Delete as DeleteIcon, Security as RoleIcon } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import RoleService from '../service/RoleService';
import HandleError from '../utils/HandleError';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "userName", label: "Tên đăng nhập ", minWidth: 120 },
    { id: "firstName", label: "Họ", minWidth: 100 },
    { id: "lastName", label: "Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 150 },
    { id: "phone", label: "SĐT", minWidth: 120 },
    { id: "gender", label: "Giới tính", minWidth: 100 },
    { id: "action", label: "Thao tác", minWidth: 150, align: 'center' },
];
function AccountRolePage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [listRole, setListRole] = useState([]);
    const [item, setItem] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            const resRole = await RoleService.getAll({
                page: 0,
            });
            setListRole(resRole?.response?.content);
            const res = await UserService.getAllUser({
                page: page,
                size: rowsPerPage,
            });
            const dataRes = res?.response?.content.map((item, index) => {
                return {
                    ...item,
                    gender: item.gender === '1' ? "Nam" : "Nữ",
                };
            });
            setData(dataRes);
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await UserService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                fetchData();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            HandleError.component(error, navigate);
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

    const handleOpenForm = (user) => {
        setItem(user);
        setOpen(true);
    };
    const handleCloseForm = () => {
        setItem({});
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await UserService.updateUser(item);
            if (res.code === '0') {
                toast.success('Cập nhật thành công');
                handleCloseForm();
                fetchData();
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsSubmitting(false);
        }
    }
    const checkIdExists = (id, jsonArray) => {
        return jsonArray?.some(item => item.id == id);
    }
    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Loading isLoading={isLoading} />
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <RoleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Phân quyền tài khoản
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Role Form Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseForm}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <RoleIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Phân quyền
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Tên tài khoản: {item.userName}
                        </Typography>
                        <Grid container spacing={2}>
                            {listRole.map((role) => (
                                <Grid item xs={12} key={role.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={role.name}
                                                checked={checkIdExists(role.id, item.role) || false}
                                                onChange={() => {
                                                    if (checkIdExists(role.id, item.role)) {
                                                        item.role = item.role.filter((i) => i.id !== role.id);
                                                    } else {
                                                        item.role.push(role);
                                                    }
                                                    setItem({ ...item });
                                                }}
                                                color="default"
                                            />
                                        }
                                        label={role.description}
                                    />
                                </Grid>
                            ))}
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
                            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Data Table */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                    <Typography variant="h6" fontWeight="bold" color="text.secondary">
                        Danh sách tài khoản ({data.length} tài khoản)
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
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <RoleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có tài khoản nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm tài khoản đầu tiên để bắt đầu
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, index) => (
                                    <TableRow 
                                        hover 
                                        key={row.id}
                                        sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                                    >
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" fontWeight="600">
                                                {row.userName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.firstName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.lastName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.phone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.gender}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Phân quyền" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleOpenForm(row)}
                                                        sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleDelete(row.id)}
                                                        sx={{ color: 'error.main', '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
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

export default AccountRolePage;