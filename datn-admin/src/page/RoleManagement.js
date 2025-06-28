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
import { AddCircleOutline } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import RoleService from '../service/RoleService';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';


const columns = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "name", label: "Tên chức năng", minWidth: 100 },
    { id: "description", label: "Mô tả chi tiết", minWidth: 100 },
    { id: "funtion", label: "Chức năng", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 100 },
];
function RoleManagement() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(data);
        try {
            if (item.id) {
                const res = await RoleService.update({
                    id: item.id,
                    name: data.get('name'),
                    funtion: data.get('funtion'),
                    description: data.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    setItem({});
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await RoleService.create({
                    name: data.get('name'),
                    funtion: data.get('funtion'),
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
            const res = await RoleService.delete(id);
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
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Vai trò
                </Typography>
                <IconButton onClick={() => {
                    setItem({});
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12}
                component='form'
                onSubmit={handleSubmit}
            >
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Tên chức năng</Typography>
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
                    <Typography>Chức năng</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='funtion'
                        name='funtion'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.funtion || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, funtion: value };
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
                        value={item.description || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, description: value };
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                        <Button type='submit' variant="contained" fullWidth>
                            {item.id ? "Cập nhật" : "Thêm mới"}
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

export default RoleManagement