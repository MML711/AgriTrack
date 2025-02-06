import React from "react";
import ReactDom from "react-dom";
import "./modal.scss";

export default function Modal({ onClose, children }) {

  return ReactDom.createPortal(
    <>
      <div className="overlayStyles" onClick={onClose} />
      <div className="modalStyles" >
        <span className="spanStyles" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
