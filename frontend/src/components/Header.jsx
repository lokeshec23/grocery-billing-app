import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faCog,
  faClipboardList,
  faChartBar,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { state, dispatch } = useContext(UserContext);
  const { user } = state;

  const logoutHandler = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Grocery Billing</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* Conditional rendering for different roles */}
              {user && user.role === "staff" && (
                <LinkContainer to="/billing">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faShoppingCart} /> Billing
                  </Nav.Link>
                </LinkContainer>
              )}
              {user && user.role === "admin" && (
                <>
                  <LinkContainer to="/products">
                    <Nav.Link>
                      <FontAwesomeIcon icon={faCog} /> Products
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/inventory">
                    <Nav.Link>
                      <FontAwesomeIcon icon={faClipboardList} /> Inventory
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/sales-report">
                    <Nav.Link>
                      <FontAwesomeIcon icon={faChartBar} /> Sales
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {user && user.role === "customer" && (
                <LinkContainer to="/my-orders">
                  <Nav.Link>My Orders</Nav.Link>
                </LinkContainer>
              )}

              {user ? (
                <NavDropdown
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} /> {user.name}
                    </span>
                  }
                  id="username"
                >
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FontAwesomeIcon icon={faUser} /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
