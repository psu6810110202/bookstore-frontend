import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Button, Dropdown, Input } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Search } = Input;

function NavBar({ isAuthenticated, onLogout, showAddBookModal, onSearch }) {
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogoutClick = () => {
        onLogout(); //
        navigate('/login'); 
    };

    const isLoginPage = location.pathname === '/login'; 

    // ** 1. กำหนดสไตล์พื้นฐาน (คงเดิมตามที่คุณต้องการ) **
    const baseNavStyle = {
        padding: '20px', 
        backgroundColor: '#ffe6b3', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
    };

    const loggedInStyle = {
        ...baseNavStyle, 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: '0',
        left: '0',
        zIndex: '100',
    };

    const notLoggedInStyle = {
        ...baseNavStyle, 
        justifyContent: 'center', 
        position: 'static', 
        zIndex: 'initial',  
    };

    const currentStyle = isAuthenticated ? loggedInStyle : notLoggedInStyle;

    // --- ส่วนการตั้งค่ารายการในเมนู Dropdown ---
    const items = [
        {
            key: '0',
            label: (
                <Search 
                    placeholder="Search books..." 
                    allowClear
                    onSearch={onSearch} // ค้นหาเมื่อกด Enter
                    onChange={(e) => onSearch(e.target.value)} // ค้นหาแบบ Real-time
                    style={{ width: 180, padding: '4px 0' }}
                    onClick={(e) => e.stopPropagation()} // ป้องกันเมนูปิดเมื่อคลิกที่ช่องกรอก
                />
            ),
        },
        {
            key: '1',
            label: 'New Book',
            onClick: () => showAddBookModal(), //
        },
        {
            key: '2',
            label: 'Logout',
            danger: true,
            onClick: () => {
                onLogout();
                navigate('/login');
            }, //
        },
    ];

    // --- ส่วนประกอบเนื้อหา (Views) ---

    // เมื่อ Login แล้ว: [ Book List ] ............ [ Hamburger Menu ]
    const LoggedInView = (
        <>
            <div style={{ marginLeft: '50px' }}> 
                <Link to="/" style={{ color: '#332200', textDecoration: 'none', fontSize: '25px', fontWeight: 'bold' }}>
                    Book List
                </Link>
            </div>
            <div style={{ marginRight: '50px' }}>
                <Dropdown 
                    menu={{ items }} 
                    trigger={['click']} 
                    placement="bottomRight"
                >
                    <Button 
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '24px', color: '#332200' }} />} 
                    />
                </Dropdown>
            </div>
        </>
    );

    // เมื่อยังไม่ Login (หน้า Login): [ 📚 Book List 📚 ]
    const LoggedOutView = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            <Link to="/" style={{ color: '#332200', textDecoration: 'none', fontSize: '25px', fontWeight: 'bold' }}>
                Book List
            </Link>
            <span style={{ fontSize: '28px' }}>📚</span>
        </div>
    );

    return (
        <nav style={currentStyle}>
            {isAuthenticated ? LoggedInView : LoggedOutView}
        </nav>
    );
}

export default NavBar;