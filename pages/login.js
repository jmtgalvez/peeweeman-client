import { useRef, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';

export default function Login() {
    const { setUser } = useContext(UserContext);

    const usernameRef = useRef();
    const passwordRef = useRef();
    const keepLoggedInRef = useRef();

    const router = useRouter();

    const handleLogin = ev => {
        ev.preventDefault();

        const credentials = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }

        setUser(credentials);

        if (keepLoggedInRef.current.checked)
            localStorage.setItem('peeweeman-user', JSON.stringify(credentials));

        router.push('/home');
    }

    return (
        <div className='container-xl d-flex flex-column justify-content-center align-items-center' style={{minHeight: '100vh'}}>
            <h1>Password Manager</h1>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" ref={usernameRef} />
                    <div id="usernameHelp" className="form-text">We&apos;ll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" ref={passwordRef} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="keepLoggedIn" ref={keepLoggedInRef} />
                    <label className="form-check-label" htmlFor="keepLoggedIn">Keep me logged in</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
