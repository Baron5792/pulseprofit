import { NavLink, Outlet } from "react-router";
import styles from '../../assets/css/admin/Header.module.css';
import Logo from '../../assets/images/logo/image.png';
import { useEffect, useState } from "react";
import { useUser } from "../middleware/Authentication";
import GoogleTranslateCustom from "../public/Translator";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AdminHeader = () => {
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();
    const [mobile, setMobile] = useState(false);
    const openMobileNav = () => {
        setMobile(!mobile);
    }

    // check if user is actually an admin
    const checkUser = async() => {
        const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/check/check_admin_status.php`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const request = await response.json();
        if (request.status === 'success') {
            console.log('authenticated');
        }

        else {
            try {
                // logout user for a forbidden access
                const processLogout = await fetch(`${import.meta.env.VITE_APP_API_URL}account/logout.php`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const logoutResponse = await processLogout.json();
                if (logoutResponse.status === 'success') {
                    toast.error(`Server responded with status ${processLogout.status}`, {toastId:'success'});
                    return;
                }

                else {
                    toast.error('Access denied to perform this action', {toastId: 'error'});
                    navigate('/user/dashboard');
                    return;
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'server-error'});
                navigate('/user/dashboard');
                return;
            }
        }
    }

    useEffect(() => {
        refreshUser();
        checkUser();
    }, [])
    return (
        <>
            <div className={`${styles['container_fluid']}`}>
                <div className={`${styles['admin-sticky-parent']} row gx-0`}>
                    <div className="col-0 col-md-0 col-lg-3">
                        {/* for desktop nav */}
                        <div className={mobile ? styles['mobile_side_nav']: styles['left_nav_main_container']}>
                            <div className={styles['admin_logo']}>
                                <NavLink to={'/user/dashboard'}>
                                    <img src={Logo} alt="_blank" />
                                </NavLink>
                            </div>

                            <div className={styles['left_scroll_bar']}>
                                <div className={styles['left_content']}>
                                    <div className={styles['content_title']}>
                                        <p>PACKAGES</p>
                                    </div>
                                    <NavLink onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = '/admin/'
                                    }} to={'/admin/'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-grid"></span> Dashboard</NavLink>

                                    <NavLink onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = '/admin/deposit';
                                    }} to={'/admin/deposit'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-wallet2"></span> Deposit</NavLink>

                                    {/* <NavLink onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = '/admin/withdrawal'
                                    }} to={'/admin/withdrawal'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-box-arrow-right"></span> Withdrawal</NavLink> */}

                                    <NavLink onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = '/admin/manage_users';
                                    }} to={'/admin/manage_users'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-person-lines-fill"></span> Manage Users</NavLink>

                                    {/* <NavLink to={'/admin/verification'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-person-check-fill"></span> Verifications</NavLink> */}
                                </div>
                                <div className={styles['left_content']}>
                                    <div className={styles['content_title']}>
                                        <p>OTHERS</p>
                                    </div>

                                    <NavLink to={'/admin/contact_us'} end onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = '/admin/contact_us';
                                    }} className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-headset"></span> Contact Us</NavLink>

                                    <NavLink to={'/user/dashboard'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`}><span className="bi bi-box-arrow-in-right"></span> Return to website</NavLink>
                                </div>
                                <div className={styles['left_content']}>
                                    <div className={styles['content_title']}>
                                        <p>HI, {user?.username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-9">
                        <div className={styles['content_header']}>
                            <div className={styles['mobile_toggle_button']}>
                                <button onClick={openMobileNav} type="button" className={`${styles['toggle_btn']} btn btn-normal fs-2 p-0`}>
                                    <span className={mobile ? 'bi bi-x': 'bi bi-list'}></span>
                                </button>
                            </div>
                            <div className={`${styles['header_search_input']} my-3`}>
                                {/* <input type="text" placeholder="Search for anything here..." name="" className="form-control" id="" /> */}
                                <GoogleTranslateCustom />
                            </div>
                            {/* <div className={styles['header_icon']}>
                                <span className="bi bi-person"></span>
                            </div> */}
                        </div>

                        {/* contents here */}
                        <div className={`${styles['content_display']} container`}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AdminHeader;