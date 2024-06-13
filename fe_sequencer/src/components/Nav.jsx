import React from 'react'
import {Navbar, Container, NavbarBrand} from 'react-bootstrap'
import {Link} from 'react-router-dom'


export default function Nav() {
  return (
    <Navbar>
        <Container className='justify-content-center'>
          <Navbar.Brand className='text-center'>
            <Link to={'/'} className='d-flex align-items-center text-decoration-none'>
            <img
              alt=""
              src="./drumbits-logo-2.png"
              width="100"
              height="100"
              className="d-inline-block align-top"
            />{' '}
            <span className='text-white ms-3 display-5 pb-1'>DrumBits</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Text className='float-end d-none'>
            <Link to={'/login'}>Login</Link>
            <Link to={'/register'}>Register</Link>
          </Navbar.Text>
          
        </Container>
      </Navbar>
  )
}
