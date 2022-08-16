import '../styles/globals.css';
import '../styles/w3sidebar.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { UserContext } from '../context/UserContext';

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('peeweeman-user');
    if (userData) setUser(JSON.parse(userData));
    else router.push('/login');
  }, []);

  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Peewee Man</title>
    </Head>

    <Script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
      crossOrigin="anonymous"
    />

    <UserContext.Provider value={{user, setUser}}>
      <Component {...pageProps} />
    </UserContext.Provider>
    </>
  )
}

export default MyApp
