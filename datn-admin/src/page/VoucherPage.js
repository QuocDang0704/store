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
import VoucherService from '../service/VoucherService';
import { AddCircleOutline } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';


const columns = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "discountAmount", label: "Số tiền giảm", minWidth: 100 },
    { id: "conditions", label: "Điều kiện", minWidth: 100 },
    { id: "quantity", label: "Số lượng", minWidth: 100 },
    { id: "createdDate", label: "Ngày tạo", minWidth: 100 },
    { id: "expirationDate", label: "Ngày hết hạn", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 100 },
];
function VoucherPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

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
        console.log(data.get('createdDate'));
        try {
            if (item.id) {
                const res = await VoucherService.update({
                    id: item.id,
                    discountAmount: data.get('discountAmount'),
                    conditions: data.get('conditions'),
                    quantity: data.get('quantity'),
                    createdDate: data.get('createdDate'),
                    expirationDate: data.get('expirationDate'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật thành công');
                    setItem({});
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
            const res = await VoucherService.delete(id);
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
                    Mã giảm giá
                </Typography>
                <IconButton onClick={() => {
                    setItem({});
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12} component='form' onSubmit={handleSubmit}>
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Số tiền giảm</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='discountAmount'
                        name='discountAmount'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.discountAmount || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, discountAmount: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Điều kiện</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='conditions'
                        name='conditions'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.conditions || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, conditions: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Số lượng</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='quantity'
                        name='quantity'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={item?.quantity || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setItem((prev) => {
                                return { ...prev, quantity: value };
                            });
                        }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Ngày tạo</Typography>
                </Grid>
                <Grid item xs={10}>
                    <DatePicker
                        defaultValue={dayjs(Date())}
                        id='createdDate'
                        name='createdDate'
                        inputFormat="yyyy-MM-dd"
                        value={dayjs(item?.createdDate) || null}
                        onChange={(date) => {
                            setItem((prev) => {
                                return { ...prev, createdDate: date };
                            });
                        }}
                        format='YYYY-MM-DD'
                        renderInput={(params) => <TextField {...params} variant="outlined" margin="normal" fullWidth />}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Ngày hết hạn</Typography>
                </Grid>
                <Grid item xs={10}>
                    <DatePicker
                        defaultValue={dayjs(Date())}
                        id='expirationDate'
                        name='expirationDate'
                        inputFormat="yyyy-MM-dd"
                        value={dayjs(item?.expirationDate) || null}
                        onChange={(date) => {
                            setItem((prev) => {
                                return { ...prev, expirationDate: date };
                            });
                        }}
                        format='YYYY-MM-DD'
                        renderInput={(params) => <TextField {...params} variant="outlined" margin="normal" fullWidth />}
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

export default VoucherPage