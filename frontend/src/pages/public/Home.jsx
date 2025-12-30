import styles from '../../assets/css/Home.module.css';
import ScrollFadeIn from '../../component/public/ScrollFadeIn';
import GirlImg from '../../assets/images/featured/image.png';
import { NavLink } from 'react-router';
import GoogleTranslateCustom from '../../component/public/Translator';
import TradingViewWidget from '../../component/public/TradingView';
import InnovativeImg from '../../assets/images/featured/innovative.png';
import WhoWeAre from '../../component/public/Home/Who-we-are';
import CustomersComment from '../../component/public/Home/Comment';
import { WaytoInvest } from '../../component/public/Home/Easy-way-to-invest';
import Inflation from '../../component/public/Home/Inflation';
import { useEffect } from 'react';

const Home = () => {

    useEffect(() => {
        document.title = `Home - ${import.meta.env.VITE_APP_NAME}`;
    }, [])
    
    return (
        <>
            {/* for trade globally */}
            <div className={`${styles['main-container']} ${styles['main_home_header']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-6">
                            {/* intro texts */}
                            <ScrollFadeIn>
                                <div className={styles['intro-texts']}>
                                    <p>Trade Globally. Explore Beyond</p>
                                    <p>We are not just another trading company. We are a dynamic and forward-thinking team driven by a passion for financial markets and the pursuit of success.</p>
                                </div>
                            </ScrollFadeIn>
                            {/* others */}
                            <ScrollFadeIn>
                                <div className={styles['intro-others']}>
                                    <NavLink to={'about'} className={'text-decoration-none mx-2'}>
                                        <button type="button" className='btn btn-normal'>LEARN MORE</button>
                                    </NavLink>
                                    <div style={{ width: '200px' }}>
                                        <GoogleTranslateCustom />
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                            {/* intro image */}
                            <div className={styles['intro-img']}>
                                <img src={GirlImg} alt="__blank" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  render for realtime trade */}
            <div>
                <TradingViewWidget />
            </div>


            {/* Easy was to invest */}
            <div>
                <WaytoInvest />
            </div>


            {/* What inflation is doing to your money */}
            <div>
                <Inflation />
            </div>
            

            {/* innovative technology */}
            <div className={`${styles['main-container']} container-fluid`}>
                <div className={`${styles['innovative_container']} container`}>
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
                            <div className={styles['innovative-img']}>
                                <ScrollFadeIn>
                                    <img src={InnovativeImg} alt="Innovative Technology" />
                                </ScrollFadeIn>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
                            <ScrollFadeIn>
                                <div className={styles['innovative_texts']}>
                                    <p>Innovative Technology for Optimal Performance</p>
                                    <p>We understand that speed, accuracy, and reliability are crucial when it comes to trading. That’s why we have invested in state-of-the-art trading technology that ensures lightning-fast execution, real-time market data, and advanced charting tools. With our platform, you can stay ahead of the curve and make informed trading decisions based on robust analysis.</p>
                                </div>
                            </ScrollFadeIn>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* for more info */}
            <div className={`${styles['main-container']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                            <div className={`${styles['more_info']}`}>
                                {/* for icon */}
                                <div className={`${styles['more_info_icon']}`}>
                                    <p className='"bi bi-graph-up-arrow'></p>
                                </div>
                                <div className={styles['more_info_texts']}>
                                    <p>Investment capabilities</p>
                                    {/* for more info text */}
                                    <p>Our single focus is to help clients achieve their investment objectives</p>

                                </div>
                                {/* more info links */}
                                <NavLink to={'about'}><span className='bi bi-info-circle'></span> About Us</NavLink>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                            <div className={`${styles['more_info']}`}>
                                {/* for icon */}
                                <div className={`${styles['more_info_icon']}`}>
                                    <p className='"bi bi-lightbulb'></p>
                                </div>
                                <div className={styles['more_info_texts']}>
                                    <p>Realising Dreams and aspiration</p>
                                    {/* for more info text */}
                                    <p>Our purpose and values link our daily efforts to help our customers fulfil their dreams and aspirations and our commitme nt to work for a greater good and be a sustainable part of the societies in which we operate.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                            <div className={`${styles['more_info']}`}>
                                {/* for icon */}
                                <div className={`${styles['more_info_icon']}`}>
                                    <p className='"bi bi-person-fill'></p>
                                </div>
                                <div className={styles['more_info_texts']}>
                                    <p>We Are Offering 5% Ref. Bonus</p>
                                    {/* for more info text */}
                                    <p>With Our Platform, You Can Earn By Referring Others.</p>
                                </div>
                                {/* more info links */}
                                <NavLink to={'/account/register'}><span className='bi bi-person-plus'></span> Get Started</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* white space */}
            <div style={{ padding: '100px' }}></div>




            {/* who we are */}
            <div className={`${styles['main-container']} container-fluid`}>
                <div className="container">
                    <div className={styles['who_we_are_title']}>
                        <p>Who We Are</p>
                        <ScrollFadeIn>
                            <div className={styles['tiny-line']}></div>
                        </ScrollFadeIn>
                    </div>

                    {/* sub texts */}
                    <div className={styles['who_we_are_sub_text']}>
                        <p>In recent years we have made good progress, together with our customers. We have focused on delivering great customer experiences and continuously developing our services. At the same time, we have improved our financial performance</p>
                        <NavLink>
                            <ScrollFadeIn>
                                <NavLink to={'/account/register'}>
                                    <button type='button'>JOIN NOW <span className='bi bi-caret-right-fill'></span></button>
                                </NavLink>
                            </ScrollFadeIn>
                        </NavLink>
                    </div>

                    <div className="row my-5">
                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-clock-history'></span> Creating value for the future</p>
                                    <p>We have focused on delivering great customer experiences and continuously developing our services. At the same time, we have improved our financial performance</p>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-gem'></span> Strategic</p>
                                    <p>We meticulously analyze risk to pursue an absolute return strategy for our diversified investor base.</p>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-shield-fill'></span> Dedicated</p>
                                    <p>We value curiosity and mentorship as key componenets of our investment process.</p>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-link'></span> Collaborative</p>
                                    <p>We drive our strength from a collaborative team of smart, driven, innovative, and creative people</p>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-bar-chart-fill'></span> Investment Returns</p>
                                    <p>It predicts a return and reward for transactions and investments that you make with our corporate model.</p>
                                </div>
                            </ScrollFadeIn>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <ScrollFadeIn>
                                <div className={styles['who_we_are_content']}>
                                    <p><span className='bi bi-briefcase'></span> Professional Market Traders</p>
                                    <p>A team of professional market traders who are profitable trading with cryptocurrency on the most popular world exchanges and ensure timely payments on loans</p>
                                </div>
                            </ScrollFadeIn>
                        </div>  
                    </div>
                </div>
            </div>

            <div>
                <WhoWeAre />
            </div>

            {/* about inflation */}
            <div className='container-fluid'>
                
            </div>

            <div className='container-fluid py-5'>
                <CustomersComment />
            </div>

        </>
    )
}

export default Home;