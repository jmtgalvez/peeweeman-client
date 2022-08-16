import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';

export default function Home() {
    const {user, setUser} = useContext(UserContext);
    const [accounts, setAccounts] = useState([]);
    const router = useRouter();

    const fetchAccounts = (user = user) => {
        if (user) {            
            const accountsData = localStorage.getItem(`peeweeman-${user.username}@${user.password}`);
            if (accountsData) {
                let fetchedAccounts = (CryptoAES.decrypt(accountsData, `${user.username}@${user.password}`)).toString(CryptoENC);
                setAccounts((JSON.parse(fetchedAccounts)).accounts);
            }
        }
    }

    const saveAccounts = () => {
        if (user) {
            let encryptAccounts = CryptoAES.encrypt(JSON.stringify({ accounts }), `${user.username}@${user.password}`).toString();
            localStorage.setItem(`peeweeman-${user.username}@${user.password}`, encryptAccounts);
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem('peeweeman-user');
        if (!user && !userData) router.push('/login');
        const credentials = user || JSON.parse(userData);
        setUser(credentials);
        fetchAccounts(credentials);
    }, []);

    useEffect(() => {
        if (accounts && accounts.length > 0) saveAccounts();
    }, [accounts])
    

    function LogoutButton() {

        const handleLogout = () => {
            localStorage.removeItem('peeweeman-user');
            router.push('/login');
        }

        return (
            <button type="button" className='btn btn-danger' onClick={handleLogout}>Logout</button>
        )
    }

    function AddAccountForm() {
    
        const [showPassword, setShowPassword] = useState(false);
        const [account, setAccount] = useState({
            name:"",
            site:"",
            email:"",
            password:"",
        })

        const handleInputChange = ev => {
            setAccount( (currAccount) => ({ ...currAccount ,[ ev.target.name]: ev.target.value }))
        }
    
        const handleSubmit = ev => {
            ev.preventDefault();
    
            setAccounts([...accounts, {...account, id: v4()}]);
            ev.target.form.reset();
        }
    
        return (<>
    
    {/* <!-- Button trigger modal --> */}
    <button 
        type="button" 
        className='btn btn-success' 
        data-bs-toggle="modal"
        data-bs-target="#addPasswordModal"
    >
        Add Account
    </button>
    
    
    {/* <!-- Modal --> */}
    <div className="modal fade" id="addPasswordModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addPasswordModalLabel">Add Password</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="addPasswordForm">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        aria-describedby="nameHelp" 
                        placeholder="Enter name"
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="site">Website</label>
                    <input 
                        type="text" 
                        name="site"
                        className="form-control" 
                        aria-describedby="siteHelp" 
                        placeholder="Enter website url"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="text" 
                        name="email"
                        className="form-control" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter email or username"
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className='input-group'>
                        <input 
                            type={ showPassword ? "text" : "password"}
                            name="password"
                            className="form-control" 
                            placeholder="Password" 
                            required
                            onChange={handleInputChange}
                        />
                        <div 
                            className='input-group-text'
                            onClick={ () => { setShowPassword(!showPassword) }}
                            style={{ cursor: 'pointer' }}
                        >
                            { showPassword ? <HideSvg /> : <ShowSvg />}
                        </div>
                    </div>
                </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <input form="addPasswordForm" type="submit" className="btn btn-primary" value="Submit" onClick={handleSubmit} data-bs-dismiss="modal" />
          </div>
        </div>
      </div>
    </div>
    
        </>)
    }
    
    return (
        user ? (
            <div className='container-xl p-5'>
                <LogoutButton />
                <h1>Welcome back, {user.username}!</h1>
                <AddAccountForm 
                    accounts={accounts}
                    setAccounts={setAccounts}
                />
                {
                    accounts && accounts.length > 0
                    ? (
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Site</th>
                                    <th>Email / Username</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.slice().reverse().map( 
                                    account => 
                                        <AccountRow 
                                            key={account.id} 
                                            accounts={accounts} 
                                            setAccounts={setAccounts} 
                                            account={account} 
                                        />
                                    )}
                            </tbody>
                        </table>
                    )
                    : <h3>No accounts added.</h3>
                }
            </div>
        ) : ''
    )
}

function AccountRow({ accounts, setAccounts, account }) {

    const [showPassword, setShowPassword] = useState(false);

    function EditPasswordForm() {
    
        const [showPassword, setShowPassword] = useState(false);

        const [name, setName] = useState(account.name || '');
        const [site, setSite] = useState(account.site || '');
        const [email, setEmail] = useState(account.email || '');
        const [password, setPassword] = useState(account.password || '');

        const handleSubmit = ev => {
            ev.preventDefault();

            const editAccount = {
                id: account.id,
                name,
                site,
                email,
                password,
            }

            setAccounts([...(accounts.filter( acc => acc.id != account.id)), editAccount]);
        }

        return (<>

    {/* <!-- Button trigger modal --> */}
    <button 
        type="button" 
        className='btn btn-success p-2 pt-1' 
        data-bs-toggle="modal"
        data-bs-target={`#editPasswordModal${account.id}`}
    >
        <EditSvg />
    </button>


    {/* <!-- Modal --> */}
    <div className="modal fade" id={"editPasswordModal" + account.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="addPasswordModalLabel">Add Password</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <form id={"editPasswordForm" + account.id}>
                <div className="form-group">
                    <label htmlFor="name">Email address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-describedby="nameHelp" 
                        placeholder="Enter name"
                        defaultValue={name}
                        onChange={ ev => setName(ev.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="site">Email address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-describedby="siteHelp" 
                        placeholder="Enter website url"
                        defaultValue={site}
                        onChange={ ev => setSite(ev.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-describedby="emailHelp" 
                        placeholder="Enter email or username"
                        defaultValue={email}
                        onChange={ ev => setEmail(ev.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className='input-group'> 
                        <input 
                            type={ showPassword ? "text" : "password" }
                            className="form-control" 
                            placeholder="Enter password"
                            defaultValue={password}
                            onChange={ ev => setPassword(ev.target.value)}
                            required
                        />
                        <div 
                            className='input-group-text'
                            onClick={ () => { setShowPassword(!showPassword) }}
                            style={{ cursor: 'pointer' }}
                        >
                            { showPassword ? <HideSvg /> : <ShowSvg />}
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <input form={"editPasswordForm" + account.id} type="submit" className="btn btn-primary" value="Submit" onClick={handleSubmit} data-bs-dismiss="modal" />
        </div>
        </div>
    </div>
    </div>

        </>)
    }

    const handleDelete = () => {
        setAccounts([...(accounts.filter( acc => acc.id != account.id))]);
    }

    return (
        <tr>
            <td>{account.name}</td>
            <td>{account.site}</td>
            <td>{account.email}</td>
            <td onClick={ () => { setShowPassword(!showPassword) }} style={{ cursor: 'pointer' }}>
                <input 
                    type={showPassword ? "text" : "password" }
                    value={account.password} 
                    style={{
                        border: 'none',
                        backgroundColor: 'rgba(0,0,0,0)',
                        color: 'black',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                    title="Show password"
                    readOnly
                />
                { showPassword ? <HideSvg /> : <ShowSvg />}
            </td>
            <td>
                <EditPasswordForm />
                <button className='btn btn-danger mx-3 p-2 pt-1' onClick={handleDelete} ><TrashSvg /></button>
            </td>
        </tr>
    )
}

function EditSvg() {
    return (
<svg style={{height: '1.2em'}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
</svg>
    )
}

function ShowSvg() {
    return (
<svg style={{height: '1em'}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
</svg>
    )
}

function HideSvg() {
    return (
<svg style={{height: '1em'}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
</svg>
    )
}

function TrashSvg() {
    return (
<svg style={{height: '1.2em'}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
</svg>
    )
}