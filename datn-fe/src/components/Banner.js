import React from 'react';
import { Card, CardMedia } from '@mui/material';
import BannerImg from '../assets/banner_1.png';

const Banner = () => {
  return (
    <Card>
      <CardMedia
        component='img'
        height='auto'
        width='100%'
        image={BannerImg}
        alt='Banner image'
        sx={{ objectFit: 'cover' }}
      />
    </Card>
  );
};

export default Banner;
