import React from "react";
import { Modal, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { ButtonPrimary } from "../Buttons";

function CustomModal({
    show,
    onHide,
    title,
    children,
    submitLabel = "Salvar",
    onSubmit,
    errorMessage,
    buttonCanBeDisabled = false,
    buttonWithoutLength = false,
}) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            style={{ display: (show && !onHide ? "block" : "none") }}
        >
            <Modal.Header
                className="border-0 p-4 d-flex align-items-center bg-color-light-gray"
                closeButton
            >
                <Modal.Title className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-start justify-content-center flex-column ml-3">
                        <h5 className="mb-0 fw-bold color-dark-gray">
                            {title}
                        </h5>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        {children}
                        {errorMessage !== "" && (
                            <Row>
                                <Col
                                    xs={12}
                                    className="d-flex justify-content-center"
                                >
                                    <Alert
                                        variant="danger"
                                        className="mb-0 text-center small w-auto"
                                    >
                                        {errorMessage}
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col
                                xs={12}
                                className="d-flex justify-content-center"
                            >
                                {!buttonWithoutLength ? (
                                    <ButtonPrimary
                                        type="submit"
                                        btnText={submitLabel}
                                        className="mt-2"
                                        disabled={
                                            buttonCanBeDisabled &&
                                            errorMessage !== ""
                                        }
                                    />
                                ) : (
                                    <ButtonPrimary
                                        type="submit"
                                        btnText={submitLabel}
                                        className="mt-2"
                                        disabled={buttonCanBeDisabled}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export { CustomModal };
