// Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Facebook, Instagram, Twitter, Email, Phone } from '@mui/icons-material';
import { Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)',
        py: 5,
        mt: 'auto',
        width: '100%',
        boxShadow: '0 -2px 24px 0 rgba(33, 150, 243, 0.08)',
        position: 'relative',
      }}
    >
      <Container>
        <Divider sx={{ mb: 4, opacity: 0.2 }} />
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', letterSpacing: 1 }}>
              THÔNG TIN CỬA HÀNG 
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 600, color: '#222' }}>
              CỬA HÀNG QUẦN ÁO TRẺ EM KisShop
            </Typography>
            <Typography variant='body2' sx={{ color: '#444', mb: 1 }}>Địa chỉ: 19 ngách 21/32 ngõ 230 Mễ Trì Thượng, Hà Nội</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {[{icon: Facebook, href: '#', color: '#1976d2'}, {icon: Instagram, href: '#', color: '#e1306c'}, {icon: Twitter, href: '#', color: '#1da1f2'}].map((item, idx) => (
                <Link key={idx} href={item.href} target="_blank" underline="none" sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                  color: item.color,
                  fontSize: 24,
                  transition: 'all 0.3s',
                  mr: idx !== 2 ? 2 : 0,
                  '&:hover': {
                    background: item.color,
                    color: '#fff',
                    transform: 'scale(1.12)',
                    boxShadow: `0 4px 16px 0 ${item.color}33`,
                  },
                }}>
                  <item.icon fontSize="inherit" />
                </Link>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', letterSpacing: 1 }}>
              VỀ KISSHOP
            </Typography>
            <Typography variant='body2' sx={{ color: '#444', mb: 1 }}>
              <Link href='#' color='inherit' underline="hover" sx={{ fontWeight: 500 }}>
                Giới thiệu
              </Link>
            </Typography>
            <Typography variant='body2' sx={{ color: '#444', mb: 1 }}>
              <Link href='#' color='inherit' underline="hover" sx={{ fontWeight: 500 }}>
                Chính sách bảo mật
              </Link>
            </Typography>
            <Typography variant='body2' sx={{ color: '#444', mb: 1 }}>
              <Link href='#' color='inherit' underline="hover" sx={{ fontWeight: 500 }}>
                Điều khoản sử dụng
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', letterSpacing: 1 }}>
              LIÊN HỆ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant='body2' sx={{ color: '#444', fontWeight: 500 }}>
                KisShop@gmail.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant='body2' sx={{ color: '#444', fontWeight: 500 }}>
                032087588
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 5, mb: 2, opacity: 0.15 }} />
        <Box sx={{ textAlign: 'center', color: '#888', fontSize: 15, letterSpacing: 1, mt: 2 }}>
          &copy; {new Date().getFullYear()} KisShop. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
