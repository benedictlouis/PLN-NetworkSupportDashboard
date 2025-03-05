import { useState, useEffect } from "react";
import { navLinks } from "../index.js";
import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ToastContainer from "./toastcontainer";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const [active, setActive] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5433/user/me", {
                    credentials: "include", // Pastikan session dikirim
                });
                if (response.ok) {
                    const userData = await response.json();
                    setIsLoggedIn(true);
                    setUsername(userData.username);
                    setUserRole(userData.userRole);
                } else {
                    setIsLoggedIn(false);
                    setUsername("");
                    setUserRole("");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setIsLoggedIn(false);
                setUsername("");
                setUserRole("");
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5433/user/logout", {
                method: "POST",
                credentials: "include", // Hapus session
            });
            if (response.ok) {
                setIsLoggedIn(false);
                setUsername("");
                setUserRole("");
                addToast("success", "You have been logged out!");
                setTimeout(() => (window.location.href = "/"), 1000);
            } else {
                addToast("error", "Failed to log out. Please try again.");
            }
        } catch (error) {
            console.error("Failed to log out:", error);
            addToast("error", "Failed to log out. Please try again.");
        }
    };

    const updatedNavLinks = isLoggedIn
    ? navLinks
        .map((nav) => (nav.id === "login" ? { ...nav, title: "Log Out" } : nav))
        .filter((nav) =>
            (["Admin", "Super Admin"].includes(userRole) || 
            !["accountManagement", "validation"].includes(nav.id))
        )
    : navLinks.filter((nav) => !["accountManagement", "validation"].includes(nav.id));



    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    return (
        <>
            <Disclosure as="nav">
                <div className="mx-auto max-w-7xl px-2 px-6">
                    <div className="relative flex h-16 items-center justify-center">
                        {/* Logo */}
                        <div className="max-md:hidden absolute inset-y-0 left-0 flex items-center">
                            <a href="/">
                                <span className="text-lg font-bold text-black">DAILY ACTIVITY</span>
                            </a>
                        </div>
    
                        {/* Mobile Logo */}
                        <div className="md:hidden pl-3 absolute inset-y-0 left-0 flex items-center">
                            <a href="/">
                                <span className="text-lg font-bold text-black">DAILY<br />ACTIVITY</span>
                            </a>
                        </div>
    
                        {/* Navigation Links */}
                        <div className="hidden sm:flex flex-1 items-center justify-center max-md:items-end max-md:justify-end">
                            <div className="flex space-x-4">
                                {updatedNavLinks.map((nav) => (
                                    <a
                                        key={nav.id}
                                        href={nav.id === "login" && isLoggedIn ? "#" : `/${nav.id}`} 
                                        className={classNames(
                                            nav.title === "Log In" ? "hover:bg-green-500" : "hover:bg-[#1C94AC]",
                                            nav.title === "Log Out" ? "hover:bg-red-500" : "hover:bg-[#1C94AC]",
                                            "text-black bg-[#f9f9f9] rounded-3xl px-6 py-2 text-sm max-md:px-4 font-medium transition ease-in duration-150 shadow"
                                        )}
                                        onClick={(e) => {
                                            if (nav.id === "login" && isLoggedIn) {
                                                e.preventDefault(); // Mencegah redirect jika logout
                                                handleLogout();
                                            }
                                        }}
                                    >
                                        {nav.title}
                                    </a>
                                ))}
                            </div>
                        </div>
    
                        {/* Mobile Menu Button */}
                        <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                            <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-transparent hover:bg-gray-350 hover:text-black">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            </Disclosure.Button>
                        </div>
    
                        {/* Welcome Message */}
                        {isLoggedIn && username && (
                            <span className="max-md:hidden -ml-28 text-sm font-medium text-black">
                                Welcome, {username}!
                            </span>
                        )}
                    </div>
                </div>
    
                {/* Mobile Navigation Links */}
                <Disclosure.Panel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {updatedNavLinks.map((nav) => (
                            <Disclosure.Button
                                key={nav.id}
                                as="a"
                                href={nav.id === "login" && isLoggedIn ? "#" : `/${nav.id}`} 
                                className={classNames(
                                    active === nav.id
                                        ? "bg-gradient text-white"
                                        : "text-black bg-[#f9f9f9] hover:bg-gray-300 hover:text-black",
                                    "rounded-3xl px-6 py-2 text-sm font-medium transition ease-in duration-150 shadow-inner"
                                )}
                                onClick={(e) => {
                                    setActive(nav.id);
                                    if (nav.id === "login" && isLoggedIn) {
                                        e.preventDefault(); // Mencegah redirect jika logout
                                        handleLogout();
                                    }
                                }}
                            >
                                {nav.title}
                            </Disclosure.Button>
                        ))}
                    </div>
                </Disclosure.Panel>
            </Disclosure>
    
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );    
}