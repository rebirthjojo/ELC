import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Headers from './Pages/Header.js';
import Main from './Pages/Main.js';
import Detail from './Pages/Detail.js';
import {AdmPage} from './Pages/Tapmodalbase.js'
import { AuthProvider } from './context/AuthContext.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Headers />
        <Routes>        
          <Route path = '/' element={<Main />}></Route>
          <Route path = '/AdmPage' element={<AdmPage />}></Route>
          <Route path = '/Detail' element={<Detail />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;