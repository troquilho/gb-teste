import React from "react";
import { Button } from "react-bootstrap";

function ButtonPrimary({ btnText, type, className, disabled = false }) {
    return (
        <Button type={type} className={className} disabled={disabled}>
            <span className="text-uppercase">{btnText}</span>
        </Button>
    );
}

export { ButtonPrimary };
