import { useEffect } from 'react';
import styles from '../../../assets/css/Agriculture.module.css';
import HeroImg from '../../../assets/images/services/agriculture.jpg';
import WhoWeAre from '../../../component/public/Home/Who-we-are';
import CustomersComment from '../../../component/public/Home/Comment';
import GoogleTranslateCustom from '../../../component/public/Translator';

const Agriculture = () => {
    useEffect(() => {
        document.title = `Agriculture - ${import.meta.env.VITE_APP_NAME}`;
    }, [])

    return (
        <>
            <div className={styles['hero_main_container']}>
                <div className={styles['hero_img']}>
                    <img src={HeroImg} alt="__blank" />
                </div>
                <div className={styles['hero_text']}>
                    <p>BUILD THE FUTURE YOU WANT</p>
                    <div className={styles['tiny-line']}></div>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
            </div>

            {/*  AGRICULTURAL SERVICES */}
            <div className={styles['body_container']}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={`${styles['agric_desc_con']} d-flex justify-content-around`}>
                                <div className={styles['agric_icon']}>
                                    <span className='bi bi-house'></span>
                                </div>
                                <div className={styles['agric_text']}>
                                    <p>Plants Collection</p>
                                    <p>Any plants for your space</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={`${styles['agric_desc_con']} d-flex justify-content-around`}>
                                <div className={styles['agric_icon']}>
                                    <span className='bi bi-tree'></span>
                                </div>
                                <div className={styles['agric_text']}>
                                    <p>Smart Investment</p>
                                    <p>Cash crop production</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={`${styles['agric_desc_con']} d-flex justify-content-around`}>
                                <div className={styles['agric_icon']}>
                                    <span className='bi bi-tree'></span>
                                </div>
                                <div className={styles['agric_text']}>
                                    <p>100% Money Back</p>
                                    <p>If the item didn't suit you</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* contents */}
                <div className="container my-5">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className={styles['about_agric_title']}>
                                <p>Need help in choosing the right plants?</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-8">
                            <div className={styles['about_agric_content']}>
                                <p>Nearly two-thirds of the world’s poor rely on agriculture for their incomes, making the sector key to economic development. Agriculture is two to four times more effective at raising incomes in developing countries than other sectors. Certain crops with high market value like coffee, cocoa, and others can bring especially large increases to farmer’s incomes. When farmers can improve the quality and yields of these high-value crops, the impact can be transformative.</p>
                                
                                <p>Surpluses produced in excess of household consumption can be sold commercially, increasing community food security, promoting value-added activities like processing, and supporting a variety of businesses along the supply chain. This extra value not only supports farmers and their households, but also creates jobs, wealth, and economic growth along the supply chain until the products reach the end consumers, whether they live next door to the farmer or on the other side of the world.</p>

                                <p>Investing in agriculture is a wise choice for those who are looking for a sustainable and profitable long-term investment. Agriculture is one of the oldest and most essential industries in the world, and with the growing global population, the demand for food and other agricultural products is only increasing.</p>

                                <p>At {import.meta.env.VITE_APP_NAME}, we specialize in providing agricultural investment opportunities to our clients. Our company has a strong track record of success in the agriculture sector, and we are committed to helping our clients achieve their financial goals through smart and sustainable investments.</p>

                                <p>So why should you consider investing in agriculture, and why should you choose {import.meta.env.VITE_APP_NAME} as your partner in this endeavor? Let’s take a closer look.</p>

                                <p className={styles['desc_title']}>Benefits of Investing in Agriculture</p>

                                <p>Diversification – Investing in agriculture can provide a much-needed diversification to your investment portfolio. Agriculture is a non-correlated asset class, which means it has low correlation with other asset classes like stocks, bonds, and real estate. By investing in agriculture, you can reduce the risk of your overall portfolio and potentially increase your returns.</p>

                                <p>Growing Demand – As mentioned earlier, the global population is growing rapidly, and so is the demand for food and other agricultural products. According to the United Nations, the world population is expected to reach 9.7 billion by 2050. This means that there will be an increasing need for agricultural products, making it a promising investment opportunity.</p>

                                <p>Tangible Asset – Agriculture is a tangible asset that provides a real and physical return on investment. When you invest in agriculture, you own a piece of land that produces crops or livestock, which can be sold for a profit. This makes agriculture a reliable investment that is not subject to the volatility of the stock market.</p>

                                <p className={styles['desc_title']}>Why {import.meta.env.VITE_APP_NAME} is the Best Choice for Agricultural Investment</p>

                                <p><span className={styles['desc_title']}>Expertise</span> - {import.meta.env.VITE_APP_NAME} has a team of experts in agriculture, finance, and investment management. Our team has years of experience in the industry and is equipped with the knowledge and skills needed to identify and manage profitable agricultural investments.</p>

                                <p><span className={styles['desc_title']}>Sustainability </span> - At {import.meta.env.VITE_APP_NAME}, we believe in sustainable agriculture that benefits both our clients and the environment. We work with farmers who use sustainable farming practices to ensure that our investments are not only profitable but also environmentally responsible.</p>

                                <p><span className={styles['desc_title']}>Transparency </span> - We are committed to providing our clients with transparent and accurate information about their investments. We provide regular reports on the performance of our investments, as well as updates on any potential risks or challenges that may arise.</p>

                                <p><span className={styles['desc_title']}>Flexibility </span> - We offer a range of investment options to suit the needs of our clients. Whether you are looking for a short-term or long-term investment, we can provide you with a customized solution that meets your financial goals.</p>

                                <p className={styles['desc_title']}>Conclusion</p>

                                <p>Investing in agriculture is a smart choice for those who want to diversify their investment portfolio and potentially earn long-term returns. At {import.meta.env.VITE_APP_NAME}, we offer our clients the expertise, sustainability, transparency, and flexibility needed to make the most out of their agricultural investments. Contact us today to learn more about our investment opportunities and how we can help you achieve your financial goals.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHO WE ARE */}
                <div>
                    <WhoWeAre />
                </div>
                <div className='container'>
                    <CustomersComment />
                </div>
            </div>
        </>
    )
}

export default Agriculture;