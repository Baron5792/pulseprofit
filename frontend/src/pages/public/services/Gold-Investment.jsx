import { useEffect } from "react";
import HeroImg from '../../../assets/images/services/gold.jpeg';
import styles from '../../../assets/css/Gold.module.css';
import WhoWeAre from "../../../component/public/Home/Who-we-are";
import CustomersComment from "../../../component/public/Home/Comment";
import GoogleTranslateCustom from "../../../component/public/Translator";

const GoldInvestment = () => {

    useEffect(() => {
        document.title = `Gold Investment - ${import.meta.env.VITE_APP_NAME}`;
    })

    return (
        <>
            <div className={styles['hero_main_container']}>
                <div className={styles['hero_img']}>
                    <img src={HeroImg} alt="__blank" />
                </div>
                <div className={styles['hero_text']}>
                    <p>GOLD <span>INVESTMENT</span></p>
                    <div className={styles['tiny-line']}></div>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
            </div>

            <div className={styles['body_container']}>
                <div className={styles['title']}>
                    <p>ABOUT US</p>
                </div>

                <div className={styles['title_description']}>
                    <div className="container">
                        <p>Investing in gold has been a long-standing tradition for many investors seeking to diversify their portfolios and protect their wealth. In today’s uncertain economic climate, the value of gold has continued to rise, making it a lucrative investment opportunity for those looking to grow their wealth. As a leading provider of gold investment solutions, {import.meta.env.VITE_APP_NAME} is committed to helping our clients achieve their financial goals through investing in gold. In this article, we will explore the reasons why investing in gold is a smart choice and why {import.meta.env.VITE_APP_NAME} is the best company for your gold investment needs.</p>

                        <p>Why invest in gold?</p>

                        <p>There are several compelling reasons why investors should consider adding gold to their investment portfolio. Firstly, gold is a tangible asset that has intrinsic value, which makes it a reliable store of value. Unlike paper currency or digital assets, gold cannot be printed or created out of thin air, which means its value is not subject to inflation or market volatility. Gold has been used as a currency and store of value for thousands of years, and its enduring value is a testament to its durability as an investment asset.</p>

                        <p>Secondly, gold has a low correlation with other asset classes such as stocks, bonds, and real estate, which makes it an excellent diversification tool. By adding gold to your portfolio, you can reduce your overall portfolio risk and improve its overall performance. During times of market turmoil or economic uncertainty, gold often performs well as a safe haven asset, which means it can help protect your portfolio from losses.</p>

                        <p>Lastly, gold has historically been an excellent hedge against inflation. As the value of paper currency declines, the value of gold tends to rise.</p>
                    </div>


                </div>

                <WhoWeAre />
                <CustomersComment />
            </div>
        </>
    )
}

export default GoldInvestment;