import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppsRoutes from './config/AppsRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom/dist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Navbar />
    <AppsRoutes />

    <Footer />
    <ToastContainer position='top-right' autoClose={2000} />
  </BrowserRouter>,
  // </React.StrictMode>
);
