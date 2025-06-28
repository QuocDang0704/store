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
    Card,
    CardContent,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Stack,
    Tooltip,
    Fade,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import SizeService from '../service/SizeService';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Straighten as SizeIcon,
    Description as DescriptionIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import HandleError from '../utils/HandleError';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "name", label: "Tên kích cỡ", minWidth: 200 },
    { id: "description", label: "Mô tả", minWidth: 300 },
    { id: "action", label: "Hành động", minWidth: 150, align: 'center' },
];

function SizePage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await SizeService.getAll({
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
        const formData = new FormData(e.currentTarget);
        
        if (!formData.get('name').trim()) {
            toast.error('Vui lòng nhập tên kích cỡ');
            return;
        }

        try {
            setIsSubmitting(true);
            if (item.id) {
                const res = await SizeService.update({
                    id: item.id,
                    name: formData.get('name'),
                    description: formData.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật kích cỡ thành công');
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await SizeService.create({
                    name: formData.get('name'),
                    description: formData.get('description'),
                });
                if (res.code === '0') {
                    toast.success('Thêm kích cỡ mới thành công');
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
        if (!window.confirm('Bạn có chắc chắn muốn xóa kích cỡ này?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            const resCheck = await SizeService.checkProductExistBySizeId(id);
            if (resCheck?.response) {
                toast.error('Không thể xóa kích cỡ này vì đã có sản phẩm sử dụng');
                return;
            }
            
            const res = await SizeService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa kích cỡ thành công');
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

    const handleEdit = (row) => {
        setItem(row);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setItem({});
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setItem({});
        setIsFormOpen(false);
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
                        <SizeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Kích cỡ
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        Thêm kích cỡ mới
                    </Button>
                </Box>
            </Paper>

            {/* Size Form Dialog */}
            <Dialog 
                open={isFormOpen} 
                onClose={handleCloseForm}
                maxWidth="md"
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
                    <SizeIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        {item.id ? 'Chỉnh sửa kích cỡ' : 'Thêm kích cỡ mới'}
                    </Typography>
                </DialogTitle>
                
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id='name'
                                    name='name'
                                    label="Tên kích cỡ"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={item?.name || ""}
                                    onChange={(e) => {
                                        setItem((prev) => ({
                                            ...prev, 
                                            name: e.target.value
                                        }));
                                    }}
                                    InputProps={{
                                        startAdornment: <SizeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id='description'
                                    name='description'
                                    label="Mô tả"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    value={item?.description || ""}
                                    onChange={(e) => {
                                        setItem((prev) => ({
                                            ...prev, 
                                            description: e.target.value
                                        }));
                                    }}
                                    InputProps={{
                                        startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button
                            onClick={handleCloseForm}
                            startIcon={<CancelIcon />}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
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
                        Danh sách kích cỡ ({data.length} kích cỡ)
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
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <SizeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có kích cỡ nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm kích cỡ đầu tiên để bắt đầu
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
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Chỉnh sửa" TransitionComponent={Fade}>
                                                    <IconButton
                                                        onClick={() => handleEdit(row)}
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
                
                {data.length > 0 && (
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
                )}
            </Paper>
        </Box>
    );
}

export default SizePage;