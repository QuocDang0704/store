import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Fragment, useEffect, useState } from "react";
import Loading from "../utils/Loading";
import SizeService from "../service/SizeService";
import ColorService from "../service/ColorService";
import { id } from "date-fns/locale";
import ProductService from "../service/ProductService";
import { toast } from "react-toastify";
import { set } from "date-fns";

const columnsDetail = [
    { id: "STT", label: "STT", minWidth: 50 },
    { id: "images", label: "Ảnh", minWidth: 100 },
    { id: "name", label: "Tên sản phẩm", minWidth: 100 },
    { id: "quantity", label: "Số lượng", minWidth: 100 },
    { id: "sizeName", label: "Kích cỡ", minWidth: 100 },
    { id: "colorName", label: "Màu sắc", minWidth: 100 },
    { id: "action", label: "Hành động", minWidth: 100 },
];
const ProductDetail = (productDetails) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState({});
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [imagePreviewDetail, setImagePreviewDetail] = useState(null);
    const [productInfo, setProductInfo] = useState({});

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [productDetails]);

    const fetchData = async () => {
        const resSize = await SizeService.getAll({
            page: 0,
        });
        setListSize(resSize?.response?.content);

        const resColor = await ColorService.getAll({
            page: 0,
        });
        setListColor(resColor?.response?.content);
        setItem({ name: productDetails?.productDetails.name, });
        setProductInfo(productDetails?.productDetails);

        const res = await ProductService.getProductById(productDetails?.productDetails.id);
        
        const dataDetail = res?.response?.productDetails?.map((item) => {
            return {
                id: item.id,
                images: item.images,
                name: productDetails?.productDetails?.name,
                quantity: item.quantity,
                sizeName: item.size.name,
                colorName: item.color.name,
                sizeId: item.size.id,
                colorId: item.color.id,
            }
        });

        setData(dataDetail);
        setIsLoading(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const dataSend = {
            id: item.id || null,
            productId: data.get('productId'),
            colorId: data.get('colorId'),
            sizeId: data.get('sizeId'),
            quantity: data.get('quantity'),
            imagesFile: data.get('upload-file-detail'),
        }
        console.log(dataSend);

        if (item.id) {
            const res = await ProductService.updateDetail(dataSend);
            if (res.code === '0') {
                toast.success('Cập nhật thành công');
                setItem({});
                fetchData();
            } else {
                toast.error('Cập nhật thất bại');
            }
        } else {
            const res = await ProductService.createDetail(dataSend);
            if (res.code === '0') {
                toast.success('Thêm mới thành công');
                fetchData();
            } else {
                toast.error('Thêm mới thất bại');
            }
        }
    }
    const handleDelete = async (id) => {
        // confirm xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) {
            return;
        }

        const res = await ProductService.deleteProductDetail(id);
        if (res.code === '0') {
            toast.success('Xóa thành công');
            setItem({});
        } else {
            toast.error('Xóa thất bại');
        }
    }
    const getIdSizeByName = (name) => {
        const size = listSize.find((size) => size.name === name);
        return size?.id;
    }
    const getIdColorByName = (name) => {
        const color = listColor.find((color) => color.name === name);
        return color?.id;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: '#fafbfc' }}>
            <Loading isLoading={isLoading} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                    Sản phẩm chi tiết
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleOutline />}
                    onClick={() => {
                        setItem({});
                        setImagePreviewDetail(null);
                    }}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    Thêm mới
                </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Card elevation={0} sx={{ mb: 3, p: 2, borderRadius: 2, background: '#fff' }}>
                <CardContent>
                    <Grid container spacing={2} component='form' onSubmit={handleSubmit}>
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight={600} mb={1}>Tên Sản phẩm</Typography>
                            <TextField
                                id='name'
                                name='name'
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={productInfo.name || ""}
                                disabled={true}
                                size="small"
                            />
                            <TextField
                                id='productId'
                                name='productId'
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={productInfo.id || ""}
                                style={{ display: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography fontWeight={600} mb={1}>Ảnh</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    style={{ display: 'none' }}
                                    id="upload-file-detail"
                                    name="upload-file-detail"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (imagePreviewDetail) {
                                            URL.revokeObjectURL(imagePreviewDetail);
                                        }
                                        setImagePreviewDetail(URL.createObjectURL(file));
                                    }}
                                />
                                <label htmlFor="upload-file-detail">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                    >
                                        Chọn ảnh
                                    </Button>
                                </label>
                                {imagePreviewDetail && (
                                    <Box
                                        sx={{
                                            ml: 3,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            width: 100,
                                            height: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: 1,
                                            background: '#fafbfc',
                                        }}
                                    >
                                        <img
                                            src={imagePreviewDetail}
                                            alt="Ảnh xem trước"
                                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography fontWeight={600} mb={1}>Số lượng</Typography>
                            <TextField
                                id='quantity'
                                name='quantity'
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={item?.quantity || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setItem((prev) => {
                                        return { ...prev, quantity: value };
                                    });
                                }}
                                size="small"
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography fontWeight={600} mb={1}>Kích cỡ</Typography>
                            <FormControl fullWidth variant="outlined" margin="dense" size="small">
                                <Select
                                    labelId="size-label"
                                    id="sizeId"
                                    name="sizeId"
                                    value={item.sizeId || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setItem((prev) => {
                                            return { ...prev, sizeId: value };
                                        });
                                    }}
                                >
                                    {listSize.map((size) => (
                                        <MenuItem key={size.id} value={size.id}>
                                            {size.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography fontWeight={600} mb={1}>Màu sắc</Typography>
                            <FormControl fullWidth variant="outlined" margin="dense" size="small">
                                <Select
                                    labelId="color-label"
                                    id="colorId"
                                    name="colorId"
                                    value={item.colorId || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setItem((prev) => {
                                            return { ...prev, colorId: value };
                                        });
                                    }}
                                    renderValue={(selected) => {
                                        const color = listColor.find((c) => c.id === selected);
                                        return color ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: color.hex, border: '1px solid #ccc', mr: 1 }} />
                                                <span>{color.name}</span>
                                            </Box>
                                        ) : '';
                                    }}
                                >
                                    {listColor.map((color) => (
                                        <MenuItem key={color.id} value={color.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: color.hex, border: '1px solid #ccc', mr: 1 }} />
                                                <span>{color.name}</span>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                                <Button type='submit' variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, px: 5 }}>
                                    {item.id ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card elevation={0} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
                    Danh sách chi tiết sản phẩm
                </Typography>
                <TableContainer sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columnsDetail.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{ minWidth: column.minWidth, fontWeight: 700, background: '#f5f6fa', color: '#333', borderBottom: '2px solid #e0e0e0' }}
                                        align={column.id === 'STT' || column.id === 'images' ? 'center' : 'left'}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ '&:hover': { background: '#f0f4ff' } }}>
                                        {columnsDetail.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.id === 'STT' || column.id === 'images' ? 'center' : 'left'}>
                                                    {column.id === "STT" ? (
                                                        <Typography fontWeight={600}>{index + 1}</Typography>
                                                    ) : column.id === "images" ? (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <img src={value} alt="product" style={{ width: 50, height: 50, borderRadius: 8, border: '1px solid #e0e0e0', objectFit: 'cover' }} />
                                                        </Box>
                                                    ) : column.id === "colorName" ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: (listColor.find(c => c.name === row.colorName)?.hex || '#eee'), border: '1px solid #ccc', mr: 1 }} />
                                                            <span>{row.colorName}</span>
                                                        </Box>
                                                    ) : column.id === "action" ? (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <IconButton
                                                                size='small'
                                                                color="primary"
                                                                onClick={() => {
                                                                    setImagePreviewDetail(row.images)
                                                                    setItem(row);
                                                                }}
                                                                sx={{ borderRadius: 2 }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton
                                                                size='small'
                                                                color="error"
                                                                onClick={() => handleDelete(row.id)}
                                                                sx={{ borderRadius: 2 }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <Typography>{value}</Typography>
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
            </Card>
        </Paper>
    );
}

export default ProductDetail;