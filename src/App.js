import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Headers from './Pages/Header.js';
import Main from './Pages/Main.js';

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes>        
        <Route path = '/' element={<Main />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;