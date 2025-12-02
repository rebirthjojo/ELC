import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Headers from './Pages/Header.js';
import Main from './Pages/Main.js';
import Detail from './Pages/Detail.js';
import {AdmPage} from './Pages/Tapmodalbase.js'

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes>        
        <Route path = '/' element={<Main />}></Route>
        <Route path = '/AdmPage' element={<AdmPage />}></Route>
        <Route path = '/Detail' element={<Detail />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;