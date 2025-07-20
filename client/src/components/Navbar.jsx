import React from 'react'
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="menu">
                <RxHamburgerMenu size={24}/>
                <p>Menu</p>
        </div>
        <div className="logo">
               <h3>RIDEAUX</h3> 
        </div>
        <div className="settings">
                <input type="text" className='mx-4' placeholder='Rechercher...' />
                <HiOutlineShoppingBag />
        </div>
    </div>
  )
}

export default Navbar