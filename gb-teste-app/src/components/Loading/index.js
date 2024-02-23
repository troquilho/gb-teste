import React from "react";

const Loading = ({ show }) => {
    return (
        <div className={`loading ${show ? 'open' : ''}`}>
            <div></div>
        </div>
    );
};

export default Loading;