import React from 'react';
import { CircularProgress, LinearProgress, Typography } from '@mui/material';

const loadingStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  zIndex: 9999,
};

const Loading = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div style={loadingStyle}>
      <CircularProgress />
      <Typography
        variant='body1'
        color='textSecondary'
        style={{ marginTop: 10 }}
      >
        Loading...
      </Typography>
    </div>
  );
};

export default Loading;
