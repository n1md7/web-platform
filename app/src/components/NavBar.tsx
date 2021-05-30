import React from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {BsFillPersonFill, BsLayoutTextSidebar, BsList} from "react-icons/bs";

const TopNav = () => {

  return (
    <Navbar bg="light" expand="lg">
      <Navbar id="menu-toggle">
        <BsLayoutTextSidebar color="purple"/>
      </Navbar>
      <Navbar.Toggle aria-controls="basic-navbar-nav">
        <BsList/>
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="#home">
            <i className="fas fa-globe"></i>
          </Nav.Link>
          <Nav.Link href="#home">
            <i className="fas fa-comments"></i>
          </Nav.Link>
          <Nav.Link href="#link">
            <i className="fas fa-bell"></i>
          </Nav.Link>
          <NavDropdown
            title={`${'firstName'} ${'lastName'}`}
            id="basic-nav-dropdown"
            alignRight
          >
            <NavDropdown.Item href="#action/3.1">
              Account Settings
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Feedbacks</NavDropdown.Item>
            <NavDropdown.Divider/>
            <NavDropdown.Item>
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#">
            <BsFillPersonFill size={22}/>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;