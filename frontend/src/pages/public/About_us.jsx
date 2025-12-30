import styles from '../../assets/css/About-us.module.css';
import { useEffect } from "react";
import HeroImg from '../../assets/images/featured/about-us.jpg';
import ScrollFadeIn from '../../component/public/ScrollFadeIn';
import DesigningImg from '../../assets/images/featured/about_other_img.png';
import CertImg from '../../assets/images/featured/certificate.jpg';
import WhoWeAre from '../../component/public/Home/Who-we-are';
import GoogleTranslateCustom from '../../component/public/Translator';

const AboutUs = () => {
    useEffect(() => {
        document.title = `About Us - ${import.meta.env.VITE_APP_NAME}`;
    })
    return (
        <>
            <div className={styles['about-us-hero']}>
                <div className={styles['image-container']}>
                    <img src={HeroImg} alt="__blank" />
                </div>
                <div className={styles['overlay']}>
                    <p>Explore Our Updated Strategy Business Tactics</p>
                    <ScrollFadeIn>
                        <div className={styles['tiny-line']}></div>
                    </ScrollFadeIn>
                    <p>A top-notch financial management system and a foremost investment platform</p>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
                
            </div>


            {/* abosolute about us content */}
            <div className={styles['about_us_absolute']}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['about_us_card']}>
                                    <div className={styles['about_icon']}>
                                        <span className='bi bi-phone'></span>
                                    </div>
                                    <div className={styles['about_title']}>
                                        <p>Our Establishment</p>
                                    </div>
                                    <div className={styles['about_message']}>
                                        <p>With over 60,000 active investors and traders across the globe, {import.meta.env.VITE_APP_NAME} is a global brand on a mission to accommodate every aspect of the crypto space.</p>
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        {/* sustainable relationship */}
                        <div className="col-12 col-md-12 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['about_us_card']}>
                                    <div className={styles['about_icon']}>
                                        <span className='bi bi-briefcase'></span>
                                    </div>
                                    <div className={styles['about_title']}>
                                        <p>Sustainable Relationship</p>
                                    </div>
                                    <div className={styles['about_message']}>
                                        <p>We boost and long-term working and business relationships with our investors and have built a very stable reputation to always deliver our investors targets with high yielding returns!</p>
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        {/* An innovation financial system */}
                        <div className="col-12 col-md-12 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['about_us_card']}>
                                    <div className={styles['about_icon']}>
                                        <span className='bi bi-phone'></span>
                                    </div>
                                    <div className={styles['about_title']}>
                                        <p>An Innovative Financial System</p>
                                    </div>
                                    <div className={styles['about_message']}>
                                        <p>A crypto-oriented investment and assets management platform. {import.meta.env.VITE_APP_NAME} Limited is heavily involved in various deals and sales, broker trades and sanction myriad business transactions, and effectively manage vast sizes of our investors' portfolio across the globe.</p>
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        </div>
                    </div>
                </div>
            </div>


            {/* Designing With Passion While Exploring The Investment world */}
            <div className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-6">
                        {/* for exploring images */}
                        <div className={styles['descriptionImg']}>
                            <img src={DesigningImg} alt="__blank" />
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-6">
                        <ScrollFadeIn>
                            <div className={styles['descriptionTitle']}>
                                <p>Designing With Passion While Exploring The Investment World</p>
                            </div>
                            <div className={styles['descriptionText']}>
                                <p>A top-notch financial management system and a foremost investment platform, a household name in England business, investment, and assets management services. A crypto-oriented investment and assets management platform.</p>

                                <p>{import.meta.env.VITE_APP_NAME} Limited is heavily involved in various deals and sales, we broker trades and sanctions myriads of business transactions and effectively manage vast sizes of our investors’ portfolios across the globe.</p>

                                <p>We work directly and as an intermediary with investors worldwide and maximize the investment capital of our existing clients and investors which outputs encouraging returns on investments. We boost long-term working and business relationships with our investors and have built a very stable reputation always to deliver our investors targets with high yielding returns!</p>

                                <p>With over 60,000 active investors and traders across the globe, We are on a mission to accommodate every aspect of the crypto space. {import.meta.env.VITE_APP_NAME} is a registered trademark under the UK company house Incorporated on 29 January  2020</p>
                            </div>
                        </ScrollFadeIn>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12">
                        <p className={styles['contact_us']}>Would you like to contact us?</p>
                        <a className={styles['support_link']} href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}>{import.meta.env.VITE_SUPPORT_EMAIL}</a>
                    </div>
                </div>
            </div>



            {/* our establishment */}
            <div className="container">
                <div className={styles['establishment_title']}>
                    <p>Our Establishment</p>
                    <ScrollFadeIn>
                        <div className={styles['tiny-line']}></div>
                    </ScrollFadeIn>
                </div>

                <div className={styles['establishment_hero_con']}>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={styles['establishment']}>
                                <p>Durability</p>
                                <p>{import.meta.env.VITE_APP_NAME} is not a get-rich-quick-scheme but a reputable investment service with very long term portfolio targets and goals</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={styles['establishment']}>
                                <p>Reputable</p>
                                <p>We are very serious and work on a daily basis to maintain the strong reputation we have built over the years through positive results</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={styles['establishment']}>
                                <p>Professionalism</p>
                                <p>Our platform is under the management of reputable professionals with many years of effective service experiences in their respective fields</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* certification */}
            <div className={`${styles['certificate_hero']} container`}>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-5">
                        {/* for certification text */}
                        <div className={styles['certificate_text']}>
                            <p>Certificate of Incorporation</p>
                            <ScrollFadeIn>
                                <div className={styles['tiny-line']}></div>
                            </ScrollFadeIn>
                            <p>We are fully registered under the united kingdom trading corporation</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-7">
                        <div className={styles['certificateImg']}>
                            <img src={CertImg} alt="_blank" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <WhoWeAre />
            </div>
        </>
    )
}

export default AboutUs;