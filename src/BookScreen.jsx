import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Modal, Button } from 'antd';
import BookList from './components/BookList'
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000"
const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

function BookScreen(props) {

  // State หลัก
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isAdding, setIsAdding] = useState(false);

  // State สำหรับ Edit Modal
  const [selectedBook, setSelectedBook] = useState(null)

  // --- Data Fetching ---
  const fetchBooks = async () => {
    setLoading(true)
    try{
      const response = await axios.get(URL_BOOK)
      setBookData(response.data)
    } catch(err) { console.log(err) }
    finally { setLoading(false)}
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY)
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: Number(cat.id)
      })))
      console.log("Categories loaded with Number values.");
    } catch(err) {console.log(err)}
  }

  // Add
  const handleAddBook = async (book) => {
    setIsAdding(true)
    try{
      await axios.post(URL_BOOK, book)
      fetchBooks()
    } catch(err) { console.log(err)}
    finally {setIsAdding(false)}
  }
  
  // like
  const handleLikeBook = async (bookId) => {
    setLoading(true)
    try{
      await axios.post(`${URL_BOOK}/${bookId}/like`);
      fetchBooks()
    } catch(err) {  console.log(err)} 
    finally {setLoading(false);
    }
  }

  // Delete
  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try{
      await axios.delete(`${URL_BOOK}/${bookId}`);
      fetchBooks()
    } catch(err) {  console.log(err)} 
    finally {setLoading(false);
    }
  }

  // Update
  const handleSelectToEdit = (bookRecord) => {
    setSelectedBook(bookRecord); 
  }
  const updateBook = async (updatedData) => {
    const bookId = selectedBook.id; 

    const { 
        id, 
        category, 
        createdAt, 
        updatedAt, 
        likeCount, 
        ...dataToSend 
    } = updatedData;

    setLoading(true);
      try{
        await axios.patch(`${URL_BOOK}/${bookId}`, dataToSend);
        handleCloseEditModal(); 
        fetchBooks();
      } catch(err) {  console.log(err)} 
      finally {setLoading(false);}
  }

  // Close Modal
  const handleCloseEditModal = () => {
    setSelectedBook(null);
  }

  useEffect(() => {
    fetchCategories()
    fetchBooks()
  }, [])


  useEffect(() => {
    setTotalAmount(bookData.reduce((total, book) => total + (book.price * book.stock), 0))
  }, [bookData])
  
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        <AddBook onBookAdded={handleAddBook} categories={categories} isLoading={isAdding}/>
      </div>
      <Divider>
        My books worth {totalAmount.toLocaleString()} dollars
      </Divider>
      <Spin spinning={loading}>
        <div style={{ width: '100%'}}>
          <BookList 
            data={bookData} 
            onLiked={handleLikeBook}
            onEdited={handleSelectToEdit}
            onDeleted={handleDeleteBook}
          />
        </div>
      </Spin>
      <Modal
        open={!!selectedBook}
        onCancel={handleCloseEditModal}
        footer={null} 
        destroyOnClose={true} 
        width={700}
      >
        {selectedBook && (
          <EditBook
            isOpen={!!selectedBook}
            item={selectedBook} 
            categories={categories}
            onBookUpdated={updateBook}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>
    </>
  )
}

export default BookScreen
