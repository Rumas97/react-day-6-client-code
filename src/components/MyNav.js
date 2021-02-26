import React from  'react'
import {Navbar, Nav} from  'react-bootstrap'
import {Link} from  'react-router-dom'

function MyNav() {
  return (
    <Navbar  bg="light"  expand="lg">
      <Navbar.Toggle  aria-controls="basic-navbar-nav"  />
      <Navbar.Collapse  id="basic-navbar-nav">
        <Nav  className="mr-auto">
          <Link  to="/">Todos</Link>
          <Link  style={{marginLeft: '10px'}}  to="/add-form">Add Todo</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
}
export default MyNav