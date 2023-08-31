import { useState } from 'react';

const useShowPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return { showPassword, handlePasswordVisibility };
};

export default useShowPassword;
