import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import EditBook from './components/EditBook';
import AddBook from './components/AddBook';
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import { message, Modal, Input } from 'antd';

const AUTH_TOKEN_KEY = 'auth_token';
if (import.meta.env.DEV){
  sessionStorage.clear()
}

const { Search } = Input;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedToken);

  console.log("App Render: isAuthenticated =", isAuthenticated); 

    // 💡 2. ดูสถานะหลังจาก Login
  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);

    console.log("LOGIN SUCCESS: isAuthenticated set to TRUE."); 
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // เพิ่มหนังสือ
  const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const showSearchModal = () => setIsSearchModalVisible(true);
  const handleSearchModalClose = () => setIsSearchModalVisible(false);

  const showAddBookModal = () => setIsAddBookModalVisible(true);
  const handleAddBookModalClose = () => setIsAddBookModalVisible(false);

  const handleBookAdded = async (values, form) => {
      setIsSubmitting(true);
      try {
          console.log("Form Values Received:", values);
          const token = localStorage.getItem(AUTH_TOKEN_KEY);

          // --- 1. Robust Image Validation ---
          if (!values.image || values.image.length === 0 || !values.image[0].originFileObj) {
              message.error("Please ensure a valid book cover image has been uploaded.");
              setIsSubmitting(false);
              return;
          }

          // --- 2. Input Data Cleaning and Validation Check ---
          // Ant Design Form rules should handle most validation, but we check for common pitfalls.
          
          // Ensure price and stock are treated as numbers and are not zero/negative 
          // if they were passed as valid form strings.
          const priceValue = Number(values.price);
          const stockValue = Number(values.stock);
          const categoryIdValue = Number(values.categoryId); // Ensure categoryId is a number

          if (priceValue <= 0) {
              message.error("Price must be a positive number.");
              setIsSubmitting(false);
              return;
          }
          
          // Check if important fields might have failed conversion (resulting in NaN)
          if (isNaN(priceValue) || isNaN(stockValue) || isNaN(categoryIdValue)) {
              message.error("Invalid numerical value detected for Price, Stock, or Category.");
              setIsSubmitting(false);
              return;
          }
          
          // --- 3. Prepare FormData Payload ---
          const formData = new FormData();
          const file = values.image[0].originFileObj;

          // Append the image file
          formData.append('coverImage', file, file.name);

          // Prepare book details object with validated/converted numbers
          const bookData = {
              title: values.title,
              author: values.author,
              price: priceValue,       // Use the cleaned number value
              stock: stockValue,       // Use the cleaned number value
              categoryId: categoryIdValue, // Use the cleaned number value
          };

          // Append the book details as a stringified JSON object
          formData.append('data', JSON.stringify(bookData));

          // --- 4. API Call ---
          const response = await axios.post("api/book", formData, {
              headers: {
                  'Authorization': `Bearer ${token}`,
              }
          });

          console.log("Book Data Submitted:", response.data);

          // --- 5. Success Handling ---
          form.resetFields();
          handleAddBookModalClose();
          message.success('Book added successfully!');

      } catch (err) {
          // --- 6. Improved Error Handling ---
          console.error("Failed to add book:", err);
          
          // Attempt to extract and display detailed validation messages
          let errorMessage = 'Failed to add book.';
          const serverMessages = err.response?.data?.message;

          if (Array.isArray(serverMessages)) {
              // Join the array of validation errors into a single readable string
              errorMessage = `Validation Errors: ${serverMessages.join(', ')}`;
          } else if (err.response?.data?.message) {
              errorMessage = `Error: ${err.response.data.message}`;
          } else {
              errorMessage = err.message;
          }

          message.error(errorMessage);
      } finally {
          // --- 7. Cleanup ---
          setIsSubmitting(false);
      }
  }

  return (
    <>
      <NavBar 
        isAuthenticated = {isAuthenticated} 
        onLogout={handleLogout} 
        showAddBookModal={showAddBookModal}
        onSearch={(value) => setSearchKeyword(value)}
        onOpenSearch={showSearchModal}
      />

      <Modal
        title="Search Books"
        open={isSearchModalVisible}
        onCancel={handleSearchModalClose}
        footer={null} // ไม่เอาปุ่ม OK/Cancel ด้านล่าง
        centered
      >
        <Search 
          placeholder="พิมพ์ชื่อหนังสือที่ต้องการค้นหา..." 
          allowClear
          enterButton="Search"
          size="large"
          defaultValue={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} // ค้นหาแบบ Real-time
          onSearch={() => handleSearchModalClose()}
        />
      </Modal>

      <Routes>
          <Route 
            path="/login" 
            element={
              <LoginScreen onLoginSuccess = {handleLoginSuccess} />} 
          />

          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BookScreen onLogout={handleLogout} searchKeyword={searchKeyword} /> 
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="*" 
            element={
              <h2>404 Page Not Found</h2>
            } 
          /> 
      </Routes>

      <AddBook
        isVisible={isAddBookModalVisible}
        onClose={handleAddBookModalClose}
        onBookAdded={handleBookAdded}
        isLoading={isSubmitting}
      />
    </>
  );
}

export default App;