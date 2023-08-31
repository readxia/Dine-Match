import React, { useEffect, useState } from 'react';
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import FormLayout from './Card/FormLayout';
import AlertSnackbar from '../Forms/AlertSnackbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formFields, states } from '../../helper';
import useShowPassword  from '../Hooks/useShowPassword';

const Profile = () => { 

  const [passwordError, setPasswordError] = useState(null); // To hold password error message
  const [newPassword, setNewPassword] = useState('');
  const [serverError, setServerError] = useState(null); // To hold server error message
  const [editMode, setEditMode] = useState(false); // This is a state that will check if the form is in edit mode or not. This will help us toggle between the edit mode and the view mode.
  const [activeField, setActiveField] = useState('');// This is a state that will check which field is active. This will help us toggle between the edit mode and the view mode.
  const [user, setUser] = useState({ // This is a state that will hold the values of the user's profile. We are setting the initial values to empty strings.
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    city: '',
    state: '',
    zip: '',
  });

  const { showPassword, handlePasswordVisibility } = useShowPassword();

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      const route = 'userData';
      const endpoint = `${baseURL}/${route}`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // for passing cookies
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      };
      try {
        const response = await fetch(endpoint, options);
        const data = await response.json();
        
        if (response.ok) {
          setUser(data); // This is a function that will update the user state with the values of the user's profile.
        } else {
          console.log('Server responded with status code', response.status);
        }
      } catch (error) {
        console.error('Exception occurred during fetch:', error);
      }
    };
    fetchData();
  }, []);
  

  if (!user) {
    return <div className={styles.profileError}>
            Unauthorized User. Please return to the homepage and login
            <Link to="/">
            <Button to="/">Home</Button>
            </Link>
            </div>;
  }

  const handleInputChange = (event) => { // This is a function that will update the user state with the values of the form.
    const inputValue = event.target.value;
    
    if (event.target.name === 'password') {
      setNewPassword(inputValue);
    } else if ( event.target.name === 'zip' && inputValue.length > 5) {
      setServerError('Max length of 5 digits');
    } else {
      setUser({
        ...user,
        [event.target.name]: inputValue,
      });
    }
  };

  const toggleEditMode = (field) => { // This is a function that will toggle the edit mode of the form.
    setEditMode(!editMode);
    setActiveField(field);
  };

  const validatePassword = (password) => {
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
    if (!passwordRules.test(password)) {
      // Append a timestamp to the error message
      setPasswordError('Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character');
      setTimeout(() => {
        setPasswordError(null); // Clear the error after a delay
      }, 7000); 
      return false;  // return false if the password doesn't pass the validation
    } else {
      setPasswordError(null);
      return true;  // return true if the password passes the validation
    }
  };


  const handleFieldUpdate = async (field) => {
    if (field === 'password') {
      // Clear any existing error before validation
      setPasswordError(null);
      if (!validatePassword(newPassword)) {
        // If there's a password error, stop the function
        return;
      }
    } else if (field === 'zip') {
      if (!/^\d{5}$/.test(user.zip)) {
        setServerError("Please enter a valid Zipcode (5 digits)");
        setTimeout(() => {
          setServerError(null); // Clear the error after a delay
        }, 5000); // Delay in milliseconds (adjust as needed)
        return;
      }
    } else if (field === 'email') {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
        setServerError("Please enter a valid email address");
        setTimeout(() => {
          setServerError(null); // Clear the error after a delay
        }, 5000); 
        return;
      }
    }
    const route = 'updateUserData';
    const endpoint = `${baseURL}/${route}`;
    const options = { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ [field]: field === 'password' ? newPassword : user[field] }),
    };

    try {
      const response = await fetch(endpoint, options);
  
      if (response.ok) {
        if (response.status === 204) {
          // Update successful, but no response body is expected
          setUser({ ...user }); // Trigger a re-render to reflect the changes
        } else {
          const updatedUser = await response.json();
          setUser(updatedUser);
        }
        setEditMode(false);
        setActiveField('');
        if (field === 'password') setNewPassword('');
      } else {
        const responseData = await response.json();
        console.log('Server responded with status code', response.status);
        setServerError(responseData.error || 'An error occurred');
        setTimeout(() => {
          setServerError(null); // Clear the error after a delay
        }, 5000); 
      }
    } catch (error) {
      console.error('Exception occurred during update:', error);
    }
  };
  

  return (
    <>
      <AlertSnackbar serverError={passwordError || serverError} />
      <h2 className={styles.profileh2}>Profile</h2>
      <FormLayout>
        {formFields.map((field) => (
          <div className={styles.profileField} key={field.name}>
            <label>
              {field.placeholder}:
              {field.type !== 'select' && field.name !== 'password' ? (
                <>
                  {editMode && activeField === field.name ? (
                    <>
                      <input type={field.type} name={field.name} value={user[field.name]} onChange={handleInputChange} />
                      <Button onClick={() => handleFieldUpdate(field.name)}>Save</Button>
                    </>
                  ) : (
                    <>
                      <span>{user[field.name]}</span>
                      <Button onClick={() => toggleEditMode(field.name)}>Edit</Button>
                    </>
                  )}
                </>
              ) : null}
              {field.name === 'state' ? (
                editMode && activeField === field.name ? (
                  <>
                    <select name="state" value={user.state} onChange={handleInputChange}>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    <Button onClick={() => handleFieldUpdate('state')}>Save</Button>
                  </>
                ) : (
                  <>
                    <span>{user.state}</span>
                    <Button onClick={() => toggleEditMode('state')}>Edit</Button>
                  </>
                )
              ) : null}
              {field.name === 'password' ? (
                editMode && activeField === field.name ? (
                  <>
                    <input type={showPassword ? "text" : "password"} name="password" value={newPassword} onChange={handleInputChange} />                
                    <i onClick={handlePasswordVisibility} >
                      {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon /> }
                    </i>
                    <Button onClick={() => handleFieldUpdate('password')}>Save</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => toggleEditMode('password')}>Change Password</Button>
                  </>
                )
              ) : null}
            </label>
          </div>
        ))}
      </FormLayout>
    </>
  );
};
  
  export default Profile;