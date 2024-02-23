import React, { Component } from "react";
import { Col, Card, Button, ButtonGroup, Dropdown } from "react-bootstrap";

export class CardList extends Component {
    render() {
        const { page = 1, pages = 1, data, onChangePage } = this.props;
        const countItems = data?.length || 0;

        return (
            <Card
                className="border-0 mb-2"
                style={{ background: "transparent" }}
            >
                <Card.Body>{this.props.children}</Card.Body>
                {page > 0 && (
                    <Card.Footer
                        className="border-0 d-flex align-items-center justify-content-between"
                        style={{ background: "transparent" }}
                    >
                        <p className="text-muted m-0 small">
                            <span className="d-inline-block d-md-inline">
                                Página {page} de {pages}.
                            </span>
                            <span className="d-block d-md-inline">
                                {" "}
                                Mostrando {countItems}{" "}
                                {countItems === 1 ? "item" : "itens"}.
                            </span>
                        </p>
                        <ButtonGroup aria-label="Pagination">
                            <Button
                                className={"btn-pagination"}
                                disabled={page === 1}
                                onClick={() => onChangePage(page - 1)}
                            >
                                Anterior
                            </Button>
                            <Button
                                className={"btn-pagination"}
                                disabled={page === pages}
                                onClick={() => onChangePage(page + 1)}
                            >
                                Próxima
                            </Button>
                        </ButtonGroup>
                    </Card.Footer>
                )}
            </Card>
        );
    }
}

export class CardListHeader extends Component {
    render() {
        return (
            <Card
                className={
                    "d-none d-lg-flex border-bottom border-top-0 border-end-0 border-start-0 rounded mb-1 " +
                    this.props.className
                }
            >
                <Card.Body className="p-3">{this.props.children}</Card.Body>
            </Card>
        );
    }
}

export class CardListHeaderItem extends Component {
    render() {
        const {
            xs = "12",
            sm = "12",
            md = "12",
            lg = "12",
            className = "",
        } = this.props;

        return (
            <Col
                xs={xs}
                sm={sm}
                md={md}
                lg={lg}
                className={
                    className + " color-dark-gray text-uppercase font-semi-bold"
                }
            >
                {this.props.children}
            </Col>
        );
    }
}

export class CardListHeaderSortItem extends Component {
    render() {
        const {
            xs = "12",
            sm = "12",
            md = "12",
            lg = "12",
            className = "",
            onSort,
            sortKey,
            children,
        } = this.props;

        const handleClick = () => {
            if (onSort && sortKey) {
                onSort(sortKey);
            }
        };

        return (
            <Col
                xs={xs}
                sm={sm}
                md={md}
                lg={lg}
                className={
                    className +
                    " d-flex align-items-center card-list-header-sort color-dark-gray text-uppercase font-semi-bold"
                }
            >
                {children}
                {onSort && (
                    <span
                        className="material-icons c-pointer"
                        onClick={handleClick}
                    >
                        swap_vert
                    </span>
                )}
            </Col>
        );
    }
}

export class CardListBody extends Component {
    render() {
        return (
            <Card className="border-bottom-0 border-top-0 border-end-0 border-start-0 rounded-0 mb-1 card-data">
                <Card.Body className="p-3">{this.props.children}</Card.Body>
            </Card>
        );
    }
}

export class CardListBodyItem extends Component {
    render() {
        const {
            xs = "12",
            sm = "12",
            md = "12",
            lg = "12",
            className = "",
            title = "",
            value = "",
            style = {},
        } = this.props;

        return (
            <Col
                xs={xs}
                sm={sm}
                md={md}
                lg={lg}
                className={className}
                style={style}
            >
                <span className="d-inline-flex d-lg-none text-primary me-2">
                    {title}
                </span>
                {value}
            </Col>
        );
    }
}

export class CardListBodyItemOptions extends Component {
    render() {
        const {
            xs = "12",
            sm = "12",
            md = "12",
            lg = "12",
            className = "",
        } = this.props;

        return (
            <Col xs={xs} sm={sm} md={md} lg={lg} className={className}>
                <Dropdown drop={"left"}>
                    <Dropdown.Toggle
                        variant="muted"
                        id="dropdown-basic"
                        className="p-0 text-muted"
                        style={{ lineHeight: 0 }}
                    >
                        <span className="material-icons">settings</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>{this.props.children}</Dropdown.Menu>
                </Dropdown>
            </Col>
        );
    }
}
