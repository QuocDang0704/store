import {
    Avatar,
    Badge,
    Button,
    Divider,
    IconButton,
    List,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import { useState } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image } from "@mui/icons-material";
import { listItems } from "./listItems";
import SidebarItem from "./SidebarItem";
import logo from "../../assets/logo.svg";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";

const drawerWidth = 300;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

const LeftSide = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const currentClient = AuthService.getClientId()
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        handleClose();
        await AuthService.logout();
        toast.success('Logout success');
        navigate('/login');
    };

    const pathName = useLocation();
    return (
        <>
            {pathName?.pathname !== '/login' && (
                <>
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: "24px", // keep right padding when drawer closed
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: "36px",
                                    ...(open && { display: "none" }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                {listItems.map((item) => {
                                    if (item.children) {
                                        return item.children.map((child) => {
                                            if (pathName === child.path) {
                                                return child.name;
                                            }
                                        });
                                    }
                                    if (pathName === item.path) {
                                        return item.name;
                                    }
                                })}
                            </Typography>
                            {/* <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton> */}
                            {!currentClient ? (
                                <>
                                    <Button color='inherit' component={Link} to='/login'>
                                        Đăng Nhập
                                    </Button>
                                </>
                            ) : (
                                <>

                                    <Typography sx={{ mr: 2 }}>{currentClient}</Typography>
                                    <IconButton color='inherit' onClick={handleMenu}>
                                        <Avatar alt='Tên Khách Hàng' src='/static/images/avatar/1.jpg' />
                                    </IconButton>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id='menu-appbar'
                                        anchorEl={anchorEl ?? undefined}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleLogout}>
                                            <Typography textAlign='center'>Đăng xuất</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: [1],
                            }}
                        >
                            <img src={logo} alt="" width={100} height={100} style={{ marginLeft: '30px' }} />
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            {listItems.map((item) => (
                                <SidebarItem key={item.id} {...item} path={item.path || ""} />
                            ))}
                        </List>
                    </Drawer>
                </>
            )}
        </>
    );
};

export default LeftSide;
