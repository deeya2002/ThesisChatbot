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
import Play from './pages/free-quiz/Play';
import QuizSummary from './pages/free-quiz/QuizSummary';
import FreeGameInstructions from './pages/Instructions';
import Home from './pages/Quiz';
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
        <Route path='/quiz' element={<Home />} />
        <Route path="/instructions" element={<FreeGameInstructions />} />
        <Route path="/play" element={<Play />} />
        <Route path="/quizSummary" element={QuizSummary} />
      </Routes>
    </Router>
  );
}

export default App;
