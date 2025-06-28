import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Modal,
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
import { AddCircleOutline, Delete, Edit } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import RoleService from '../service/RoleService';
import { set } from 'date-fns';
import { se, tr } from 'date-fns/locale';
import HandleError from '../utils/HandleError';


const columns = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "userName", label: "Tên đăng nhập ", minWidth: 100 },
    { id: "firstName", label: "Họ", minWidth: 100 },
    { id: "lastName", label: "Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "phone", label: "SĐT", minWidth: 100 },
    { id: "gender", label: "Giới tính", minWidth: 100 },
    { id: "action", label: "Thao tác", minWidth: 100 },
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

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, []);

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
        // confirm xóa
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(item);
        try {
            setIsLoading(true);
            const res = await UserService.updateUser(item);
            if (res.code === '0') {
                toast.success('Cập nhật thành công');
                setOpen(false);
                fetchData();
            } else {
                toast.error('Cập nhật thất bại');
            }
            setOpen(false);
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsLoading(false);
        }
    }
    const checkIdExists = (id, jsonArray) => {
        return jsonArray?.some(item => item.id == id);
    }
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
                        width: 600,
                        bgcolor: 'background.paper',
                        // border: '1px solid #000',
                        boxShadow: 24,
                        p: 4,
                        maxHeight: 'calc(100vh - 100px)', // Giới hạn chiều cao của modal và trừ điều chỉnh cho tiêu đề và nút đóng
                        minHeight: 'calc(50vh - 50px)',
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
                    {item && (
                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <Typography variant="h5" fontWeight="bold">
                                    Phân quyền
                                </Typography>
                            </Grid>

                            <Grid item md={12} sx={{ marginTop: 5, }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Tên tài khoản: {item.userName}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2} sx={{ marginLeft: 5 }}
                                component={'form'}
                                onSubmit={handleSubmit}
                            >
                                {listRole.map((role) => (
                                    <Grid item md={12} key={role.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={role.name}
                                                    checked={checkIdExists(role.id, item.role) || false}
                                                    onChange={() => {
                                                        if (checkIdExists(role.id, item.role)) {
                                                            item.role = item.role.filter((item) => item.id !== role.id);
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

                                <Grid item md={12}>
                                    <Button variant="outlined" color="primary" type='submit'>
                                        Lưu
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Modal>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Phân quyền tài khoản
                </Typography>
                {/* <IconButton onClick={() => {
                    navigate('/account/role');
                }}>
                    <AddCircleOutline /> Phân quyền
                </IconButton> */}
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
                                                            <IconButton
                                                                size='small'
                                                                onClick={() => {
                                                                    console.log(row, checkIdExists(1, row.role));
                                                                    setItem(row);
                                                                    setOpen(true);
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

export default AccountRolePage