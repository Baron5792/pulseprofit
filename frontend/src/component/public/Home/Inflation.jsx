import styles from '../../../assets/css/Inflation.module.css';
import ScrollFadeIn from '../ScrollFadeIn';
import InflationImg from '../../../assets/images/featured/inflation.png';

const Inflation = () => {
    return (
        <>
            <div className={`${styles['main_container']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className={`${styles['inflationText']} col-12 col-md-12 col-lg-6`}>
                            <div className="d-flex">
                                <div className={styles['tiny-line']}></div>
                                <ScrollFadeIn>
                                    <span className={`${styles['tiny_line_text']} mx-3`}> {import.meta.env.VITE_APP_NAME} could help you beat this.</span>
                                </ScrollFadeIn>
                            </div>
                            <div className={styles.Inflation_hero_text}>
                                <p>What's inflation doing to your money?</p>
                                <p>In a financial landscape facing volatility and inflationary pressure, our priority is strategic asset preservation. We provide meticulously crafted, long-term plans designed to mitigate risk and actively work toward maintaining the purchasing power of your capital. Partner with us to ensure your assets are positioned for stability and resilient value.</p>
                            </div>
                        </div>
                        <div className={`col-12 col-md-12 col-lg-6`}>
                            <div className={styles['inflationImg']}>
                                <img src={InflationImg} alt="__blank" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inflation;