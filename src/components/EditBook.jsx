import { Form, Select, Input, InputNumber, Image, Modal } from 'antd';
import React, { useEffect } from 'react';

const { useForm } = Form;

export default function EditBook(props) {
    const [form] = useForm(); // สร้าง form instance
    const { isOpen, item, categories, onBookUpdated, onCancel } = props;

    const currentCoverUrl = item?.coverUrl; 
    const fullImageUrl = currentCoverUrl ? `http://localhost:3080/${currentCoverUrl}` : null;

    useEffect(() => {
        if (isOpen && item) { 
            form.setFieldsValue(item); 
        }
    }, [isOpen, item, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                onBookUpdated({ ...item, ...values });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Edit Book"
            open={isOpen} // ใช้สถานะการเปิดจาก props
            onCancel={onCancel}
            onOk={handleOk} // เมื่อกด Save ให้เรียก handleOk
            okText="Save"
            cancelText="Cancel"
            destroyOnHidden
        >
            <Form 
                form={form}
                layout="vertical"
            >
                <Form.Item style={{ textAlign: 'center' }}> 
                    <Image src={fullImageUrl} height={100} alt="Current Book Cover" fallback="https://via.placeholder.com/100?text=No+Image" />
                </Form.Item>

                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title' }]}>
                    <Input />
                </Form.Item>
                
                <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter author' }]}>
                    <Input />
                </Form.Item>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item 
                        name="price" 
                        label="Price" 
                        style={{ flex: 1 }}
                        rules={[
                            { required: true, message: 'Please input the price!' },
                            { type: 'number', min: 0, message: 'Price >= 0' },
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
                
                <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select category' }]}>
                    <Select allowClear options={categories} />
                </Form.Item>
            </Form>
        </Modal>
    );
}