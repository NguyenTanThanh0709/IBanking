import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

import BackgroundImage from "../../Assets/background.jpg";
import Logo from "../../Assets/logo.png";
import Logo1 from "../../Assets/logo1.png";
import { login } from "../../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.login);
  const [inputUsername, setInputUsername] = useState("52100841");
  const [inputPassword, setInputPassword] = useState("hashedPassword123");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(1500);
    console.log(`Username :${inputUsername}, Password :${inputPassword}`);

    dispatch(login.loginRequest({ mssv: inputUsername, password: inputPassword }));
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (loginState.isAuthenticated === 1) {
      //alert("Login successful");
      localStorage.setItem('token', loginState.data.token);
      
      localStorage.setItem('_id', loginState.data._id);
      localStorage.setItem('loginState', JSON.stringify(loginState.data));
      navigate('/tuition', { state: { param: 'value' } });
    } else if (loginState.isAuthenticated === 2) {
      setShow(true);
    }else if (loginState.isAuthenticated === 0) {
      setLoading(false);
    }
    setLoading(false);
  }, [loginState.isAuthenticated]);

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex ">
          <img
            className="img-thumbnail mx-auto d-block mb-2"
            src={Logo}
            alt="logo"
          />
          <img
            className="img-thumbnail mx-auto d-block mb-2"
            src={Logo1}
            alt="logo"
          />
        </div>
        <div className="h4 mb-2 text-center text-danger">XIN CHÀO!</div>
        {/* Alert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Mã Số Sinh Viên</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Nhập mã số sinh viên của bạn"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Mật Khẩu</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Nhập mật khẩu của bạn"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Cổng thông tin sinh viên đại học Tôn Đức Thắng | &copy;2024
      </div>
    </div>
  );
};

export default LoginPage;
