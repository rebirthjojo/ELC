import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Headers from './Pages/Header.js';

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes>        
        <Route path = '/' element={<main />}></Route>
        <Route path = '/course' element={<course />}></Route>
        <Route path = '/mycourse' element={<mycourse />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
