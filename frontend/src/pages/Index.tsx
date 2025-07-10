
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "@/components/auth/LoginPage";
import RegisterPage from "@/components/auth/RegisterPage";
import AddProductsPage from "@/components/products/AddProductsPage";
import GeneratePDFPage from "@/components/pdf/GeneratePDFPage";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/add-products" replace /> : 
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/add-products" replace /> : 
            <RegisterPage />
          } 
        />
        <Route 
          path="/add-products" 
          element={
            isAuthenticated ? 
            <AddProductsPage /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/generate-pdf" 
          element={
            isAuthenticated ? 
            <GeneratePDFPage /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default Index;
