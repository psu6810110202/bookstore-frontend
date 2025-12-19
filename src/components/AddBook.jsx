import { Button, Form, Select, Input, InputNumber, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL_CATEGORY = "/api/book-category"

export default function AddBook({ isVisible, onClose, onBookAdded, isLoading }) {
  
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      })))
    } catch(err) {
      console.error("Failed to fetch categories:", err);
      // สามารถเพิ่ม message.error เพื่อแจ้งผู้ใช้ถ้าดึง category ไม่ได้
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [isVisible])

  const onFinish = (values) => {
    onBookAdded(values, form)
  }

  const handleCancel = () => {
    form.resetFields();
    onClose(); // ปิด Modal
  };

  return(
    <Modal
        title="Add New Book"
        open={isVisible} 
        onCancel={handleCancel}
        footer={null}
    >
      <Form 
        form={form}
        layout="vertical"
        onFinish={onFinish}>

        <Form.Item 
          name="image" 
          label="Book Cover"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[{ required: true, message: 'Please upload a cover image' }]}
        >
          <Upload 
            name="bookCover"
            listType="picture"
            maxCount={1}
            beforeUpload={(file) => {
              // Logic การตรวจสอบไฟล์ (เช่น ขนาดและประเภท)
              const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
              if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
              }
              return isJpgOrPng && isLt2M;
            }}

            // ให้ฟอร์มจัดการไฟล์ใน client-side
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >

        <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
</Form.Item>
          
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>
          
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item 
            name="price" 
            label="Price" 
            rules={[
              { 
                required: true, 
                message: 'Please input the price!' },
              { 
                type: 'number', 
                min: 1, 
                message: 'Price must be a positive number (>= 1)' 
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>
          
          <Form.Item 
            name="stock" 
            label="Stock" 
            rules={[
              { 
                required: true, 
                message: 'Please input the stock quantity!' 
              },
              { 
                type: 'number', min: 0, 
                message: 'Stock must be a non-negative number' 
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>
          
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