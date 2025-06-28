import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
    Table,
    TextField,
    Typography,
    Paper,
    Stack,
    Tooltip,
    Fade,
    Avatar
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Group as AccountIcon, Security as RoleIcon } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import HandleError from '../utils/HandleError';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AuthService from '../service/AuthService';

const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    gender: '',
    phone: '',
    dob: '',
};

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    firstName: Yup.string().required('Họ là bắt buộc'),
    lastName: Yup.string().required('Tên là bắt buộc'),
    userName: Yup.string().required('Tên đăng nhập là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
    gender: Yup.string().required('Giới tính là bắt buộc'),
    phone: Yup.string()
        .matches(/^(0\d{9,10})$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại là bắt buộc'),
});

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "userName", label: "Tên đăng nhập ", minWidth: 120 },
    { id: "firstName", label: "Họ", minWidth: 100 },
    { id: "lastName", label: "Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 150 },
    { id: "phone", label: "SĐT", minWidth: 120 },
    { id: "gender", label: "Giới tính", minWidth: 100 },
];
function AccountPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            await AuthService.register(values);
            toast.success('Thêm mới thành công');
            setOpen(false);
            fetchData();
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
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
                        <AccountIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Danh sách tài khoản người dùng
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<RoleIcon />}
                            onClick={() => navigate('/account/role')}
                            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
                        >
                            Phân quyền
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpen(true)}
                            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
                        >
                            Thêm mới
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Account Form Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <AccountIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Thêm tài khoản mới
                    </Typography>
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label='Email'
                                    type='email'
                                    name='email'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Họ'
                                    name='firstName'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Tên'
                                    name='lastName'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Tên đăng nhập'
                                    name='userName'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userName && Boolean(formik.errors.userName)}
                                    helperText={formik.touched.userName && formik.errors.userName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Mật khẩu'
                                    type='password'
                                    name='password'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl component='fieldset' fullWidth>
                                    <FormLabel component='legend'>Giới tính</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label='gender'
                                        name='gender'
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <FormControlLabel value='0' control={<Radio />} label='Nam' />
                                        <FormControlLabel value='1' control={<Radio />} label='Nữ' />
                                    </RadioGroup>
                                    {formik.touched.gender && formik.errors.gender && (
                                        <Typography color='error'>{formik.errors.gender}</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Số điện thoại'
                                    name='phone'
                                    variant='outlined'
                                    fullWidth
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày sinh"
                                    id='dob'
                                    name='dob'
                                    inputFormat="yyyy-MM-dd"
                                    value={formik.values.dob ? dayjs(formik.values.dob) : null}
                                    onChange={(value) => {
                                        const date = new Date(value);
                                        const formattedDate = date.toISOString().split('T')[0];
                                        formik.setFieldValue('dob', formattedDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button
                            onClick={() => setOpen(false)}
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
                            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
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
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <AccountIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
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

export default AccountPage;