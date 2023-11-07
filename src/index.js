import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { FilterProvider } from './context/advanceFilterContext';
import { SpinnerProvider } from './context/spinnerContext';
import { SnackbarProvider } from './context/snackbarContext';
import { DialogProvider } from './context/adminDialogContext';
import { DialogDataProvider } from './context/dialogDataContext';


axios.interceptors.request.use(config => {
  let token = JSON.parse(localStorage.getItem('token'))
  config.headers['Authorization'] = `Bearer ${token}`
  return config;
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> 
  <DialogDataProvider>
    <DialogProvider>
      <SnackbarProvider>
        <SpinnerProvider>
          <FilterProvider>
            <App />
          </FilterProvider>
        </SpinnerProvider>
      </SnackbarProvider>
    </DialogProvider>
  </DialogDataProvider>
  //  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
