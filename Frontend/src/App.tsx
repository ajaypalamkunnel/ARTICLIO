import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/Login";
import OTPVerification from "./pages/OTPVerification ";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/registration" element={<RegistrationPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/otp-verification" element={<OTPVerification/>}/>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
     
    )
  
}

export default App;
