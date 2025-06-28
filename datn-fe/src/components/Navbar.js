import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../service/AuthService';
import { toast } from 'react-toastify';
import { Avatar, Menu, MenuItem, Badge, IconButton } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
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
      position='static'
      color='inherit'
      sx={{ backgroundColor: '#EEF2F6' }}
    >
      <Toolbar>
        <Typography
          variant='h6'
          component='div'
          sx={{
            cursor: 'pointer',
            fontSize: '22px',
            fontWeight: 500,
            marginRight: 5,
          }}
          onClick={() => navigate('/')}
        >
          Trang chủ
        </Typography>
        <Typography
          variant='h6'
          component='div'
          sx={{ cursor: 'pointer', fontSize: '22px', fontWeight: 500, marginRight: 5  }}
          onClick={() => navigate('/')}
        >
          Giới thiệu
        </Typography>
        <Typography
          variant='h6'
          component='div'
          sx={{ flexGrow: 0.8, cursor: 'pointer', fontSize: '22px', fontWeight: 500 }}
          onClick={() => navigate('/')}
        >
          Liên hệ
        </Typography>
        <Typography
          variant='h6'
          component='div'
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img src={logo} alt='Logo' style={{ height: '70px' }} />
        </Typography>

        {!currentClient ? (
          <>
            <Button color='inherit' component={Link} to='/cart'>
              <Badge badgeContent={cartItems} color='primary'>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </Button>
            <Button color='inherit' component={Link} to='/login'>
              Đăng Nhập
            </Button>
          </>
        ) : (
          <>
            <Button color='inherit' component={Link} to='/cart'>
              <Badge badgeContent={cartItems} color='primary'>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </Button>
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
              <MenuItem onClick={() => navigate('/order')}>
                <Typography textAlign='center'>Lịch sử đặt hàng</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
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
