import { useEffect } from 'react';
import styles from '../../assets/css/Our_Plans.module.css';
import HeroImg from '../../assets/images/featured/our_plans.jpeg';
import ScrollFadeIn from '../../component/public/ScrollFadeIn';
import { NavLink } from 'react-router';
import WhoWeAre from '../../component/public/Home/Who-we-are';
import { useUser } from '../../component/middleware/Authentication';
import GoogleTranslateCustom from '../../component/public/Translator';

const OurPlans = () => {
    const { user, refreshUser } = useUser();
    useEffect(() => {
        document.title = `Our Plans - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    }, [])

    return (
        <>
            {/* our plans image */}
            <div>
                <div className={styles['our-plans-hero']}>
                    {/* image and text on image */}
                    <img src={HeroImg} alt="__blank" />
                    <div className={styles['overlay']}>
                        <ScrollFadeIn>
                            <p>{import.meta.env.VITE_APP_NAME} plans</p>
                            <p>Build great investment portfolios!</p>
                            <NavLink to={user ? '/user/deposit': '/account/register'}>
                                <button type="button"><span className='bi bi-arrow-right fw-bold'></span> Take the first step</button>
                            </NavLink>
                        </ScrollFadeIn>
                        <div className='mt-2'>
                            <GoogleTranslateCustom />
                        </div>
                    </div>
                </div>
            </div>

            {/* our plans title */}
            <div className={`container ${styles['our-plans-title']}`}>
                <ScrollFadeIn>
                    <p>Our Investment Plans</p>
                </ScrollFadeIn>
            </div>

            {/* investment plans */}
            <div className="container py-5">
                <div className="row">
                    {/* basic */}
                    <div className="col-12 col-md-6 col-lg-3">
                        {/* investment plans */}
                        <div className={styles['plan-card']}>
                            <div className={styles['plan-title']}>
                                <p>BASIC</p>
                            </div>
                            <ul>
                                <li>Minimum investment - $1,000</li>
                                <li>Maximum investment - $4,999</li>
                                <li>ROI - 4.00% Daily</li>
                                <li>Duration - 2 Weeks</li>
                                <li>Compunding - 2 weeks</li>
                            </ul>
                            <div className={styles['invest-btn']}>
                                <NavLink to={user ? '/user/plans': '/account/register'}>INVEST NOW <span className='bi bi-arrow-right'></span></NavLink>
                            </div>
                        </div>
                    </div>

                    {/* silver */}
                    <div className="col-12 col-md-6 col-lg-3">
                        {/* investment plans */}
                        <div className={styles['plan-card']}>
                            <div className={styles['plan-title']}>
                                <p>SILVER</p>
                            </div>
                            <ul>
                                <li>Minimum investment - $5,000</li>
                                <li>Maximum investment - $9,999</li>
                                <li>ROI - 10.00% Daily</li>
                                <li>Duration - 1 Weeks</li>
                                <li>Compunding - 1 weeks</li>
                            </ul>
                            <div className={styles['invest-btn']}>
                                <NavLink to={user ? '/user/plans': '/account/register'}>INVEST NOW <span className='bi bi-arrow-right'></span></NavLink>
                            </div>
                        </div>
                    </div>

                    {/* diamond */}
                    <div className="col-12 col-md-6 col-lg-3">
                        {/* investment plans */}
                        <div className={styles['plan-card']}>
                            <div className={styles['plan-title']}>
                                <p>DIAMOND</p>
                            </div>
                            <ul>
                                <li>Minimum investment - $10,000</li>
                                <li>Maximum investment - $24,999</li>
                                <li>ROI - 15.00% Daily</li>
                                <li>Duration - 2 Weeks</li>
                                <li>Compunding - 2 weeks</li>
                            </ul>
                            <div className={styles['invest-btn']}>
                                <NavLink to={user ? '/user/plans': '/account/register'}>INVEST NOW <span className='bi bi-arrow-right'></span></NavLink>
                            </div>
                        </div>
                    </div>

                    {/* gold */}
                    <div className="col-12 col-md-6 col-lg-3">
                        {/* investment plans */}
                        <div className={styles['plan-card']}>
                            <div className={styles['plan-title']}>
                                <p>GOLD</p>
                            </div>
                            <ul>
                                <li>Minimum investment - $25,000</li>
                                <li>Maximum investment - $49,999</li>
                                <li>ROI - 18.00% Daily</li>
                                <li>Duration - 15 Days</li>
                                <li>Compunding - 15 Days</li>
                            </ul>
                            <div className={styles['invest-btn']}>
                                <NavLink to={user ? '/user/plans': '/account/register'}>INVEST NOW <span className='bi bi-arrow-right'></span></NavLink>
                            </div>
                        </div>
                    </div>

                    {/* premium */}
                    <div className="col-12 col-md-6 col-lg-3">
                        {/* investment plans */}
                        <div className={styles['plan-card']}>
                            <div className={styles['plan-title']}>
                                <p>PREMIUM</p>
                            </div>
                            <ul>
                                <li>Minimum investment - $50,000</li>
                                <li>Maximum investment - $99,999</li>
                                <li>ROI - 20.00% Daily</li>
                                <li>Duration - 30 Days</li>
                                <li>Compunding - 30 Days</li>
                            </ul>
                            <div className={styles['invest-btn']}>
                                <NavLink to={user ? '/user/plans': '/account/register'}>INVEST NOW <span className='bi bi-arrow-right'></span></NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* who we are */}
            <div>
                <WhoWeAre />
            </div>
        </>
    )
}

export default OurPlans