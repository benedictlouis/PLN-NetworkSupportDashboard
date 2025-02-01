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

    const username = sessionStorage.getItem("username");

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");
    }, []);

    const userRole = sessionStorage.getItem("userRole");

    const updatedNavLinks = isLoggedIn
        ? navLinks
            .map((nav) =>
                nav.id === "login" ? { ...nav, title: "Log Out" } : nav
            )
            .filter((nav) => userRole === "Admin" || nav.id !== "accountManagement")
        : navLinks.filter((nav) => nav.id !== "accountManagement");


    const handleLogout = () => {
        sessionStorage.setItem("isLoggedIn", "false");
        // console.log(sessionStorage.getItem("isLoggedIn"));
        addToast("success", "You have been logged out!");
        setTimeout(() => (window.location.href = "/"), 3000);
    };

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
                        <div className="max-md:hidden absolute inset-y-0 left-0 flex items-center">
                            <a href="/">
                                <span className="text-lg font-bold text-black">DAILY ACTIVITY</span>
                            </a>
                        </div>

                        <div className="md:hidden pl-3 absolute inset-y-0 left-0 flex items-center">
                            <a href="/">
                                <span className="text-lg font-bold text-black">DAILY<br></br>ACTIVITY</span>
                            </a>
                        </div>

                        <div className="hidden sm:flex flex-1 items-center justify-center max-md:items-end max-md:justify-end">
                            <div className="flex space-x-4">
                                {updatedNavLinks.map((nav) => (
                                    <a
                                        key={nav.id}
                                        href={`/${nav.id}`}
                                        className={classNames(
                                            nav.title === "Log In" ? 'hover:bg-green-500' : 'hover:bg-[#1C94AC]',
                                            nav.title === "Log Out" ? 'hover:bg-red-500' : 'hover:bg-[#1C94AC]',
                                            'text-black bg-[#f9f9f9] rounded-3xl px-6 py-2 text-sm max-md:px-4 font-medium transition ease-in duration-150 shadow',
                                        )}
                                        onClick={() => {
                                            if (nav.id === "login" && isLoggedIn) {
                                                setActive(nav.id);
                                                handleLogout();
                                            }
                                        }}
                                    >
                                        {nav.title}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                            <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-transparent hover:bg-gray-350 hover:text-black">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            </Disclosure.Button>
                        </div>

                        {/* Username displayed on the right */}
                        {isLoggedIn && username && (
                                    <span className="max-md:hidden -ml-28 text-sm font-medium text-black">
                                        Welcome, {username}!
                                    </span>
                                )}
                    </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {updatedNavLinks.map((nav) => (
                            <Disclosure.Button
                                key={nav.id}
                                as="a"
                                href={`/${nav.id}`}
                                className={classNames(
                                    active === nav.id
                                        ? 'bg-gradient text-white'
                                        : 'text-black bg-[#f9f9f9] hover:bg-gray-300 hover:text-black',
                                    'rounded-3xl px-6 py-2 text-sm font-medium transition ease-in duration-150 shadow-inner',
                                )}
                                onClick={() => {
                                    setActive(nav.id);
                                    if (nav.onClick) nav.onClick(); // Call handleLogout if logout button is clicked
                                }}
                            >
                                {nav.title}
                            </Disclosure.Button>
                        ))}
                    </div>
                </Disclosure.Panel>
            </Disclosure>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}