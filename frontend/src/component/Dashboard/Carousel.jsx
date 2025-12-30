import styles from '../../assets/css/user/Dashboard.module.css';
import { Carousel } from 'react-bootstrap';
import { useUser } from '../middleware/Authentication';
import { useEffect } from 'react';

const DashboardCarousel = () => {
    const { user, refreshUser } = useUser();

    
    const formatCurrency = (amount) => {
        // 1. Convert the input to a number first, just in case it's a string
        const numericAmount = parseFloat(amount); 
        
        // 2. Check if the conversion resulted in a valid number
        if (isNaN(numericAmount)) {
            return 'N/A'; // Return a safe string instead of a crash/NaN
        }

        // 3. Perform the formatting
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        return numberFormatter.format(numericAmount);
    };

    useEffect(() => {
        setTimeout(() => {
            refreshUser();
        }, 4000)
    })
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <div className={styles['carousel_container']}>
                        <div className='d-flex justify-content-between'>
                            <p className={styles.carousel_title}>Available Balance</p>
                            <span title='MAIN ACCOUNT BALANCE' className='bi bi-info-circle small text-info mt-1'></span>
                        </div>

                        <div className={styles['carousel_balance']}>
                            {user && (
                                <p>{formatCurrency(user.balance)} <span>USD</span></p>
                            )}
                        </div>

                        <div className={styles['carousel_footer_title']}>
                            <p>INVESTMENT ACCOUNT</p>
                            <p>0 <span>USD</span></p>
                        </div>
                    </div>
                </Carousel.Item>    

                {/* total deposit */}
                <Carousel.Item>
                    <div className={styles['carousel_container']}>
                        <div className='d-flex justify-content-between'>
                            <p className={styles.carousel_title}>Total Deposit</p>
                            <span title='MAIN ACCOUNT BALANCE' className='bi bi-info-circle small text-info mt-1'></span>
                        </div>

                        <div className={styles['carousel_balance']}>
                            <p>{formatCurrency(user?.total_deposit)} <span>USD</span></p>
                        </div>

                        <div className={styles['carousel_footer_title']}>
                            <p>THIS MONTH</p>
                            <p>0 <span>USD</span></p>
                        </div>
                    </div>
                </Carousel.Item>  

                {/* total withdrawal */}
                <Carousel.Item>
                    <div className={styles['carousel_container']}>
                        <div className='d-flex justify-content-between'>
                            <p className={styles.carousel_title}>Total Withdrawal</p>
                            <span title='MAIN ACCOUNT BALANCE' className='bi bi-info-circle small text-info mt-1'></span>
                        </div>

                        <div className={styles['carousel_balance']}>
                            <p>{formatCurrency(user?.total_withdrawal)} <span>USD</span></p>
                        </div>

                        <div className={styles['carousel_footer_title']}>
                            <p>THIS MONTH</p>
                            <p><span>USD</span></p>
                        </div>
                    </div>
                </Carousel.Item>

                {/* profit earned */}
                <Carousel.Item>
                    <div className={styles['carousel_container']}>
                        <div className='d-flex justify-content-between'>
                            <p className={styles.carousel_title}>Total Profit Earned</p>
                            <span title='MAIN ACCOUNT BALANCE' className='bi bi-info-circle small text-info mt-1'></span>
                        </div>

                        <div className={styles['carousel_balance']}>
                            <p>{formatCurrency(user?.interest)} <span>USD</span></p>
                        </div>

                        <div className={styles['carousel_footer_title']}>
                            <p>THIS MONTH</p>
                            <p>0 <span>USD</span></p>
                        </div>
                    </div>
                </Carousel.Item> 
            </Carousel>
        </>
    )
}


export default DashboardCarousel;