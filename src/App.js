import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Headers />
        <Route path = '/' element={<main />}></Route>
        <Route path = '/course' element={<course />}></Route>
        <Route path = '/mycourse' element={<mycourse />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
