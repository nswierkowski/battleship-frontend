import React from 'react';
import "./ModulPopup.css";

const ModulPopup = ({ children, onClose, buttonName }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {children}
                <button onClick={onClose} className="modal-close-button">{buttonName}</button>
            </div>
        </div>
    );
};

export default ModulPopup;
