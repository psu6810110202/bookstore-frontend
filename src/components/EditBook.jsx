import { Button, Form, Select, Input, InputNumber, Image, Modal } from 'antd';
import React, { useEffect } from 'react';

const { useForm } = Form;

export default function EditBook(props) {

    const [form] = useForm();
    const { isOpen, item, categories, onBookUpdated, onCancel } = props;

    const currentCoverUrl = item?.coverUrl; 
    const fullImageUrl = currentCoverUrl ? `http://localhost:3080/${currentCoverUrl}` : null;

    useEffect(() => {
        if (isOpen && item) { 
            form.setFieldsValue(item);
        } 
        else if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen, item, form]);

    const onFinish = (values) => {
        props.onBookUpdated(values);
    };

    return(
        <Form layout="vertical" onFinish={onFinish}>
            <h2>Edit Book</h2>

            <Form.Item> 
                <Image src={fullImageUrl} height={100} alt="Current Book Cover"/>
            </Form.Item>

            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input/>
            </Form.Item>
            
            <Form.Item name="author" label="Author" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber/>
            </Form.Item>
            
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                <InputNumber/>
            </Form.Item>
            
            <Form.Item name="categoryId" label="Category" rules={[{required: true}]}>
                <Select allowClear style={{width:"150px"}} options={categories}/>
            </Form.Item>
            
            <Form.Item
                wrapperCol={{ 
                    span: 24, 
                    style: { textAlign: 'right' }
                }} style={{ marginBottom: 0 }}>

                <Button type="default" onClick={onCancel} style={{marginRight: 8}}>Cancel</Button>
                <Button type="primary" htmlType="submit">save</Button>
            </Form.Item>
        </Form>
    )
}