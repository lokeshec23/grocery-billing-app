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
  faUserTie,
  faBoxesStacked, // for inventory
  faBoxOpen, // for products
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { state, dispatch } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to={user ? "/home" : "/"}>
            <Navbar.Brand>Grocery Billing</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user && user.role === "staff" && (
                <LinkContainer to="/billing">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faShoppingCart} /> Billing
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && user.role === "admin" && (
                <NavDropdown
                  title={
                    <span>
                      <FontAwesomeIcon icon={faCog} /> Admin
                    </span>
                  }
                  id="admin-dropdown"
                >
                  <LinkContainer to="/products">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/inventory">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBoxesStacked} className="me-2" />
                      Inventory
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/sales-report">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faChartBar} className="me-2" />
                      Sales Report
                    </NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />

                  <LinkContainer to="/admin/suppliers">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faTruck} className="me-2" />
                      Suppliers
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/purchases">
                    <NavDropdown.Item>
                      <FontAwesomeIcon
                        icon={faFileInvoiceDollar}
                        className="me-2"
                      />
                      Record Purchase
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/discounts">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faTag} className="me-2" />
                      Discounts
                    </NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />

                  <LinkContainer to="/admin/register-staff">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faUserTie} className="me-2" />
                      Register Staff
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {user && user.role === "customer" && (
                <LinkContainer to="/my-orders">
                  <Nav.Link>
                    <FontAwesomeIcon icon={faClipboardList} /> My Orders
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && (
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
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
