import { useEffect, useState } from 'react';
import styles from '../../../assets/css/Header.module.css';
import Logo from '../../../assets/images/logo/image.png';
import { NavLink } from 'react-router';
import { useUser } from '../../middleware/Authentication';

const PublicHeader = () => {
    const { user } = useUser();
    // for sidebar
    const [sideBar, setSideBar] = useState(false);
    const openSideBar = () => {
        setSideBar(true);
    }

    const closeSideNav = () => {
        setSideBar(false);
    }

    const hideMobileSideBar = () => {
        setSideBar(!sideBar)
    }

    // for service dropdown
    const [services, setServices] = useState(false);
    const openServices = () => {
        setServices(!services);
    }

    return (
        <>
            <div className={`${styles['main-header']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-8 col-md-5 col-lg-6 col-xl-6">
                            {/* logo design */}
                            <div className={`${styles['logo-hero']}`}>
                                <NavLink to={'/'}>
                                    <img src={Logo} alt="__blank" />
                                </NavLink>
                            </div>
                        </div>
                        
                        <div className="col-4 col-md-7 col-lg-6 col-xl-6">
                            {/* nav links */}
                            {/* Links for desktop view */}
                            <div className={styles['sideLinks']}>
                                
                                <div className={styles['service-container']}>
                                    <NavLink onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = 'services';
                                    }} to={'services'} className={({ isActive }) => isActive ? `${styles['active']}`: ``} id={styles['service-btn']}>Services <span className='bi bi-chevron-down small'></span></NavLink>

                                    {/* services dropdown */}
                                    <div className={`${styles['service-drop-content']}`}>
                                        <NavLink onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = 'real-estate';
                                        }} to={'real-estate'} className={({ subActive }) => subActive ? `${styles['subActive']}`: ``}><span>.</span> Real Estate </NavLink>

                                        <NavLink onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = 'gold-investment';
                                        }} to={'gold-investment'} className={({ subActive }) => subActive ? `${styles['subActive']}`: ``}><span>.</span> Gold Investment</NavLink>

                                        <NavLink onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = 'agriculture';
                                        }} to={'agriculture'} className={({ subActive }) => subActive ? `${styles['subActive']}`: ``}><span>.</span> Agriculture</NavLink>

                                        <NavLink onClick={(event) => {
                                            event.preventDefault();
                                            window.location.href = 'cryptocurrency';
                                        }} to={'cryptocurrency'} end className={({ subActive }) => subActive ? `${styles['subActive']}`: ``}><span>.</span> Cryptocurrency</NavLink>
                                    </div>
                                </div>

                                <NavLink onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = 'about';
                                }} to={'/about'} end className={({ isActive }) => isActive ? `${styles['active']}`: ``}>About</NavLink>

                                <NavLink onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = 'our_plans';
                                }} to={'our_plans'} className={({ isActive }) => isActive ? `${styles['active']}`: ``}>Our Plans</NavLink>

                                <NavLink onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = 'faq';
                                }} to={'faq'} className={({ isActive }) => isActive ? `${styles['active']}`: ``}>FAQ</NavLink>

                                <NavLink onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = 'contact';
                                }} to={'contact'} className={({ isActive }) => isActive ? `${styles['active']}`: ``}>Contact</NavLink>

                                {user ? (
                                    <>
                                        <NavLink to={'/user/dashboard'}>Dashboard</NavLink>
                                    </>
                                ): (
                                    <>
                                        <NavLink to={'/account/login'} onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = '/account/login'
                                        }} className={({ isActive }) => isActive ? `${styles['active']}`: ``}>Login</NavLink>

                                        <NavLink to={'/account/register'} onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = '/account/register';
                                        }} className={({ isActive }) => isActive ? `${styles['active']}`: ``}>Get Started</NavLink>
                                    </>
                                )}
                            </div>

                            {/* desktop buttons */}
                            <div className={`${styles['header-component']}`}>
                                <button type="button" className=''>
                                    {/* <span className=''></span> */}
                                </button>
                                <button type="button" onClick={openSideBar}>
                                    <span className={'bi bi-list'}></span>
                                </button>
                            </div>
                        </div>
                        

                        {/* Links for mobile view */}
                        <div className={sideBar ? styles['mobile_nav']: styles['hide_mobile_nav']}>
                            {/* logo for mobile and a close button */}
                            <div className="d-flex justify-content-between">
                                <div className={styles['mobile_logo_img']}>
                                    <img src={Logo} alt="logo" />
                                </div>
                                <div>
                                    <button onClick={hideMobileSideBar} type="button" className='btn btn-normal bi bi-x fs-3'></button>
                                </div>
                            </div>

                            <NavLink className={({ isActive }) => isActive ? styles['active_nav']: ''} to={'/'} onClick={(event) => {
                                event.preventDefault();
                                window.location.href = '/'
                            }}>
                                Home
                            </NavLink>

                            {/* render mobile services here */}
                            <section className='d-flex justify-content-between'>
                                <NavLink to={'/services'} className={({ isActive }) => isActive ? styles['active_nav']: ''} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/services'
                                }}>
                                    Services
                                </NavLink>
                                <button type="button" onClick={openServices} className={`${services ? 'bi bi-caret-up-fill': 'bi bi-caret-down-fill'} p-0 btn btn-normal text-secondary ${styles['service_btn']}`}></button>
                            </section>

                            {/* services rendered */}
                            <div className={services ? styles['services_rendered']: styles['no_services']}>
                                <NavLink to={'real-estate'} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/real-estate'
                                }}>
                                    Real Estate
                                </NavLink>

                                <NavLink to={'gold-investment'} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/gold-investment'
                                }}>
                                    Gold Investment
                                </NavLink>

                                <NavLink to={'agriculture'} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/agriculture'
                                }}>
                                    Agriculture
                                </NavLink>

                                <NavLink to={'cryptocurrency'} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/cryptocurrency'
                                }}>
                                    Cryptocurrency
                                </NavLink>
                            </div>

                            <NavLink to={'/about'} className={({ isActive }) => isActive ? styles['active_nav']: ''} onClick={(event) => {
                                event.preventDefault();
                                window.location.href = '/about'
                            }}>
                                About
                            </NavLink>

                            <NavLink to={'/our_plans'} className={({ isActive }) => isActive ? styles['active_nav']: ''} onClick={(event) => {
                                event.preventDefault();
                                window.location.href = '/our_plans'
                            }}>
                                Our Plans
                            </NavLink>

                            <NavLink to={'/faq'} className={({ isActive }) => isActive ? styles['active_nav']: ''} onClick={(event) => {
                                event.preventDefault();
                                window.location.href = '/faq'
                            }}>
                                FAQ
                            </NavLink>

                            <NavLink to={'/contact'} className={({ isActive }) => isActive ? styles['active_nav']: ''} onClick={(event) => {
                                event.preventDefault();
                                window.location.href = '/contact'
                            }}>
                                Contact
                            </NavLink>

                            {user ? (
                                <NavLink to={'/user/dashboard'} onClick={(event) => {
                                    event.preventDefault();
                                    window.location.href = '/user/dashboard'
                                }}>
                                    Dashboard
                                </NavLink>
                            ): (
                                <>
                                    <NavLink to={'/account/login'} onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = '/account/login'
                                    }}>
                                        Login
                                    </NavLink>

                                    <NavLink to={'/account/register'} onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = '/account/register'
                                    }}>
                                        Get Started
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
            
        </>
    )
}

export default PublicHeader;