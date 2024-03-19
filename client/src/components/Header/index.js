import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { faOutdent } from '@fortawesome/free-solid-svg-icons';
import image from '../../Assets/image.png';
import banner from '../../Assets/banner.png';
import { useDispatch } from 'react-redux';
import { login } from "../../redux/actions";
import { useNavigate } from'react-router-dom';
export default function Header(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClearTokenAndRedirectToLogin = () => {
    dispatch(login.logout()); // Gọi action logout để xóa token
    localStorage.removeItem('token'); // Xóa token khỏi local storage (nếu cần)
    localStorage.removeItem('_id'); // Xóa token khỏi local storage (nếu cần)
    localStorage.removeItem('loginState'); // Xóa token khỏi local storage (nếu cần)

    navigate('/'); // Điều hướng đến trang login
  };

  const { data } = props;


  return (
    <div className='d-flex justify-content-between border-b border-blue-500 '>
      <div className='flex'>
        <img
          style={{ width: '100px', height: '45px', marginRight: '10px' }}
          className='img-thumbnail d-block mb-2'
          src={image}
          alt='logo'
        />
        <img
          style={{ width: '500px', height: '45px' }}
          className='img-thumbnail d-block mb-2'
          src={banner}
          alt='logo'
        />
      </div>
      <div className='flex'>
          <p  className='m-2 fw-bold fs-4 text-blue-800'>{data}</p>
          <FontAwesomeIcon className='m-2 fw-bold fs-3 text-orange-300 cursor-pointer' icon={faHouseUser} />
          <FontAwesomeIcon className='m-2 fw-bold fs-3 text-rose-600 cursor-pointer' onClick={handleClearTokenAndRedirectToLogin} icon={faOutdent} />
      </div>
    </div>
  );
}
