import { Button, Form, Select, Input, InputNumber, Modal, Upload, message, Image } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL_CATEGORY = "/api/book-category"

export default function AddBook({ isVisible, onClose, onBookAdded, isLoading }) {
  
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  // สร้าง State สำหรับเก็บ URL ของรูปภาพเพื่อทำ Preview
  const [previewImage, setPreviewImage] = useState(''); 

  const handleChange = (info) => {
  // เมื่อเลือกไฟล์เสร็จ (status อาจเป็น 'uploading' หรือ 'done')
    const file = info.file.originFileObj; // ดึงไฟล์จริงจากเครื่อง
    if (file) {
      const url = URL.createObjectURL(file); // สร้าง URL ชั่วคราว
      setPreviewImage(url); // เก็บลง State เพื่อเอาไป Render
    }
  };

  const generateISBN = () => {
    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return `978-${randomDigits}`;
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      })))
    } catch(err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
      form.setFieldsValue({
        isbn: generateISBN()
      });
    }
  }, [isVisible, form])

  // ฟังก์ชันแปลงไฟล์เป็น Base64 หรือ ObjectURL เพื่อแสดงผล
  const handlePreview = async (file) => {
    if (file.originFileObj) {
        const url = URL.createObjectURL(file.originFileObj);
        setPreviewImage(url);
    }
  };

  const onFinish = (values) => {
    onBookAdded(values, form);
    setPreviewImage(''); // ล้างรูปพรีวิวเมื่อส่งฟอร์มสำเร็จ
  }

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage(''); // ล้างรูปพรีวิวเมื่อปิด Modal
    onClose(); 
  };

  return(
    <Modal
        title="Add New Book"
        open={isVisible} 
        onCancel={handleCancel}
        footer={null}
        width={600}
    >
      <Form 
        form={form}
        layout="vertical"
        onFinish={onFinish}>

        <Form.Item 
          name="isbn" 
          label="ISBN (Auto-generated)" 
          tooltip="เลขนี้ถูกสุ่มขึ้นโดยระบบ"
        >
          <Input disabled style={{ color: '#000', fontWeight: 'bold' }} />
        </Form.Item>

        <Form.Item 
          name="image" 
          label="Book Cover"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList;
          }}
          rules={[{ required: true, message: 'Please upload a cover image' }]}
        >
          <Upload 
            name="bookCover"
            listType="picture-card" // เปลี่ยนเป็น picture-card จะดูสวยกว่าสำหรับรูปภาพ
            maxCount={1}
            onPreview={handlePreview} // ฟังก์ชันเมื่อกดที่รูป
            beforeUpload={(file) => {
              const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
              if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
              }
              
              // สร้าง Preview ทันทีที่เลือกไฟล์
              if (isJpgOrPng && isLt2M) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImage(e.target.result);
                reader.readAsDataURL(file);
              }

              return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
            }}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onRemove={() => setPreviewImage('')} // ลบรูปพรีวิวออกเมื่อกดลบไฟล์
          >
            {/* ถ้ายังไม่มีรูปให้โชว์ปุ่ม Upload ถ้ามีแล้ว (maxCount 1) ปุ่มจะหายไปเอง */}
            {previewImage ? null : (
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            )}
          </Upload>
        </Form.Item>
          
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter book description or summary..." />
        </Form.Item>
        
        <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item 
                name="price" 
                label="Price" 
                style={{ flex: 1 }}
                rules={[
                    { required: true, message: 'Please input the price!' },
                    { type: 'number', min: 1, message: 'Price >= 1' },
                ]}
            >
                <InputNumber style={{ width: '100%' }} prefix="$"/>
            </Form.Item>
            
            <Form.Item 
                name="stock" 
                label="Stock" 
                style={{ flex: 1 }}
                rules={[
                    { required: true, message: 'Please input the stock quantity!' },
                    { type: 'number', min: 0, message: 'Stock >= 0' }
                ]}
            >
                <InputNumber style={{ width: '100%' }}/>
            </Form.Item>
        </div>
        
        <Form.Item name="categoryId" label="Category" rules={[{required: true}]}>
          <Select allowClear style={{width:"100%"}} options={categories}/>
        </Form.Item>
  
        <Form.Item
          wrapperCol={{ 
            span: 24, 
            style: { textAlign: 'right' }
          }} style={{ marginBottom: 0 }}
        >

          <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading} 
              disabled={isLoading}
              style={{ marginRight: 8 }} // จัดระยะห่างปุ่ม
          >
              New Book
          </Button>

          <Button 
            type="default" 
            onClick={handleCancel} 
            style={{marginRight: 8}}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}