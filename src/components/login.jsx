import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/login.css';

function Login() {
  useEffect(() => {
    document.title = 'Login';

    return () => {
      document.title = 'Default Title';
    };
  }, []);
  const navigate = useNavigate();
  const [login, setLoginData] = useState([]);
  const [credentials, setCredentials] = useState({
    companyName: '',
    userName: '',
    password: '',
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:9000/api/login')
      .then((response) => {
        console.log('Data received:', response.data);
        setLoginData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Handle Login called');
    console.log('Credentials:', credentials);

    axios.post('http://localhost:9000/api/login', credentials)
      .then((response) => {
        console.log('API Response:', response.data);

        if (response.data.success) {
          console.log('Login successful');
          navigate('/dashboard');
        } else {
          console.error('Login failed:', response.data.message);
          setErrorMessage(response.data.message);
          setShowErrorModal(true);
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className='login-page-main'>
      <div className="container mt-4">
        {login.map((item) => (
          <div key={item._id}>
            <div className="login-page">
              <div className="log-in-main">
                <div className="log-in-main-div1">
                  <img className="login-robo-img" src={`data:image/jpg;base64, ${item.bot_img}`} alt="banner_img" />
                </div>
                <div className="log-in-main-div2">
                  <div className="welcome-back-div">
                    <p>{item.welcome_text}</p>
                  </div>
                  <form className="login-form" onSubmit={handleLogin}>
                    <div>
                      <img src={`data:image/jpg;base64, ${item.building_icon}`} alt="banner_img" />
                      <input
                        type="text"
                        placeholder="Company Name"
                        name="companyName"
                        value={credentials.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <img src={`data:image/jpg;base64, ${item.person_icon}`} alt="banner_img" />
                      <input
                        type="text"
                        placeholder="User Name"
                        name="userName"
                        value={credentials.userName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <img src={`data:image/jpg;base64, ${item.pwd_icon}`} alt="banner_img" />
                      <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="login-submit-button">
                      <input type="button" value={item.login} onClick={handleLogin}></input>
                      {showErrorModal && (
                        <div className="modal">
                          <div className="modal-content">
                            <span className="close" onClick={closeErrorModal}>&times;</span>
                            <p className='error-message'>{errorMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                  <a className="forgot-pws" href="/">{item.forgot_pwd}</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Login;
