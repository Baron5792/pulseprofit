import { useEffect, useState } from 'react';
import styles from '../../../assets/css/user/Investment.module.css';
import { NavLink } from 'react-router';
import InvetedImg from '../../../assets/images/featured/investment.png';
import { toast } from 'react-toastify';

const Investment = () => {
    // fetch investment data here
    const [data, setData] = useState(null);
    const fetchInvestmentRecord = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/investment_record.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }

            else {
                toast.error(request.message || "Something went wrong", {toastId: 'something-error'});
                setData(null);
            }
        }

        catch (error) {
            toast.error("Something went wrong", {toastId: 'network-error'});
            setData(null);
        }
    }

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
        document.title = `Investment Summary - ${import.meta.env.VITE_APP_NAME}`;
        fetchInvestmentRecord();
    }, [])
    return (
        <>
            <div className={styles['invest_intro_cotainer']}>
                <p className={styles['investment_text']}>Investment</p>
            </div>

            <div className="row">
                <div className="col-12 col-md-12 col-lg-6">
                    <div className={styles['other_texts']}>
                        <p>Investment Plans</p>
                        <p>Here's a summary of your investment.</p>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-6">
                    <div className={`${styles['other_buttons']}`}>
                        <NavLink to={'/user/plans'}>
                            <button type="button">Invest & Earn <span className='bi bi-arrow-right small'></span></button>
                        </NavLink>
                        <NavLink to={'/user/deposit'}>
                            <button type="button">Deposit Funds <span className='bi bi-arrow-right small'></span></button>
                        </NavLink>  
                    </div>
                </div>
            </div>


            {/* categories */}
            <div className="row">
                <div className="col-12 col-md-12 col-lg-8">
                    <div className={styles['invested_account']}>
                        <div className={styles['seperator']}>
                            <div className={styles['invest_title']}>
                                <p>Amount Invested <span className='bi bi-info-circle small' title='Summary of your investment account'></span></p>
                            </div>
                            <div className="row">
                                <div className='col-12 col-md-12 col-lg-6'>
                                    <div className="row">
                                        <div className={`${styles['amount_display']} col-6 col-md-6 col-lg-6`}>
                                            {data && (
                                                <p>{formatCurrency(data.total_invested)} <span>USD</span></p>
                                            )}
                                            <p>Currently Invested</p>
                                        </div>
                                        <div className={`${styles['amount_display']} col-6 col-md-6 col-lg-6`}>
                                            <p>0.00</p>
                                            <p>Approx Profit</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-6">
                                    <img src={InvetedImg} className='w-100' alt="_blank" />
                                </div>
                            </div>
                        </div>
                        {/* footer */}
                        <div className={styles['investment_footer']}>
                            <NavLink to={'/user/transaction/investment'}>
                                <button type="button"><span className='bi bi-list-task'></span> Transaction History</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Investment;