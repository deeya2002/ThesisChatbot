import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// for showing toast messages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Server from './server';



function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Server />} />
        {/* <Route path='/' element={<Homepage />} /> */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;
