import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage';
import Nav from './components/Nav';
import TutorialSequencer from './pages/TutorialSequencer';
import TutorialDrumMachine from './pages/TutorialDrumMachine';
import DrumRack from './pages/DrumRack';
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer';
import Test from './pages/Test';


function App() {
  return (
    <BrowserRouter>
    <Nav/>
    <Routes>
    <Route path="/" element={<DrumRack/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/demo" element={<TutorialSequencer/>}/>
    <Route path="/drum" element={<TutorialDrumMachine/>}/>
    <Route path="*" element={<NotFoundPage/>}/>
    <Route path="/test" element={<Test/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
