import { useState, useEffect } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/login"

const USER_KEY = 'last_username';
const REMEMBER_ME_KEY = 'remember_me_status';

export default function LoginScreen(props) {

  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  const navigate = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
        const lastUsername = localStorage.getItem(USER_KEY);
        const rememberStatus = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

        if (lastUsername && rememberStatus) {
            form.setFieldsValue({
                username: lastUsername,
                remember: true,
            });
        }
  }, [form]);

  const handleLogin = async (formData) => {
    const { username, password, remember } = formData;
    try {
      setIsLoading(true)
      setErrMsg(null)

      const response = await axios.post(URL_AUTH, { username, password })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      props.onLoginSuccess(token);

      if (remember) {
        // บันทึก Username และสถานะ
        localStorage.setItem(USER_KEY, username);
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        // ถ้าไม่เลือก ให้ลบข้อมูลเก่าออก
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error("Login Error:", err)
      setErrMsg(err.message)
    } finally { 
        setIsLoading(false) }
  }

  return (
    <Form
      form={form}
      onFinish={handleLogin}
      autoComplete="off"
      style={{ maxWidth: 300 }}
    >

      {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true },]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember Me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit" 
          loading={isLoading}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}