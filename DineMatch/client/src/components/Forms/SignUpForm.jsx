import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../UI/Button/Button';
import AlertSnackbar from '../Forms/AlertSnackbar';
import FormLayout from '../UI/Card/FormLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import { formFields, states } from '../../helper'
import useShowPassword from '../Hooks/useShowPassword';

const SignUpForm = () => {

    const [serverError, setServerError] = useState(null);

    const [isTouched, setIsTouched] = useState(false);
    
    const navigate = useNavigate(); // This is a hook that allows us to navigate to a different page. We will use this to navigate to the TasteProfile page after the user submits the form.
    
    const { showPassword, handlePasswordVisibility } = useShowPassword();

    const initialValues = ({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        city: "",
        state: "",
        zip: "",
    })

    const validationSchema = Yup.object({
        firstname: Yup.string().required('Required').max(15, 'Must be 15 characters or less'),
        lastname: Yup.string().required('Required').max(20, 'Must be 20 characters or less'),
        email: Yup.string().email('Invalid email address').required('Required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'),
        username: Yup.string().required('Required'),
        password: Yup.string().required('Required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/, 'Password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        zip: Yup.string().required('Required').matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Please enter a valid Zipcde (5 digits)').max(5, `Please enter a valid Zipcode (5 digits)`),
    })


    const handleSubmit = (values, actions) => {
        setServerError(null);
        actions.setSubmitting(false); // this is basically event.preventDefault() in Formik
        const baseURL = import.meta.env.VITE_BASE_URL;
        let route = "userData";
        let endpoint = `${baseURL}/${route}`;
        let options = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            credentials: "include",
            };
            fetch(endpoint, options)
            .then((res) => {
                if (res.ok) {
                return res.json();
                } else {
                return res.json().then((data) => {
                    throw new Error(data.error || "Data not collected. Please try again.");
                });
                }
            })
            .then((data) => {
                navigate("/TasteProfile"); // This will navigate to the TasteProfile page after the form is submitted.
                actions.resetForm(); // this resets the form after it is submitted
            })
            .catch((err) => {
                console.error(err);
                setServerError(err.message);
            });
    };

    const handleChange = (values) => setIsTouched(true);
    
    return(
        <>
            <FormLayout>
                <div className='formHeader'>
                    <h1>Create Account</h1>
                    <h4>Already have an account? <Link to="/Login">Login</Link> </h4>
                </div>
                
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {({ isValid, values }) => (
                        <Form
                            name='signUpForm'
                            onChange={() => handleChange(values)}
                        >
                            <div className='form'>
                            {formFields.map((field) => (
                                <label key={field.name}>
                                    {field.placeholder}:
                                    {field.type !== 'select' ? (
                                    <div className={field.name === "password" ? 'inputWithIcon' : ''}>
                                        <Field
                                            name={field.name}
                                            type={field.name === "password" ? (showPassword ? "text" : "password") : field.type}
                                            placeholder={field.placeholder}
                                            className='formInput'
                                        />
                                        {field.name === "password" && (
                                            <i type="button" onClick={handlePasswordVisibility}>
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </i>
                                        )}
                                    </div>
                            ): (
                                <Field
                                    name={field.name}
                                    as='select'
                                    className='formInput'
                                >
                                    <option value="" label="Select a state" />
                                    {states.map((state) => (
                                        <option key={state.value} value={state.value} label={state.label} />
                                    ))}
                                </Field>
                            )}
                            <ErrorMessage
                                name={field.name}
                                component="div"
                                className='errorForm'
                            />
                        </label>
                    ))}
                                <div>
                                    <Button type="submit" disabled={!isValid || !isTouched} > Sign Up </Button> 
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

export default SignUpForm;