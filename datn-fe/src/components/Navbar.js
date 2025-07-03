import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../service/AuthService';
import { toast } from 'react-toastify';
import { Avatar, Menu, MenuItem, Badge, IconButton, Box, Tooltip } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartItems, setCartItems] = useState(0);
  const currentClient = AuthService.getClientId();

  const handleLogout = async () => {
    handleClose();
    await AuthService.logout();
    toast.success('Logout success');
    navigate('/login');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position='sticky'
      elevation={0}
      color='transparent'
      sx={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 2px 16px 0 rgba(33,150,243,0.07)',
        borderBottom: '1.5px solid #e3eafc',
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ minHeight: 80, px: { xs: 1, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, cursor: 'pointer' }} onClick={() => navigate('/') }>
          <img src={logo} alt='Logo' style={{ height: 56, marginRight: 10, borderRadius: 12, boxShadow: '0 2px 8px #e3eafc' }} />
          <Typography variant='h5' sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}>KisShop</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center', gap: 3 }}>
          {[
            { label: 'Trang chủ', path: '/' },
            { label: 'Giới thiệu', path: '/about' },
            { label: 'Liên hệ', path: '/contact' },
          ].map((item) => (
            <Typography
              key={item.label}
              variant='h6'
              component='div'
              sx={{
                cursor: 'pointer',
                fontSize: '20px',
                fontWeight: 500,
                color: '#222',
                position: 'relative',
                px: 1.5,
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#1976d2',
                },
                '&:after': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  left: 0,
                  bottom: -4,
                  width: '100%',
                  height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  opacity: 0,
                  transform: 'scaleX(0)',
                  transition: 'all 0.25s cubic-bezier(.4,2,.3,1)',
                },
                '&:hover:after': {
                  opacity: 1,
                  transform: 'scaleX(1)',
                },
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {!currentClient ? (
          <>
            <Tooltip title="Giỏ hàng">
              <IconButton color='primary' component={Link} to='/cart' sx={{ mx: 1, bgcolor: '#f5faff', '&:hover': { bgcolor: '#e3f2fd' } }}>
                <Badge badgeContent={cartItems} color='error' overlap='circular' showZero>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 30 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Button 
              color='primary' 
              component={Link} 
              to='/login' 
              startIcon={<LoginIcon />} 
              sx={{
                fontWeight: 600,
                borderRadius: 3,
                px: 2.5,
                py: 1,
                ml: 1,
                background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px #e3eafc',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                  color: '#fff',
                },
                transition: 'all 0.3s',
              }}
            >
              Đăng Nhập
            </Button>
          </>
        ) : (
          <>
            <Tooltip title="Giỏ hàng">
              <IconButton color='primary' component={Link} to='/cart' sx={{ mx: 1, bgcolor: '#f5faff', '&:hover': { bgcolor: '#e3f2fd' } }}>
                <Badge badgeContent={cartItems} color='error' overlap='circular' showZero>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 30 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
              <PersonIcon sx={{ color: '#1976d2', fontSize: 26 }} />
              <Typography sx={{ fontWeight: 600, color: '#1976d2', fontSize: 17 }}>{currentClient}</Typography>
            </Box>
            <Tooltip title="Tài khoản">
              <IconButton color='primary' onClick={handleMenu} sx={{ bgcolor: '#f5faff', '&:hover': { bgcolor: '#e3f2fd' }, boxShadow: '0 2px 8px #e3eafc' }}>
                <Avatar alt='Tên Khách Hàng' src='/static/images/avatar/1.jpg' sx={{ width: 40, height: 40 }} />
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
                  borderRadius: 3,
                  minWidth: 180,
                  boxShadow: '0 4px 24px 0 rgba(33,150,243,0.13)',
                  mt: 1,
                  p: 0.5,
                }
              }}
            >
              <MenuItem onClick={() => navigate('/order')} sx={{ borderRadius: 2, mb: 0.5 }}>
                <Typography textAlign='center'>Lịch sử đặt hàng</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <Typography textAlign='center'>Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
