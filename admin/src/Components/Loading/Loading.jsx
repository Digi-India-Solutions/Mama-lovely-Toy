import React from 'react';
import './Loading.css'; // CSS file for styles

const Loading = () => {
  return (
    <div className="loader-container">
        <div className="loader">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-shadow"></div>
        <div className="loader-shadow"></div>
        <div className="loader-shadow"></div>
        </div>
    </div>
  );
};

export default Loading;
