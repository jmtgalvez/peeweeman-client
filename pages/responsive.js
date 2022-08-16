import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

export default function Responsive() {
    const {user, setUser} = useContext(UserContext);

    return (<>

<Sidebar />

<main className='container' >

<h3>Passwords</h3>

</main>
    </>)
}

// function Sidebar() {

//     // /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
//     // function openNav() {
//     //     document.getElementById("sidebar").style.width = "250px";
//     //     // document.getElementById("main").style.marginLeft = "250px";
//     // }

//     // /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
//     // function closeNav() {
//     //     document.getElementById("sidebar").style.width = "0";
//     //     // document.getElementById("main").style.marginLeft = "0";
//     // }

//     return (<>
// {/* <div className='row text-center' style={{ position: 'fixed' }}>
//     <button className="openbtn col-2" onClick={openNav}>&#9776;</button>
//     <h1 className='col-10'>Peewee Man</h1>
// </div>

// <div id="sidebar" className="sidebar">
//   <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
//   <a href="#">Home</a>
//   <a href="#">Settings</a>
//   <a href="#">Logout</a>
// </div> */}
//     </>)
// }

function Sidebar() {
    return (<></>)
}