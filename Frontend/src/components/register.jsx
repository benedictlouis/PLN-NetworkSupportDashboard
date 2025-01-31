import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import ToastContainer from './toastcontainer';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [role, setRole] = useState("Admin");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toasts, setToasts] = useState([]);

    const userRole = sessionStorage.getItem("userRole");

    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        if (!username.trim() || !password.trim()) {
            addToast('error', 'All fields are required');
            return;
        }
        if (password !== confirmPass) {
            addToast('error', 'Password does not match');
            return;
        }
        try {
            const response = await fetch("http://localhost:5433/user/create-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password, role }),
            });
            const data = await response.json();
            if (response.ok) {
                addToast('success', 'Account registered successfully');
                setTimeout(() => window.location.href = "/accountManagement", 1000);
            } else {
                addToast('error', 'Cannot use the username or password');
            }
        } catch (error) {
            console.error("Error signing up:", error);
            addToast('error', 'An error occurred while signing up');
        }
    };

    return (
        <div className="flex pt-8">
            <section id="register" className={`flex md:flex-row flex-col`}>
                <div className={`flex-1 flex-col flex `}>
                    <Box
                        component="form"
                        onSubmit={handleRegister}
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
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPass(event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            id="confirm-password"
                            label="Confirm Password"
                            variant="outlined"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPass}
                            onChange={(event) => setConfirmPass(event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            id="role"
                            select
                            label="Role"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Support">Support</MenuItem>
                        </TextField>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: '#16161d',
                                '&:hover': { backgroundColor: '#1C94AC' },
                                padding: '12px 24px',
                            }}>
                            Sign up
                        </Button>
                    </Box>
                </div>
            </section>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default Register;