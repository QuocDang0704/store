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
    Box,
    Paper,
    Stack,
    Tooltip,
    Fade
} from "@mui/material";
import { useState } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listItems } from "./listItems";
import SidebarItem from "./SidebarItem";
import logo from "../../assets/logo.png";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#ffffff',
    color: '#333333',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
        backgroundColor: '#ffffff',
        color: '#333333',
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        borderRight: '1px solid #e0e0e0',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
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
        toast.success('Đăng xuất thành công');
        navigate('/login');
    };

    const pathName = useLocation();
    
    // Get current page title
    const getCurrentPageTitle = () => {
        for (const item of listItems) {
            if (item.children) {
                for (const child of item.children) {
                    if (pathName.pathname === child.path) {
                        return child.name;
                    }
                }
            }
            if (pathName.pathname === item.path) {
                return item.name;
            }
        }
        return 'Dashboard';
    };

    return (
        <>
            {pathName?.pathname !== '/login' && (
                <>
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: "24px",
                                minHeight: '70px',
                                backgroundColor: '#ffffff',
                                borderBottom: '1px solid #e0e0e0'
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: "36px",
                                    color: '#666666',
                                    ...(open && { display: "none" }),
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h5"
                                color="inherit"
                                noWrap
                                sx={{ 
                                    flexGrow: 1, 
                                    fontWeight: 600,
                                    color: '#333333'
                                }}
                            >
                                {getCurrentPageTitle()}
                            </Typography>
                            
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Tooltip title="Thông báo" TransitionComponent={Fade}>
                                    <IconButton 
                                        color="inherit"
                                        sx={{ 
                                            color: '#666666',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <Badge badgeContent={4} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                
                                {!currentClient ? (
                                    <Button 
                                        variant="contained" 
                                        component={Link} 
                                        to='/login'
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Đăng Nhập
                                    </Button>
                                ) : (
                                    <>
                                        <Typography 
                                            sx={{ 
                                                mr: 2, 
                                                color: '#666666',
                                                fontWeight: 500
                                            }}
                                        >
                                            {currentClient}
                                        </Typography>
                                        <Tooltip title="Tài khoản" TransitionComponent={Fade}>
                                            <IconButton 
                                                color='inherit' 
                                                onClick={handleMenu}
                                                sx={{ 
                                                    '&:hover': { 
                                                        backgroundColor: '#f5f5f5' 
                                                    }
                                                }}
                                            >
                                                <Avatar 
                                                    alt='Tên Khách Hàng' 
                                                    src='/static/images/avatar/1.jpg'
                                                    sx={{ 
                                                        width: 40, 
                                                        height: 40,
                                                        border: '2px solid #e0e0e0'
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
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
                                            PaperProps={{
                                                sx: {
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                    mt: 1
                                                }
                                            }}
                                        >
                                            <MenuItem onClick={handleLogout} sx={{ px: 3, py: 1.5 }}>
                                                <Typography textAlign='center' sx={{ fontWeight: 500 }}>
                                                    Đăng xuất
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </>
                                )}
                            </Stack>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            px: 3,
                            py: 2,
                            minHeight: '70px',
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: '#fafafa'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <img 
                                    src={logo} 
                                    alt="Logo" 
                                    style={{ 
                                        width: 40, 
                                        height: 40,
                                        borderRadius: '8px'
                                    }} 
                                />
                                {open && (
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: '#333333'
                                        }}
                                    >
                                        Admin Panel
                                    </Typography>
                                )}
                            </Box>
                            <IconButton 
                                onClick={toggleDrawer}
                                sx={{ 
                                    color: '#666666',
                                    '&:hover': { 
                                        backgroundColor: '#f0f0f0' 
                                    }
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ borderColor: '#e0e0e0' }} />
                        <List 
                            component="nav" 
                            sx={{ 
                                px: 1,
                                py: 2
                            }}
                        >
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
