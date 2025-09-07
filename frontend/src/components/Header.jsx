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
  faStore,
  faTruck,
  faFileInvoiceDollar,
  faTag,
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
              {user && user.role === "staff" && user.role === "customer" && (
                <LinkContainer to="/catalog">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faStore} /> Shop
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && user.role === "staff" && (
                <LinkContainer to="/billing">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faShoppingCart} /> Billing
                  </Nav.Link>
                </LinkContainer>
              )}
              {user && user.role === "admin" && (
                <>
                  <NavDropdown
                    title={
                      <span>
                        <FontAwesomeIcon icon={faCog} /> Admin
                      </span>
                    }
                    id="admin-dropdown"
                  >
                    <LinkContainer to="/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/inventory">
                      <NavDropdown.Item>Inventory</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/sales-report">
                      <NavDropdown.Item>Sales Report</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/admin/suppliers">
                      <NavDropdown.Item>Suppliers</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/purchases">
                      <NavDropdown.Item>Record Purchase</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/discounts">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon={faTag} /> Discounts
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
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
