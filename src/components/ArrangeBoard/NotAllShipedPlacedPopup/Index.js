import React from 'react';
import "./NotAllShipedPlacedPopup.css";

const NotAllShipedPlacedPopup = ({ children, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {children}
                <button onClick={onClose} className="modal-close-button">Close</button>
            </div>
        </div>
    );
};

export default NotAllShipedPlacedPopup;
