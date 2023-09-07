import React from 'react';
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Button } from '@chakra-ui/react'

import { useAuth } from '../../contexts/AuthContext';
import { useBasket } from '../../contexts/BasketContext';

import { useNavigate } from 'react-router-dom'

function Navbar() {

   const { LoggedIn, user } = useAuth();
   console.log(LoggedIn);
   const { items } = useBasket();


   return (
      <nav className={styles.nav}>
         <div className={styles.left}>
            <div className={styles.logo}>
               <Link to="/">eCommerce</Link>
            </div>
            <ul className={styles.menu}>
               <li>
                  <Link to="/">Products</Link>
               </li>
            </ul>
         </div>
         <div className={styles.right}>
            {/* 
         Kullanıcı signup sayfasında bilgilerini girip butona bastığında 
         LoggedIn durumu true olur
         LoggedIn true ise "Profile" butonu gözükür
         değilse "Login" ve "Register" butonları gözükmeye devam eder 
         */}
            {!LoggedIn && (
               <>
                  <Link to="/signin">
                     <Button colorScheme="pink">Login</Button>
                  </Link>
                  <Link to="/signup">
                     <Button colorScheme="pink">Register</Button>
                  </Link>
               </>
            )}

            {LoggedIn && (
               <>
                  {/* giriş yapan kullanıcının sepetinde daha önceden ürün varsa 
               basket butonu görüntülenir
               */}
                  {
                     items.length > 0 && (
                        <Link to="/basket">
                           <Button colorScheme='pink' variant="outline">
                              Basket ({items.length})
                           </Button>
                        </Link>
                     )
                  }

                  {/* giriş yapan kişinin rolü admin ise admin butonu gözükür
                  bu butona basıldıpında localhost:3000/admin sayfası açılır 
               */}
                  {
                     user.role === 'admin' && (
                        <Link to="/admin">
                           <Button colorScheme='pink' variant="ghost">
                              Admin
                           </Button>
                        </Link>
                     )
                  }

                  <Link to="/profile">
                     <Button colorScheme="pink">Profile</Button>
                  </Link>

            
               </>
            )}
         </div>
      </nav>
   );
}

export default Navbar;
