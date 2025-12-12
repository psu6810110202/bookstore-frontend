import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Button } from 'antd'; 

function NavBar({ isAuthenticated, onLogout, showAddBookModal }) {
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login'); 
    };

    const isLoginPage = location.pathname === '/login'; 

    // ** 1. กำหนดสไตล์พื้นฐานสำหรับ Navigation Bar **
    const baseNavStyle = {
        padding: '20px', 
        backgroundColor: '#ffe6b3', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
    };

    // ** 2. สไตล์เมื่อล็อกอินแล้ว (Fixed Header) **
    const loggedInStyle = {
        ...baseNavStyle, // ใช้สไตล์พื้นฐานทั้งหมด
        justifyContent: 'space-between', // ชิดซ้ายและขวา
        position: 'fixed', // ตรึงไว้ด้านบน
        top: '0',
        left: '0',
        zIndex: '100',
    };

    // ** 3. สไตล์เมื่อยังไม่ล็อกอิน และอยู่หน้าอื่น (Not Fixed + Centered) **
    const notLoggedInStyle = {
        ...baseNavStyle, // ใช้สไตล์พื้นฐานทั้งหมด
        // ทำให้ปุ่ม Login อยู่ตรงกลางโดยใช้ justifyContent: 'center'
        justifyContent: 'center', 
        position: 'static', // ไม่อยู่ในตำแหน่ง Fixed (เลื่อนตามปกติ)
        zIndex: 'initial',  
    };

    // เลือกใช้สไตล์ตามสถานะ isAuthenticated
    const currentStyle = isAuthenticated ? loggedInStyle : notLoggedInStyle;


    // *** Logic การแสดงผล ***
    let rightContent = null;
    
    if (isAuthenticated) {
        // Logged In: แสดง New Book และ Logout
        rightContent = (
            <>
                <Button 
                    type="primary"
                    htmlType='button' 
                    style={{ marginRight: '10px' }} 
                    onClick={showAddBookModal} 
                >
                    New Book
                </Button>
                <Button 
                    type="primary" 
                    danger 
                    onClick={handleLogoutClick}
                    style={{ marginRight: '50px' }} 
                >
                    Logout
                </Button>
            </>
        );
    } else if (!isLoginPage) {
        // Not Logged In & Not on Login Page: แสดงปุ่ม Login
        rightContent = (
            <Link to="/login">
                <Button type="primary">
                    Login
                </Button>
            </Link>
        );
    }

    return (
        <nav 
            style={currentStyle} // ใช้สไตล์ที่ถูกเลือก
        >
            {/* ส่วนซ้าย: Book List (จะแสดงเสมอ) */}
            <div style={{ marginRight: isAuthenticated ? '0' : 'auto' }}> 
                <Link to="/" 
                    style={{ 
                        color: '#332200', 
                        textDecoration: 'none', 
                        marginLeft: isAuthenticated ? '50px' : '0', // Margin เฉพาะตอนล็อกอินแล้ว
                        fontSize: '25px',
                    }}
                >
                    Book List
                </Link>
            </div>

            {/* ส่วนขวา: New Book / Logout / Login */}
            <div style={{ marginLeft: isAuthenticated ? '0' : 'auto' }}>
                {rightContent}
            </div>
        </nav>
    );
}

export default NavBar;