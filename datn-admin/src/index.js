import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppsRoutes from './config/AppsRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom/dist';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Container, CssBaseline, Toolbar } from '@mui/material';
import LeftSide from './components/commom/LeftSide';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", height: "100vh", width: "1" }}>
        <CssBaseline />
        <LeftSide />

        <Box component={"main"} sx={{ width: 1 }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <AppsRoutes />
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
    <ToastContainer position='top-right' autoClose={1500} />
  </BrowserRouter>,
  // </React.StrictMode>
);
