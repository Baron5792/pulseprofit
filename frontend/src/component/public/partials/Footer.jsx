import { NavLink } from 'react-router';
import styles from '../../../assets/css/Footer.module.css';
import Logo from '../../../assets/images/logo/image.png';
import ScrollFadeIn from '../ScrollFadeIn';
import GoogleTranslateCustom from '../Translator';

export const PublicFooter = () => {
    return (
        <>
            {/* main_container */}
            <div className={`${styles['main_container']}`}>
                <div className="row">
                    {/* for logo */}
                    <div className="col-12 col-md-12 col-lg-6">
                        <ScrollFadeIn>
                            <div className={styles['logo_hero']}>   
                                <img src={Logo} alt="__blank" />
                                <div className={styles.tiny_line}></div>
                                {/* google translator */}
                                {/* <div style={{ width: '60px' }}>
                                    <GoogleTranslateCustom />
                                </div> */}
                            </div>
                        </ScrollFadeIn>
                    </div>
                    {/* other links */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['other_links']}>
                            <p>Quick Links</p>
                            <ul>
                                <li>
                                    <NavLink to={'/'}>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/about'}>About Us</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/our_plans'}>Our Plans</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/faq'}>FAQ</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/contact'}>Contact Us</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['other_links']}>
                            <p>Services</p>
                            <ul>
                                <li>
                                    <NavLink to={'/real-estate'}>Real Estate</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/gold-investment'}>Gold Investment</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/agriculture'}>Agriculture</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/cryptocurrency'}>Cryptocurrency</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            {/* sites info @year */}
            <div className={`${styles['site_info']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-6">
                            <p> &copy; {new Date().getFullYear()} All Rights Reserved. Powered by {import.meta.env.VITE_APP_NAME}</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}