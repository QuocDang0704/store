import React from 'react';
import {
    Box,
    Button,
    Grid,
    IconButton,
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
import SupplierService from '../service/SupplierService';
import { AddCircleOutline } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';


const columns = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "name", label: "Tên danh mục", minWidth: 100 },
    { id: "address", label: "Địa chỉ", minWidth: 100 },
    { id: "email", label: "Gmail", minWidth: 100 },
    { id: "description", label: "Mô tả", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 100 },
];
function SupplierPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [supplier, setSupplier] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await SupplierService.getAll({
                page: page,
                size: rowsPerPage,
            });
            setData(res?.response?.content);
        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(data);
        try {
            setIsLoading(true);
            if (supplier.id) {
                const res = await SupplierService.update({
                    id: supplier.id,
                    name: data.get('name'),
                    address: data.get('address'),
                    email: data.get('email'),
                    description: data.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    setSupplier({});
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await SupplierService.create({
                    name: data.get('name'),
                    address: data.get('address'),
                    email: data.get('email'),
                    description: data.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Thêm mới thành công');
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
            setIsLoading(true);
            const res = await SupplierService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                setSupplier({});
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
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Nhà cung cấp
                </Typography>
                <IconButton onClick={() => {
                    setSupplier({});
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12}
                component='form'
                onSubmit={handleSubmit}
            >
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Tên nhà cung cấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='name'
                        name='name'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={supplier?.name || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSupplier((prev) => {
                                return { ...prev, name: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Địa chỉ</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='address'
                        name='address'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={supplier?.address || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSupplier((prev) => {
                                return { ...prev, address: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Gmail</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='email'
                        name='email'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={supplier?.email || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSupplier((prev) => {
                                return { ...prev, email: value };
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
                        // label="Mô tả"
                        multiline
                        fullWidth
                        margin="normal"
                        rows={4}
                        value={supplier.description || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSupplier((prev) => {
                                return { ...prev, description: value };
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                        <Button type='submit' variant="contained" fullWidth>
                            {supplier.id ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* table */}
            <Grid item xs={12} className="my-4 p-2 border rounded">
                <TableContainer sx={{ maxHeight: 440 }}>
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
                                                                    setSupplier(row);
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

export default SupplierPage