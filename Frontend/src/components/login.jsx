import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ToastContainer from './ToastContainer';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!username.trim() || !password.trim()) {
            addToast('error', 'All fields are required');
            return;
        }
        try {
            const response = await fetch("http://localhost:5433/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                sessionStorage.setItem("isLoggedIn", true);
                addToast('success', 'Logged in successfully');
                setTimeout(() => window.location.href = "/", 1000);
            } else {
                addToast('error', 'Username or password is incorrect');
            }
        } catch (error) {
            console.error("Error logging in:", error);
            addToast('error', 'An error occurred while logging in');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="flex pt-8">
            <section id="login" className={`flex md:flex-row flex-col`}>
                <div className={`flex-1 flex-col flex `}>
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '40ch' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '2px solid black',
                            borderRadius: '8px',
                            padding: '24px',
                            backgroundColor: 'bg-primary'
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{
                                style: { color: 'black' },
                                classes: {
                                    notchedOutline: 'border-black'
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'black',
                                        },
                                    },
                                }
                            }}
                            sx={{ paddingBottom: '8px'}}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPass(event.target.value)}
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{
                                style: { color: 'black' },
                                classes: {
                                    notchedOutline: 'border-black'
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'black',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'black',
                                        },
                                    },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: 'black' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ paddingBottom: '8px'}}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ 
                                mt: 2, 
                                backgroundColor: '#16161d', 
                                '&:hover': { backgroundColor: '#1C94AC' },
                                padding: '12px 24px',
                            }}
                        >
                            Sign in
                        </Button>
                    </Box>
                </div>
            </section>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default Login;