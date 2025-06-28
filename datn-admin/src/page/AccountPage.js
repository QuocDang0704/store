import React from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Modal,
    Radio,
    RadioGroup,
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
import SizeService from '../service/SizeService';
import { Add, AddCircleOutline, Close } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import HandleError from '../utils/HandleError';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import AuthService from '../service/AuthService';


const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    gender: '', // Sử dụng radio button nên không cần giá trị mặc định ở đây
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
    // dob: Yup.string()
    //     .matches(
    //         /^\d{4}-\d{2}-\d{2}$/,
    //         'Ngày sinh không hợp lệ theo định dạng yyyy-MM-dd',
    //     )
    //     .required('Ngày sinh là bắt buộc'),
});

const columns = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "userName", label: "Tên đăng nhập ", minWidth: 100 },
    { id: "firstName", label: "Họ", minWidth: 100 },
    { id: "lastName", label: "Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "phone", label: "SĐT", minWidth: 100 },
    { id: "gender", label: "Giới tính", minWidth: 100 },
];
function AccountPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (values) => {
        console.log(values);
        const res = await AuthService.register(values);
        toast.success('Thêm mới thành côn');
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, []);

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


    const handleDelete = async (id) => {
        // confirm xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await SizeService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                setItem({});
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
    return (
        <Grid container spacing={3}>
            <Loading isLoading={isLoading} />

            <Modal
                keepMounted
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby='keep-mounted-modal-title'
                aria-describedby='keep-mounted-modal-description'
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
                        boxShadow: 24,
                        p: 4,
                        maxHeight: 'calc(100vh - 100px)', // Giới hạn chiều cao của modal và trừ điều chỉnh cho tiêu đề và nút đóng
                        minHeight: 'calc(100vh - 100px)',
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
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label='Email'
                            type='email'
                            name='email'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <TextField
                            label='Họ'
                            name='firstName'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />

                        <TextField
                            label='Tên'
                            name='lastName'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />

                        <TextField
                            label='Tên đăng nhập'
                            name='userName'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.userName && Boolean(formik.errors.userName)}
                            helperText={formik.touched.userName && formik.errors.userName}
                        />

                        <TextField
                            label='Mật khẩu'
                            type='password'
                            name='password'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <FormControl component='fieldset' sx={{ marginBottom: '5px' }}>
                            <FormLabel component='legend'>Giới tính</FormLabel>
                            <RadioGroup
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

                        <TextField
                            label='Số điện thoại'
                            name='phone'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                        <DatePicker
                            defaultValue={dayjs(Date())}
                            id='dob'
                            name='dob'
                            inputFormat="yyyy-MM-dd"
                            value={dayjs(formik.values.dob) || null}
                            onChange={(value) => {
                                const date = new Date(value);
                                const formattedDate = date.toISOString().split('T')[0]
                                console.log(formattedDate);

                                // const date = format(value, 'yyyy-MM-dd');   
                                formik.setFieldValue('dob', formattedDate);

                            }}
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            format='YYYY-MM-DD'
                            renderInput={(params) => <TextField {...params} variant="outlined" margin="normal" fullWidth />}
                        />


                        {/* <TextField
                            label='Ngày sinh'
                            name='dob'
                            variant='outlined'
                            fullWidth
                            sx={{ marginBottom: '5px' }}
                            value={formik.values.dob}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            helperText={formik.touched.dob && formik.errors.dob}
                        /> */}
                        <Typography variant='h2' sx={{ marginBottom: '20px' }}>
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                sx={{ width: '100%' }}
                            >
                                Đăng ký
                            </Button>
                        </Typography>
                    </form>
                </Box>
            </Modal>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold"

                >
                    Danh sách tài khoản người dùng
                </Typography>
                <IconButton onClick={() => {
                    navigate('/account/role');
                }}>
                    <AddCircleOutline /> Phân quyền
                </IconButton>
                <IconButton
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <Add /> Thêm mới
                </IconButton>
            </Grid>

            {/* table */}
            <Grid item xs={12} className="my-4 p-2 border rounded">
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
                            {/* rows */}
                            {data.map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id}>
                                                    {column.id === "STT" ? index + 1 : ""}
                                                    {column.id === "action" ? (
                                                        <Fragment>
                                                            <Button variant="contained"
                                                                sx={{ marginRight: 2 }}
                                                                onClick={() => {
                                                                    setItem(row);
                                                                }} >
                                                                Sửa
                                                            </Button>
                                                            <Button variant="contained" className="ml-2"
                                                                onClick={() => handleDelete(row.id)}
                                                            >
                                                                Xóa
                                                            </Button>
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
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
}

export default AccountPage