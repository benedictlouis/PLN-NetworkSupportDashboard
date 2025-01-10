import { useState, useEffect } from "react";
import { navLinks } from "../index.js";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ToastContainer from "./ToastContainer";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

    const [active, setActive] = useState();
    const [isLogin, setIsLogin] = useState(false);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLogin");
        setIsLogin(loginStatus === "true");
    }, []);

    const updatedNavLinks = isLogin
        ? navLinks.map((nav) =>
            nav.id === "login" ? { ...nav, title: "Log Out" } : nav
        )
        : navLinks.filter((nav) => nav.id !== "DataManagement");

    const handleLogout = () => {
        sessionStorage.setItem("isLogin", "false");
        setIsLogin(false);
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
            <Disclosure as="nav" className="">
                <div className="mx-auto max-w-7xl px-2 px-6">
                    <div className="relative flex h-16 items-center justify-center">
                        {/* Bagian kiri navbar */}
                        <div className="max-md:hidden absolute inset-y-0 left-0 flex items-center">
                            <span className="text-lg font-bold text-black">NETWORK SUPPORT</span>

                        </div>

                        <div className="md:hidden pl-3 absolute inset-y-0 left-0 flex items-center">
                            <span className="text-lg font-bold text-black">NETWORK<br></br>SUPPORT</span>
                        </div>

                        {/* Tombol navigasi di tengah */}
                        <div className="hidden sm:flex flex-1 items-center justify-center max-md:items-end max-md:justify-end">
                            <div className="flex space-x-4">
                                {updatedNavLinks.map((nav) => (
                                    <a
                                        key={nav.id}
                                        href={`/${nav.id}`}
                                        className={classNames(
                                            active === nav.id
                                                ? 'bg-gradient text-white'
                                                : 'text-black bg-[#f9f9f9] hover:bg-gray-300 hover:text-black',
                                            'rounded-3xl px-6 py-2 text-sm font-medium transition ease-in duration-150 shadow-inner',
                                        )}
                                        onClick={() => setActive(nav.id)}
                                    >
                                        {nav.title}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Tombol menu mobile */}
                        <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                            <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-transparent hover:bg-gray-350 hover:text-black">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            </Disclosure.Button>
                        </div>
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
                                onClick={() => setActive(nav.id)}
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
