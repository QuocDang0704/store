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
import CategoryService from '../service/CategoryService';
import { AddCircleOutline } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { tr } from 'date-fns/locale';
import HandleError from '../utils/HandleError';
import ProductService from '../service/ProductService';


const columns = [
    { id: "STT", label: "STT", minWidth: 100 },
    { id: "name", label: "Tên danh mục", minWidth: 100 },
    { id: "description", label: "Mô tả", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 100 },
];
function CategoryPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await CategoryService.getAll({
                page: page,
                size: rowsPerPage,
            });
            setData(res?.response?.content);
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(data);
        try {
            if (category.id) {
                const res = await CategoryService.update({
                    id: category.id,
                    name: data.get('name'),
                    description: data.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    setCategory({});
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await CategoryService.create({
                    name: data.get('name'),
                    description: data.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Thêm mới thành công');
                    fetchData();
                } else {
                    toast.error('Thêm mới thất bại');
                }
            }
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (id) => {
        // confirm xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) {
            return;
        }
        const resCheck = await CategoryService.checkProductExistByCategory(id);
        if (resCheck?.response) {
            toast.error('Danh mục này đang chứa sản phẩm, không thể xóa');
            return;
        }
        toast.success('Xóa thành công');
        try {
            setIsLoading(true);
            const res = await CategoryService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa thành công');
                setCategory({});
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
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Danh mục
                </Typography>
                <IconButton onClick={() => {
                    setCategory({});
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12}
                component='form'
                onSubmit={handleSubmit}
            >
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Tên danh mục</Typography>
                </Grid>

                <Grid item xs={10}>
                    <TextField
                        id='name'
                        name='name'
                        // label="Tên danh mục"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={category?.name || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCategory((prev) => {
                                return { ...prev, name: value };
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
                        value={category.description || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCategory((prev) => {
                                return { ...prev, description: value };
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                        <Button type='submit' variant="contained" fullWidth>
                            {category.id ? "Cập nhật" : "Thêm mới"}
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
                                                                    setCategory(row);
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

export default CategoryPage