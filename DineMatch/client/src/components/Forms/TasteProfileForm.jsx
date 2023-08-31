import React, { useState } from 'react';
import './Forms.css';
import { useNavigate} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // This gives us access to the Formik library
import Button from '../UI/Button/Button'; 
import FormLayout from '../UI/Card/FormLayout';


const CustomCheckbox = ({ field, option }) => { // This function is creating checkboxes for each food cuisine option. Our checkboxes look like circles due to the CSS styling.
    return (
        <button 
            type="button"
            className={`optionButton ${field.value.includes(option) ? 'selected' : ''}`} // This is a ternary operator that checks if the checkbox is checked. If it is, then it will add the 'selected' class to the checkbox. If not, then it will not add the 'selected' class. We do this so we can toggle the color of the checkbox's.
            onClick={() => { // When the checkbox is clicked, this function will run.
                // Check if the checkbox is already checked.
                if (field.value.includes(option)) {
                // If checked, then remove it from the array.
                const nextValue = field.value.filter((value) => value !== option); // This is a filter function that will remove the option from the array if it is already checked.
                field.onChange({ target: { value: nextValue, name: field.name } }); 
                } else { 
                // If not checked, then add it to the array.
                const nextValue = field.value.concat(option); // This is a concat function that will add the option to the array if it is not already checked.
                field.onChange({ target: { value: nextValue, name: field.name } }); // This is a function that will update the value of the checkbox.
                
            }
        }}
        >
        {option} {/* This is the text that will be displayed next to the checkbox.  */}
        </button>
    );
    };

const TasteProfileForm = () => {

        const [isTouched, setIsTouched] = useState(false); // This is a state that will check if the form has been touched. This will help us with the validatio of the forms so the user cannot submit the form without filling it out.

        const navigate = useNavigate();

        const initialValues = { // This is an object that will hold the initial values of the form. This is a Formik requirement that we must pass into the Formik component in our return statement.
                selectedOptions: [], // This is an array that will hold the values of the checkboxes that are checked.
                priceRange: '', // This is a string that will hold the value of the price range that is selected.     
            }
            
                const handleSubmit = (values, actions) => { // This is a function that will run when the form is submitted.
                    actions.setSubmitting(false);
                    
                    const updatedData = {// This is an object that will hold the values of the form. We are passing in the values of the form into this object.
                        priceRange: values.priceRange, 
                        selectedOptions: values.selectedOptions,
                    }
                    
                    const baseURL = import.meta.env.VITE_BASE_URL;
                    let route= `updateUserData`
                    let endpoint = `${baseURL}/${route}`
                    let options = {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(updatedData),
                                credentials: "include",
                            };
                    fetch(endpoint, options)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Something went wrong, Could not update TasteProfile.");
                            }
                            return response.json();
                        })
                        .then((data) => {
                            // console.log(data);
                            navigate('/Discover'); 
                        actions.resetForm({ // This is a function that will reset the form to its initial values (blank) after submission.
                        values: {
                            selectedOptions: [],
                            priceRange: '', 
                        },
                    });
                        })
                        .catch((err) => {
                            console.log("Cannot PUT data to server", err);
                        });
                }
                
                const handleChange = (values) => { // This is a function that will run when the form is changed (input is clicked into). Its purpose is to check if the form has been touched which we are using to help us with the validation of the form.
                    setIsTouched(true); 
                    
                }
                
            
                const validate = (values) => { // This function is allowing us to validate the form. We are checking if the user has selected at least 3 checkboxes and if they have selected a price range before they are allowed to submit the form.
                    let errors = {}; // This is an object that will hold the errors of the form.
                    if (!values.priceRange) { // This is a check to see if the user has selected a price range.
                        errors.priceRange = "Required";
                    }
                    if (!values.selectedOptions || values.selectedOptions.length < 3) { // This is a check to see if the user has selected at least 3 checkboxes.
                        errors.selectedOptions = "Please select at least 3 options";
                    }
                    return errors; // This is returning the errors object.
                }

    // const options = ["Viatnamese", "Chinese", "Japanese", "Korean", "Thai", "Indian", "Mexican", "Italian", "American", "Mediterranean", "French", "Greek", "Spanish", "Middle Eastern", "African", "Caribbean", "Latin American", "Eastern European", "German", "British", "Irish", "Scandinavian", "Turkish", "Moroccan", "Ethiopian", "BBQ", "Vegan"];
    const options = ["Vietnamese", "Chinese", "Japanese", "Korean", "Thai", "Indian", "Mexican", "Italian", "American", "Mediterranean", "French", "Greek", "Spanish", "Middle Eastern", "African", "Caribbean", "Latin American", "Eastern European", "German", "British", "Irish", "Scandinavian", "Turkish", "Moroccan", "Ethiopian", "BBQ", "Vegan", "Pizza", "Burgers", "Seafood", "Sushi", "Steakhouse", "Vegetarian", "Gluten-Free", "Cafe", "Deli", "Bakery", "Ice Cream", "Desserts", "Barbecue", "Food Trucks", "Food Stalls", "Buffets", "Fine Dining", "Brunch",  "Food Court", "Pub Food", "Wine Bars", "Cocktail Bars", "Breweries", "Craft Beer", "Sports Bars", "Juice Bars", "Smoothies", "Coffee Shops", "Tea Rooms", "Bubble Tea", "Breakfast", "Lunch", "Dinner", "Late-Night Eats", "Family-Friendly", "Fast Food", "Casual Dining", "Outdoor Seating", "Romantic", "Group Dining", "Pet-Friendly", "Vegetarian-Friendly", "Vegan-Friendly", "Gluten-Free Options", "Halal", "Kosher", "Farm-to-Table", "Organic", "Locally Sourced", "Food Festivals"];
    
    return (
        <>
            <FormLayout>
            <div className='formBG'>
                    <div className='formHeader'>
                        <h1>Taste Profile</h1>
                    </div>
                <div className='form'>
                    <Formik // This is a Formik component that will allow us to use Formik's functions. We must pass in the initial values and onSubmit function into this component for it to work per Formik's requirements. You dont have to pass in validate but it is wise!
                        initialValues={initialValues} 
                        validate={validate}
                        onSubmit={handleSubmit}
                        validateOnMount={true} // This is a Formik function that will allow us to validate the form on mount (when the page loads). This is useful for when we want to disable the submit button until the form is valid.
                    >
                    {({ isValid, values, }) => ( 
                    <Form onChange={() => handleChange(values) }> 
                        <label>
                            Pick at least 3 cuisines you like:
                        </label>
                        <div className="optionsContainer">
                            {options.map(option => ( // This is a map function that will create a checkbox for each option in the options array.
                            <div key={option}>  
                                <Field name="selectedOptions" value={option} component={CustomCheckbox} option={option} /> {/* This is a Field component that will create a checkbox for each option in the options array. Feild is a Formik component https://formik.org/docs/api/field  */}
                                <ErrorMessage 
                                    name="selectedOptions" // This is the name of the Field component that we are checking for errors.
                                    component="div" // This is what we will wrap the error message in if we want to display it to the user.
                                    className='errorForm' // This is a class that we can use to style the error message.
                                />
                            </div>
                            ))}
                        </div>
                        <label>
                            Price Range:
                            <Field
                                name="priceRange"
                                as="select"
                                className='formInput'
                            >
                                <option value="">Select a price range</option>
                                <option value="1">$</option>
                                <option value="2">$$</option>
                                <option value="3">$$$</option>
                                <option value="4">$$$$</option>
                            </Field>
                            <ErrorMessage
                                name="priceRange"
                                component="div"
                                className='errorForm'
                            />
                            
                        </label>
                        <div className='tasteProfileButton'>
                            <Button  disabled={!isValid} type="submit"> Submit </Button> {/* This our custom Button component. We are disabling the button if the form is not valid or if the form has not been touched so that the user cannot submit it until it is correct. */}
                        </div>
                    </Form>
                    )}
                    </Formik>
                </div>
            </div>
            </FormLayout>
        </>
    );
}

export default TasteProfileForm;