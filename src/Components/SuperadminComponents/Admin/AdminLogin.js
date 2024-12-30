import React, { useState } from 'react';
import './AdminLogin.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios'; // Importing axios

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // To display login error messages

  const handleLogin = async () => {
    // Clear previous error message
    setErrorMessage('');

    try {
      // Send login request to backend API
      const response = await axios.post('https://api/v1.0/login', {
        username,
        password,
      });

      // Check if login was successful (adjust response structure as needed)
      if (response.data.success) {
        const authToken = response.data.token; // Assuming the token is returned in the response
        onLogin(authToken); // Pass the token to the parent handler
        console.log('Login successful:', { username, password });
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Admin Login</h2>
        <div className="login-form">
          <label>Username</label>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>

          <label>Password</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

          <button onClick={handleLogin} className="login-button">
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;









































// import React, { useState } from 'react';
// import './AdminLogin.css';
// import { FaUser, FaLock } from 'react-icons/fa';

// function AdminLogin({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Simulate login success with dummy data
//     const dummyAuthToken = 'dummy-auth-token';
//     onLogin(dummyAuthToken); // Pass the dummy token to the parent handler
//     console.log('Login successful:', { username, password });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2 className="login-title">Admin Login</h2>
//         <div className="login-form">
//           <label>Username</label>
//           <div className="input-container">
//             <FaUser className="input-icon" />
//             <input
//               type="text"
//               placeholder="Enter your username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="login-input"
//             />
//           </div>

//           <label>Password</label>
//           <div className="input-container">
//             <FaLock className="input-icon" />
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="login-input"
//             />
//           </div>

//           <button onClick={handleLogin} className="login-button">
//             LOGIN
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;










































