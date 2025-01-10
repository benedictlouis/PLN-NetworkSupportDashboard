import React from 'react';
import Toast from './toast';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

export default ToastContainer;