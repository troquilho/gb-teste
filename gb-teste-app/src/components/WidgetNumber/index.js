import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

export default class WidgetNumber extends Component {
    render() {
        return (
            <Link to={this.props.link} className={"widget-number-link"}>
                <Card className="widget-number">
                    <Card.Body>
                        <Row>
                            <Col
                                xs={3}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <span className="material-icons">
                                    {this.props.icon}
                                </span>
                            </Col>
                            <Col
                                xs={9}
                                className="d-flex align-items-start flex-column"
                            >
                                <h5
                                    className="d-block fw-bold color-dark-primary"
                                    title={this.props.title}
                                >
                                    {this.props.title}
                                </h5>
                                <h4 className="d-block fw-bold mb-0">
                                    {this.props.value}
                                </h4>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
        );
    }
}
