import { NavLink, Outlet } from 'react-router';
import styles from '../../../assets/css/PublicHeader.module.css';
import Logo from '../../../assets/images/logo/image.png';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Dropdown from 'react-bootstrap/Dropdown';
import AllLinks from '../../../component/Header/NavLinks';
import TradingView from '../../public/TradingView';
import { PublicFooter } from '../../public/partials/Footer';
import { useCsrfToken } from '../../middleware/Csrf-token';
import Swal from 'sweetalert2'
import GoogleTranslateCustom from '../../public/Translator';

export const UserHeader = () => {
    // first check for users authentication
    const [ user, setUser ] = useState(null);
    const [dropdown, setDropdown] = useState(false);
    const { csrfToken } = useCsrfToken();
    const hanldeDropdown = () => {
        setDropdown(!dropdown);
    }
    const navigate = useNavigate();
    const confirmUser = async() => {
        try {
            const query = await fetch(`${import.meta.env.VITE_APP_COMP_URL}check-auth.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const queryResult = await query.json();
            if (queryResult.status === 'success') {
                setUser(queryResult.data);
            }

            else {
                window.location.href = '/account/login';
                setUser(null);
            }
        }

        catch (error) {
            setUser(null);
            window.location.href = '/account/login';
        }
    }

    useEffect(() => {
        confirmUser();
    }, [])

    const copyAccountNumber = async() => {
        const accountNumber = user.reg_id;
        try {
            await navigator.clipboard.writeText(accountNumber);
            setTimeout(() => setCopyStatus(''), 2000);
            toast.success('Copied successfully', {toastId: 'copy-success'});
        }

        catch(error) {
            toast.warning('Copy Failed! 😢', {toastId: 'copy-error'})
        }
    }

    // for mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // logout
    const logoutUser = async() => {
        const sweetAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            confirmButtonColor: 'lightgreen',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Logout'
        })

        if (sweetAlert.isConfirmed) {
            try {
                const logoutRequest = await fetch(`${import.meta.env.VITE_APP_API_URL}account/logout.php`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    }
                })

                const logoutResponse = await logoutRequest.json();
                if (logoutResponse.status === 'success') {
                    window.location.href = '/account/login';
                }

                else {
                    toast.error("Logout failed", {toastId: 'logout-failed'});
                }
            }

            catch (error) {
                toast.error('Network error', {toastId: 'network-error'});
            }
        }
    }

      const formatCurrency = (amount) => {
        // 1. Convert the input to a number first, just in case it's a string
        const numericAmount = parseFloat(amount); 
        
        // 2. Check if the conversion resulted in a valid number
        if (isNaN(numericAmount)) {
            return 'N/A'; // Return a safe string instead of a crash/NaN
        }

        // 3. Perform the formatting
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        return numberFormatter.format(numericAmount);
    };

    return (
        <>
            <div className={styles['main_container']}>
                <div className={`${styles['row']} row`}>
                    <div className="col-0 col-md-0 col-lg-3 g-0">
                        <div className={`${styles['left_nav']} ${isMobileMenuOpen ? styles['mobile_nav_open']: ''}`}>
                            {/* logo here */}
                            <div className={styles.left_logo_container}>
                                <div className={styles['logo_img']}>
                                    <NavLink to={'/'}>
                                        <img src={Logo} alt="_blank" />
                                    </NavLink>
                                </div>
                            </div>

                            {/* google translator */}
                            <div className='mx-4'>
                                {/* <GoogleTranslateCustom /> */}
                            </div>

                            <div className={styles.closeMenu}>
                                <span onClick={closeMobileMenu} className='bi bi-x'></span>
                            </div>

                            {/* for mobile view only */}
                            <div className={styles.mobileViewOnly}>
                                <div className={styles['scroll_nav']}>
                                    <div className={styles.NameDisplay}>
                                        <p className={`${styles.profileIcon} small mx-2 m-0 mt-2`} style={{ textTransform: 'uppercase' }}>
                                            { user && (
                                                user.email.length > 2 ? user.email.slice(0, 2) : ''
                                            )}
                                        </p>
                                        <div className='m-0 p-0'>
                                            {user && (
                                                <>
                                                    {user.username.length > 0 ? (
                                                        <p className={`${styles['username']} m-0`}>{user.username}</p>
                                                    ): (
                                                        null
                                                    )}

                                                    <p className='small'>{user && user.email.length > 27 ? user.email.slice(0, 27) + '...' : user.email}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* for balance */}
                                    <div className={styles['balance_container']}>
                                        <p className={styles['balance_title']}>MAIN ACCOUNT BALANCE</p>
                                        {user && (
                                            <p className={styles['balance_display']}>{formatCurrency(user.balance)} <span>USD</span></p>
                                        )}
                                    </div>

                                    <div className={styles.depositRow}>
                                        <div className={styles.ProfileLinks}>
                                            <NavLink onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/user/deposit');
                                                closeMobileMenu();
                                            }} to={'/user/deposit'}>Deposit Funds <i className="bi bi-box-arrow-in-up"></i></NavLink>

                                            <NavLink onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/user/withdraw');
                                                closeMobileMenu();
                                            }} to={'/user/withdraw'} className={'my-2'}>Withdraw Funds <i className="bi bi-box-arrow-in-down"></i></NavLink>
                                        </div>
                                    </div>
                                        

                                    {/* for other links */}
                                    <div>
                                        {/* other links */}
                                        <div className={styles.otherLink}>
                                            <NavLink to={'/user/profile'} onClick={(e) => {
                                                e.preventDefault(); 
                                                navigate('/user/profile');
                                                closeMobileMenu();
                                            }}><span className='bi bi-person mx-2'></span> View Profile</NavLink>
                                            <NavLink onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/user/profile/security');
                                                closeMobileMenu();
                                            }} to={'/user/profile/security'}><span className='bi bi-gear mx-2'></span> Security Setting</NavLink>
                                            <NavLink onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/user/profile/activity');
                                                closeMobileMenu();
                                            }} to={'/user/profile/activity'}><span className='bi bi-activity mx-2'></span> Login Activity</NavLink>
                                        </div>
                                    </div>

                                    {/* all links for mobile device */}
                                    <div className={`${styles['nav_links']} p-2`}>
                                        <NavLink to={'/user/dashboard'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/dashboard');
                                            closeMobileMenu();
                                        }} end className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-grid px-2'></span> Dashboard</NavLink>
                            
                                        <NavLink to={'/user/transaction'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/transaction');
                                            closeMobileMenu();
                                        }} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-arrow-counterclockwise px-2'></span> Transaction</NavLink>
                            
                                        <NavLink to={'/user/investment'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/investment');
                                            closeMobileMenu();
                                        }} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-graph-up px-2'></span> Investment</NavLink>
                            
                                        <NavLink to={'/user/plans'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/plans');
                                            closeMobileMenu();
                                        }} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-basket px-2'></span> Our Plans</NavLink>
                            
                                        <NavLink to={'/user/transfer'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/transfer');
                                            closeMobileMenu();
                                        }} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-arrow-left-right px-2'></span> Transfer</NavLink>

                                        <NavLink to={'/user/referrals'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/referrals');
                                            closeMobileMenu();
                                        }} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-person-add px-2'></span> Referral</NavLink>
                            
                                        <NavLink to={'/user/profile'} onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/user/profile');
                                            closeMobileMenu();
                                        }} end className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-person-gear px-2'></span> My Profile</NavLink>

                                    </div>
                                </div>
                            </div>

                            <div className={styles['scroll_nav']}>
                                {/* balance display */}
                                <div className={styles['balance_container']}>
                                    <p className={styles['balance_title']}>MAIN ACCOUNT BALANCE</p>
                                    {user && (
                                        <p className={styles['balance_display']}>{formatCurrency(user.balance)} <span>USD</span></p>
                                    )}
                                </div>

                                <div className={styles['']}>
                                    <div className={`${styles['profit_date']} d-flex justify-content-between`}>
                                        <p>Profits</p>
                                        <p>{formatCurrency(user?.interest)} <span>USD</span></p>
                                    </div>

                                    {/* account number here */}
                                    <div className={`${styles['profit_date']} d-flex justify-content-between`}>
                                        <p>Acc No.</p>
                                        {user && (
                                            <p>{ user.reg_id } <button type="button" className='btn btn-sm bi bi-copy' onClick={copyAccountNumber}></button></p>
                                        )}
                                    </div>
                                </div>

                                {/* deposit and withdrawal button */}
                                <div className='row my-3    '>
                                    <div className={`${styles['deposit_button']} col-0 col-md-0 col-lg-6`}>
                                        <NavLink to={'/user/deposit'}>
                                            <button type="button" className='form-control'>DEPOSIT</button>
                                        </NavLink>
                                    </div>
                                    <div className={`${styles['withdraw_button']} col-0 col-md-0 col-lg-6`}>
                                        <NavLink to={'/user/withdraw'}>
                                            <button type="button" className='form-control'>WITHDRAW</button>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className={styles['menu']}>
                                    <p>MENU</p>
                                </div>
                                
                                {/* nav links */}
                                <div className={styles['nav_links']}>
                                    <AllLinks />
                                </div>


                                {/* additional */}
                                <div className={styles['menu']}>
                                    <p>ADDITIONAL</p>
                                </div>

                                <div className={styles['nav_links']}>
                                    <NavLink to={'/'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-house px-2'></span> Go to Home</NavLink>
                                </div>
                              
                                {/* contact */}
                                <div className={styles['nav_links']}>
                                    <NavLink to={'/contact'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-question-square px-2'></span> Contact</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* right nav */}
                    <div className="col-12 col-md-12 col-lg-9">
                        {/* right nav header here */}
                        <div className={styles.right_nav}>
                            {/* right nav sticky header */}
                            <div className={styles.right_nav_header}>
                                <div className="d-flex justify-content-between">
                                    <div className={`${styles['logoBar']}`}>
                                        <button type="button" onClick={toggleMobileMenu} className='btn btn-normal bi bi-list'></button>
                                        <div>
                                            <NavLink to={'/'}>
                                                <img src={Logo} alt="__blank" />
                                            </NavLink>
                                        </div>  
                                    </div> 

                                    {/* dropdown item */}
                                    <div className={`${styles.profileDisplay}`}>
                                        <Dropdown>
                                            {user && (
                                                <Dropdown.Toggle variant='normal' className={styles.DropdownBtn}>
                                                    <p className={`${styles.profileIcon} bi bi-person mx-2 m-0`}></p>
                                                    <div className={styles.userName}>
                                                        <p className='small text-success fw-lighter m-0'>Verified</p>
                                                        <span>
                                                            {user && (user.username && user.username.length > 12 ? user.username.slice(0, 12) + '...' : user.username)}
                                                        </span>
                                                    </div>
                                                </Dropdown.Toggle>
                                            )}

                                            {/* dropdown item */}
                                            <Dropdown.Menu show={dropdown} className={styles.DropdownMenu}>
                                                <div className={styles.NameDisplay}>
                                                    <p className={`${styles.profileIcon} small mx-2  mt-2m-0`} style={{ textTransform: 'uppercase' }}>
                                                        { user && (
                                                            user.email.length > 2 ? user.email.slice(0, 2) : ''
                                                        )}
                                                    </p>
                                                    <div>
                                                        {user && (
                                                            <>
                                                                {user.username.length > 0 ? (
                                                                    <p className={`${styles['username']} m-0`}>{user.username}</p>
                                                                ): (
                                                                    <p className={`${styles['username']} m-0`}>{user.fullname && (
                                                                        user.fullname.length > 20 ? (
                                                                            user.fullname.slice(0, 17) + '...'
                                                                        ): (
                                                                            user.fullname
                                                                        )
                                                                    )}</p>
                                                                )}

                                                                <p className='small'>{user && user.email.length > 27 ? user.email.slice(0, 27) + '...' : user.email}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* amout, deposit and withdrawal links */}
                                                <div className={styles.depositRow}>
                                                    <div>
                                                        <p className={styles['balance_title']}>ACCOUNT BALANCE</p>
                                                        {user && (
                                                            <p className={styles['balance_display']}>{formatCurrency(user.balance)} <span>USD</span></p>
                                                        )}
                                                    </div>
                                                    <div className={styles.ProfileLinks}>
                                                        <NavLink to={'/user/deposit'}>Deposit Funds <i className="bi bi-box-arrow-in-up"></i></NavLink>
                                                        
                                                        <NavLink to={'/user/withdraw'} className={'my-2'}>Withdraw Funds <i className="bi bi-box-arrow-in-down"></i></NavLink>
                                                    </div>
                                                </div>

                                                {/* other links */}
                                                <div className={styles.otherLink}>
                                                    <NavLink to={'/user/profile'}><span className='bi bi-person mx-2'></span> View Profile</NavLink>
                                                    <NavLink to={'/user/profile/security'}><span className='bi bi-gear mx-2'></span> Security Setting</NavLink>
                                                    <NavLink to={'/user/profile/activity'}><span className='bi bi-activity mx-2'></span> Login Activity</NavLink>
                                                    {user && user.admin === 1 ? (
                                                        <NavLink to={'/admin/'}><span className='bi bi-people mx-2'></span> Admin Panel</NavLink>
                                                    ): (
                                                        null
                                                    )}
                                                </div>

                                                <div className={styles.otherLink}>
                                                    <GoogleTranslateCustom />
                                                </div>

                                                <div className={styles.otherLink}>
                                                    <NavLink onClick={logoutUser}><span className='bi bi-box-arrow-right mx-2'></span> Sign out</NavLink>
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            {/* <TradingView /> */}


                            {/* pages content here */}
                            <div className={`${styles['content_view']}`}>
                                <div className={`${styles['page_content']} container-fluid`}>
                                    <Outlet />
                                </div>


                                {/* footer */}
                                <div>
                                    <PublicFooter />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}