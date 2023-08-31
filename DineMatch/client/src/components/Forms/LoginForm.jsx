import React, { useState } from 'react';
import './Forms.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import Button from '../UI/Button/Button';
import AlertSnackbar from './AlertSnackbar';
import FormLayout from '../UI/Card/FormLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PopUp from '../PopUp';
import useShowPassword from '../Hooks/useShowPassword';


const LoginForm = () => {
    const { showPassword, handlePasswordVisibility } = useShowPassword();

    const [serverError, setServerError] = useState(null);
    const [isTouched, setIsTouched] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);

    
    const baseURL = import.meta.env.VITE_BASE_URL;


    const initialValues = ({
        username: "",
        password: "",
    })


    const handleSubmit = async (values, actions) => {
        setServerError(null); // This is a state that will hold the server error message. we want to to be null after the user submits the form so if they click the buttom again, the error message will show up again.
        actions.setSubmitting(false);
        const route = 'login';
        const endpoint = `${baseURL}/${route}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include',
            };
        
            try {
                const response = await fetch(endpoint, options);
        
                if (!response.ok) {
                    throw new Error('Login Denied. Please check your username and password and try again.');
                }
            
                console.log('Login successful');
                setShowPopUp(true);
                actions.resetForm();
            } catch (error) {
                console.log('Cannot POST data to server', error);
                setServerError(error.message);
            }
        };
    
    

    const handleChange = (values) => {
        setIsTouched(true);
    }
    

    const validate = (values) => {
        let errors = {};
        if (!values.username) {
            errors.username = "Required";
        }
        if (!values.password) {
            errors.password = "Required";
        }
        return errors;
    }

    return(
        <>
            {showPopUp && <PopUp />}
            <FormLayout >
                        <div className='formHeader'></div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validate={validate}
                        >
                            {({ isValid }) => (
                                <Form onChange={handleChange}>
                                    <div className='form'>
                                        <label>
                                            Username:
                                            <Field
                                                name="username"
                                                type="text"
                                                placeholder=" Username"
                                                className='formInput'
                                            />
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className='errorForm'
                                            />
                                        </label>
                                        <label>
                                            Password:
                                            <div className='inputWithIcon'>
                                            <Field
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder=" Password"
                                                className='formInput'
                                            />
                                            <i onClick={handlePasswordVisibility} >
                                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon /> }
                                            </i>
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className='errorForm'
                                            />
                                        </label>
                                        <p>
                                            Don't have an account?<Link to="/SignUp">Sign up here!</Link>
                                        </p>
                                        
                                        <div>
                                            <Button type="submit" disabled={!isValid || !isTouched} > Login </Button> 
                                        </div>
                                    </div>
                                </Form>
                                )}
                        </Formik>
                        <AlertSnackbar serverError={serverError}/>
            </FormLayout>
        </>
    )

}

export default LoginForm;``