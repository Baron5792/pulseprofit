import ServiceImg from '../../assets/images/featured/services.jpg';
import styles from '../../assets/css/Services.module.css';
import ScrollFadeIn from '../../component/public/ScrollFadeIn';
import cryptoImg from '../../assets/images/services/crypto.png';
import RealTime from '../../assets/images/services/real_time.jpeg';
import SecurityImg from '../../assets/images/services/security.jpeg';
import Support from '../../assets/images/services/support.jpeg';
import { useEffect } from 'react';
import HomeImg from '../../assets/images/services/home.jpeg';
import { NavLink } from 'react-router';
import { useUser } from '../../component/middleware/Authentication';
import CustomersComment from '../../component/public/Home/Comment';
import GoogleTranslateCustom from '../../component/public/Translator';

const Services = () => {
    const { user, refreshUser } = useUser();

    useEffect(() => {
        document.title = `Services - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    }, [])

    return (
        <>  
             <div className={styles['hero_container']}>
                <div className={styles['hero_img']}>
                    <img src={ServiceImg} alt="_blank" />
                </div>
                <div className={styles['hero_text']}>
                    <p>Our Professional And Dedicated Services</p>
                    <ScrollFadeIn>
                        <div className={styles['tiny-line']}></div>
                    </ScrollFadeIn>
                    <p>Long-term investments in cryptocurrencies are part of our new capital allocation strategy. We consider cryptocurrencies not only as a reliable means of preserving value, but also as an attractive investment asset, which, with a competent approach, allows you to quickly multiply your capital investments.</p>
                </div>
            </div>

            {/* faq title */}
            <div className={styles['title']}>
                <p>Our Services</p>
                <div>
                    <GoogleTranslateCustom />
                </div>
            </div>

            {/* services rendered */}
            <div className="container py-5">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={`${styles['services_container']}`}>
                            <div className={styles.service_img}>
                                <img src={cryptoImg} alt="_bloank" />
                            </div>
                            <div className={styles['service_text']}>
                                <p>Cryptocurrency</p>
                                <p>We innovate Technology carries out cryptocurrency investment services.</p>
                            </div>
                        </div>
                    </div>

                    {/* real time */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={`${styles['services_container']}`}>
                            <div className={styles.service_img}>
                                <img src={RealTime} alt="_bloank" />
                            </div>
                            <div className={styles['service_text']}>
                                <p>Real-Time Market Analysis</p>
                                <p>Delivers live, actionable insights, news feeds, and fundamental analysis across multiple asset classes (forex, crypto, stocks, commodities).</p>
                            </div>
                        </div>
                    </div>

                    {/* security */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={`${styles['services_container']}`}>
                            <div className={styles.service_img}>
                                <img src={SecurityImg} alt="_bloank" />
                            </div>
                            <div className={styles['service_text']}>
                                <p>Digital Asset Custody & Security</p>
                                <p>Ensures the highest level of security for user funds and digital assets through multi-factor authentication, cold storage solutions, and regulatory compliance.</p>
                            </div>
                        </div>
                    </div>

                    {/* support */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={`${styles['services_container']}`}>
                            <div className={styles.service_img}>
                                <img src={Support} alt="_bloank" />
                            </div>
                            <div className={styles['service_text']}>
                                <p>24/7 Premium Support</p>
                                <p>Round-the-clock customer service via live chat, email, and dedicated account managers for premium clients. This ensures users receive timely assistance with platform navigation, technical issues, and transaction queries.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {/* industriies we've serverd */}
            {/* first a main container */}
            <div className="container">
                <div className={`${styles['industries_main_container']} row`}>
                    <div className="col-12 col-md-12 col-lg-6">
                        <div className={styles['industry_texts']}>
                            <p>Industries We Served</p>
                            <ScrollFadeIn>
                                <div className={styles['tiny-line']}></div>
                            </ScrollFadeIn>
                            <p>Which is the same as saying through shrinking from toil and pain these perfectly simple and easy to distinguish.</p>
                            <NavLink to={user ? '/user/dashboard': '/account/register'}>{user ? 'Go to dashboard': 'Get Started '} <span className='bi bi-arrow-right small'></span></NavLink>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-6">
                        <div className={styles['industry_image']}>
                            <img src={HomeImg} alt="__blank" />
                        </div>
                    </div>
                </div>
            </div>


            <div className='my-5 container-fluid'>
                <CustomersComment />
            </div>
        </>
    )
}

export default Services