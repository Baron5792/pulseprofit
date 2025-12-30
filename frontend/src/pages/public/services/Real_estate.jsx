import HeroImg from '../../../assets/images/services/real_estate.jpg';
import styles from '../../../assets/css/Real_estate.module.css';
import WhyChooseUs from '../../../assets/images/services/who_choose_us.png';
import ScrollFadeIn from '../../../component/public/ScrollFadeIn';
import { useEffect } from 'react';
import WhoWeAre from '../../../component/public/Home/Who-we-are';
import CustomersComment from '../../../component/public/Home/Comment';
import GoogleTranslateCustom from '../../../component/public/Translator';

const RealEstate = () => {
    useEffect(() => {
        document.title = `Real Estate - ${import.meta.env.VITE_APP_NAME}`;
    })

    return (
        <>  
            <div className={styles['hero_main_container']}>
                <div className={styles['hero_img']}>
                    <img src={HeroImg} alt="__blank" />
                </div>
                <div className={styles['hero_text']}>
                    <p>REAL ESTATE</p>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
            </div>

            {/* other content */}
            <div className={styles['main_body_container']}>
                <div className="container">
                    <div className={styles['why_choose_us_container']}>
                        <div className={styles['why_choose_us_img']}>
                            <img src={WhyChooseUs} alt="__blank" />
                        </div>
                        <div className={styles['why_choose_us_text']}>
                            <p>Why You Should Choose Us</p>
                            <ScrollFadeIn>
                                <div className={styles['tiny-line']}></div>
                            </ScrollFadeIn>
                            <p>Real estate has always been considered a sound investment, providing long-term financial security and a steady income stream. At {import.meta.env.VITE_APP_NAME}, we offer our clients the opportunity to invest in real estate with confidence, backed by our expertise and experience in the industry.</p>
                        </div>
                    </div>
                </div>

                {/* expertise in real estate */}
                <div className={`${styles['expertise']} container`}>
                    <p>Expertise in Real Estate</p>
                    <div className={styles['tiny-line']}></div>
                    <p>At {import.meta.env.VITE_APP_NAME}, we have years of experience in real estate investment and development. We have a team of highly skilled professionals who have an in-depth understanding of the market and are well-versed in identifying profitable investment opportunities. Our team is dedicated to providing our clients with the best investment options that are tailored to their needs and financial</p>
                </div>

                <div className="container">
                    <WhoWeAre />
                </div>

                <div className="container-fluid">
                    <CustomersComment />
                </div>
            </div>

            
            
        </>
    )
}

export default RealEstate;