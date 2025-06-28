import { AddCircleOutline, CssOutlined, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
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
        <Grid container spacing={3}>
            <Loading isLoading={isLoading} />
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", margin: '0 0 5px 0' }}>
                <Typography variant="h4" fontWeight="bold">
                    Sản phẩm chi tiết
                </Typography>
                <IconButton onClick={() => {
                    setItem({});
                    setImagePreviewDetail(null);
                }}>
                    <AddCircleOutline /> Thêm mới
                </IconButton>
            </Grid>
            <Grid container item xs={12} component='form' onSubmit={handleSubmit}>
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Tên Sản phẩm</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id='name'
                        name='name'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={productInfo.name || ""}
                        disabled={true}
                    />
                    <TextField
                        id='productId'
                        name='productId'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={productInfo.id || ""}
                        style={{ display: 'none' }}
                    />
                </Grid>

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Ảnh</Typography>
                </Grid>
                <Grid item xs={10} sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <input
                        // accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file-detail"
                        name="upload-file-detail"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (imagePreviewDetail) {
                                URL.revokeObjectURL(imagePreviewDetail);
                            }
                            setImagePreviewDetail(URL.createObjectURL(file)); // Hiển thị xem trước ảnh
                            // Handle file upload logic here
                        }}
                    />
                    <label htmlFor="upload-file-detail">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                        >
                            Chọn ảnh
                        </Button>
                    </label>
                    {imagePreviewDetail && (
                        <img
                            src={imagePreviewDetail}
                            alt="Ảnh xem trước"
                            style={{ marginLeft: '30px', maxWidth: '150px', maxHeight: '150px' }}
                        />
                    )}
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
                    <Typography>Kích cỡ</Typography>
                </Grid>
                <Grid item xs={10}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <Select
                            labelId="size-label"
                            id="sizeId"
                            name="sizeId"
                            value={item.sizeId || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log(value);
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

                <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Màu sắc</Typography>
                </Grid>
                <Grid item xs={10}>
                    <FormControl fullWidth variant="outlined" margin="normal">
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
                        >
                            {listColor.map((color) => (
                                <MenuItem key={color.id} value={color.id}>
                                    {color.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: 1 }}>
                        <Button type='submit' variant="contained" fullWidth>
                            {item.id ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Grid item xs={12} className="my-4 p-2 border rounded">
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columnsDetail.map((column) => (
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columnsDetail.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id}>
                                                    {column.id === "STT" ? index + 1 : ""}
                                                    {column.id === "images" ? (
                                                        <img src={value} alt="product" style={{ width: 50, height: 50 }} />
                                                    ) : column.id === "action" ? (
                                                        <Fragment>
                                                            <IconButton
                                                                size='small'
                                                                onClick={() => {
                                                                    setImagePreviewDetail(row.images)
                                                                    setItem(row);
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
            </Grid>
        </Grid>
    );
}

export default ProductDetail;