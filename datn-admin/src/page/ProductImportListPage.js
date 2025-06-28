import React from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Table,
    Typography,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import { AddCircleOutline, Delete, Details, Edit } from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import ProductService from '../service/ProductService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryService from '../service/CategoryService';
import SupplierService from '../service/SupplierService';
import ProductDetail from '../components/ProductDetail';
import { useNavigate } from 'react-router-dom';
import WarehouseEntryService from '../service/WarehouseEntryService';
import { format } from 'date-fns';
import ProductImportListItem from '../components/ProductImportListItem';
import { ro, se } from 'date-fns/locale';
import HandleError from '../utils/HandleError';


const columns = [
    { id: "STT", label: "STT", minWidth: 10 },
    { id: "nameStaff", label: "Người tạo", minWidth: 100 },
    { id: "roleStaff", label: "Chức vụ", minWidth: 100 },
    { id: "createdDate", label: "Thời gian tạo", minWidth: 100 },
    { id: "totalPrice", label: "Tổng giá trị đơn nhập", minWidth: 100 },
    { id: "action", label: "Chi tiết", minWidth: 150 },
];

function ProductImportListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [listProductDetail, setListProductDetail] = useState([]);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await WarehouseEntryService.getAll({
                page: page,
                size: rowsPerPage,
            });
            const data = res?.response?.content.map((item, index) => {
                const role = item?.user?.role.map((item) => item.name).join(', ');
                const totalPrice = item?.warehouseEntryDetails?.reduce((total, item) => total + item.price * item.quantity, 0);

                return {
                    nameStaff: item?.user?.userName,
                    roleStaff: role,
                    totalPrice: formatVietnameseCurrency(totalPrice),
                    ...item,
                }
            });
            setData(data);
            setCount(res?.response?.totalElements);

        } catch (e) {
            HandleError.component(e, navigate);
        } finally {
            setIsLoading(false);
        }
    };

    const formatVietnameseCurrency = (value) => {
        const formattedValue = value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedValue;
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleViewDetail = async (row) => {
        setOpen(true);
        
        const list = row?.warehouseEntryDetails?.map((item, index) => {
            return {
                id: item?.id,
                images: item?.productDetail?.images,
                quantity: item?.quantity,
                price: formatVietnameseCurrency(item?.price),
                sizeName: item?.productDetail?.size?.name,
                colorName: item?.productDetail?.color?.name,
            }
        });
        setListProductDetail(list);
        console.log(list);
    }

    return (
        <Grid container spacing={3}>
            <Loading isLoading={isLoading} />
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
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
                        borderRadius: 5,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: 'calc(100vh - 100px)', // Giới hạn chiều cao của modal và trừ điều chỉnh cho tiêu đề và nút đóng
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
                    {open && (
                        <ProductImportListItem list={listProductDetail} />
                    )}
                </Box>
            </Modal>


            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Danh sách nhập hàng
                </Typography>
            </Grid>

            <Grid item xs={12}
                sx={{
                    my: 4,
                    p: 2,
                    // border: 1,
                    borderRadius: 1,
                }}>
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
                            {data?.map((row, index) => {
                                return (
                                    <TableRow hover
                                        role="checkbox" tabIndex={-1} key={row.id}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id}
                                                >
                                                    {column.id === "STT" ? page * 10 + index + 1 : ""}

                                                    {column.id === "images" ? (
                                                        <img src={value} alt="product" style={{ width: 50, height: 50 }} />
                                                    ) : column.id === "action" ? (
                                                        <Fragment>
                                                            <IconButton
                                                                size='small'
                                                                onClick={() => handleViewDetail(row)}
                                                            >
                                                                <Details />
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
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
}

export default ProductImportListPage
