import InterestImg from '../../../assets/images/featured/invest.png';
import styles from '../../../assets/css/Easy-way-to-invest.module.css';
import ScrollFadeIn from '../ScrollFadeIn';

export const WaytoInvest = () => {
    return (
        <>
            <div className={`${styles['main_container']} container-fluid`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-6">
                            <div className={styles['invest_img']}>
                                <img src={InterestImg} alt="_blank" className='w-100' />
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-6">
                            <div className={`${styles['invest_texts']}`}>
                                <p>An easy way to invest for your future</p>
                                <div className="d-flex">
                                    <div className={styles['tiny-line']}></div>
                                    <ScrollFadeIn>
                                        <span className={`${styles['tiny_line_text']} mx-3`}> ...always you before us.</span>
                                    </ScrollFadeIn>
                                </div>
                                <p>By offering you a transparent means of earning extra as you put your digital assets to work through investment banking portfolio, we are here to help you put your first foot forward on your biggest financial journey to greatness notwithstanding your level of knowledge in the crypto market and hemisphere.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
