import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Headers from './Pages/Header.js';
import Home from './Pages/Home.js'
import Main from './Pages/Main.js';
import Checkout from './Pages/CheckoutPage.js';
import Detail from './Pages/Detail.js';
import {AdmPage} from './Pages/Tapmodalbase.js'
import { AuthProvider } from './context/AuthContext.js';
import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext.js';
import { setupInterceptors } from './context/AuthInterceptors.js';
import SearchPage from './Pages/Search.js';

const AppInitializer = () => {
  const authContext = useAuth();

  useEffect(() => {
    setupInterceptors(authContext);
  }, [authContext.token]);

  return(
    <>
      <Headers/>
      <Routes>
        <Route path = '/' element={<Home />}></Route>
        <Route path = '/Main' element={<Main />}></Route>
        <Route path = '/Checkout/:title' element={<Checkout />}></Route>
        <Route path = '/AdmPage' element={<AdmPage />}></Route>
        <Route path = '/Detail/' element={<Detail />}></Route>
        <Route path = '/search' element={<SearchPage />}></Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInitializer/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;