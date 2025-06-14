import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/Login";
import OTPVerification from "./pages/OTPVerification ";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoute from "./routes/PublicRoutes";
import ArticleForm from "./pages/ArticleForm";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import Profile from "./pages/Profile";
import ArticleEditWrapper from "./components/ArticleEditWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-article"
            element={
              <ArticleForm
                onSubmit={async (data) => console.log("Submitted:", data)}
              />
            }
          />
          <Route path="/edit-article/:id" element={<ArticleEditWrapper />} />

          <Route path="/view-detail/:id" element={<ArticleDetailPage />} />
        </Route>
          <Route path="/profile" element={<Profile />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Route>

        <Route path="/otp-verification" element={<OTPVerification />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
