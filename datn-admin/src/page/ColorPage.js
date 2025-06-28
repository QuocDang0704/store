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
    Avatar,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Fragment, useEffect, useState } from "react";
import ColorService from '../service/ColorService';
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Palette as ColorIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import { ChromePicker } from 'react-color';
import HandleError from '../utils/HandleError';

const columns = [
    { id: "STT", label: "STT", minWidth: 80, align: 'center' },
    { id: "name", label: "Tên màu sắc", minWidth: 200 },
    { id: "hex", label: "Mã màu", minWidth: 150, align: 'center' },
    { id: "preview", label: "Xem trước", minWidth: 100, align: 'center' },
    { id: "action", label: "Hành động", minWidth: 150, align: 'center' },
];

function ColorPage() {
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
            const res = await ColorService.getAll({
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
        const formData = new FormData(e.currentTarget);
        
        if (!formData.get('name').trim()) {
            toast.error('Vui lòng nhập tên màu sắc');
            return;
        }

        if (!formData.get('hex').trim()) {
            toast.error('Vui lòng chọn mã màu');
            return;
        }

        try {
            setIsSubmitting(true);
            if (item.id) {
                const res = await ColorService.update({
                    id: item.id,
                    name: formData.get('name'),
                    hex: formData.get('hex'),
                });
                if (res.code === '0') {
                    toast.success('Cập nhật màu sắc thành công');
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Cập nhật thất bại');
                }
            } else {
                const res = await ColorService.create({
                    name: formData.get('name'),
                    hex: formData.get('hex'),
                });
                if (res.code === '0') {
                    toast.success('Thêm màu sắc mới thành công');
                    handleCloseForm();
                    fetchData();
                } else {
                    toast.error('Thêm mới thất bại');
                }
            }
        } catch (error) {
            HandleError.component(error, navigate);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa màu sắc này?')) {
            return;
        }

        try {
            setIsLoading(true);
            const resCheck = await ColorService.checkProductExistByColorId(id);
            if (resCheck?.response) {
                toast.error('Không thể xóa màu sắc này vì đã có sản phẩm sử dụng');
                return;
            }
            
            const res = await ColorService.delete(id);
            if (res.code === '0') {
                toast.success('Xóa màu sắc thành công');
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
                        <ColorIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Quản lý Màu sắc
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
                        Thêm màu sắc mới
                    </Button>
                </Box>
            </Paper>

            {/* Color Form Dialog */}
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
                    <ColorIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        {item.id ? 'Chỉnh sửa màu sắc' : 'Thêm màu sắc mới'}
                    </Typography>
                </DialogTitle>
                
                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id='name'
                                    name='name'
                                    label="Tên màu sắc"
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
                                        startAdornment: <ColorIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="600" mb={2}>
                                    Chọn màu sắc
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                    <Box>
                                        <ChromePicker
                                            color={item.hex || '#000000'}
                                            onChange={(color) => {
                                                setItem((prev) => ({
                                                    ...prev, 
                                                    hex: color.hex
                                                }));
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            id='hex'
                                            name='hex'
                                            label="Mã màu (HEX)"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={item?.hex || ""}
                                            onChange={(e) => {
                                                setItem((prev) => ({
                                                    ...prev, 
                                                    hex: e.target.value
                                                }));
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box 
                                                        sx={{ 
                                                            width: 20, 
                                                            height: 20, 
                                                            borderRadius: '50%', 
                                                            backgroundColor: item?.hex || '#000000',
                                                            mr: 1,
                                                            border: '1px solid #ddd'
                                                        }} 
                                                    />
                                                )
                                            }}
                                        />
                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Xem trước:
                                            </Typography>
                                            <Box 
                                                sx={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    borderRadius: 2, 
                                                    backgroundColor: item?.hex || '#000000',
                                                    border: '2px solid #ddd',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }} 
                                            />
                                        </Box>
                                    </Box>
                                </Box>
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
                        Danh sách màu sắc ({data.length} màu)
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
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ColorIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Chưa có màu sắc nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy thêm màu sắc đầu tiên để bắt đầu
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
                                        <TableCell align="center">
                                            <Typography variant="body2" fontFamily="monospace" fontWeight="600">
                                                {row.hex?.toUpperCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box 
                                                sx={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    borderRadius: 2, 
                                                    backgroundColor: row.hex || '#000000',
                                                    border: '2px solid #ddd',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    mx: 'auto'
                                                }} 
                                            />
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

export default ColorPage;