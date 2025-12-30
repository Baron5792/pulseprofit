import { useEffect, useState } from "react";
import styles from '../../../../assets/css/user/Invest.module.css';
import { useCsrfToken } from "../../../../component/middleware/Csrf-token";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ConfirmInvestment = () => {

    const [data, setData] = useState(null);
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();
    const fetchTrack = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/check_plan.php`, {
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
                toast.error(request.message || "Something went wrong");
                setData(null);
            }
        }

        catch (error) {
            toast.error('Something went wrong!', {toastId: 'network-error'});
            setData(null);
        }
    }


    // finalize operation
    const handleOperation = async() => {
        if (!data || !data.uniqId || !data.plan_id) {
            toast.error('No investment plan selected', {toastId: 'no-plan-selected'});
            return;
        }
        try {
            const submitOperation = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/finalize_investment.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    uniqId: data.uniqId,
                    planId: data.plan_id,
                    amount: data.amount,
                    title: data.title,
                    daily_interest: data.daily_interest,
                    total_return: data.profit + data.amount,
                })
            })

            const submitResponse = await submitOperation.json();
            if (submitResponse.status === 'success') {
                toast.success(submitResponse.message || "Investment successful");
                navigate('/user/transaction/investment');
            }
        }

        catch(error) {
            toast.error('Something went wrong!', {toastId: 'network-error'});
        }
    }


    useEffect(() => {
        document.title = `Confirm Investment - ${import.meta.env.VITE_APP_NAME}`;
        fetchTrack();
        refreshCsrfToken();
    }, [])

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


    return (
        <>
            <div className={styles['investment_intro']}>
                <p>Confirm Your Investment</p>
                <p>Please review your investment plan details and confirm</p>
            </div>

            {/* display plan title */}
            <div className={styles['plan_con']}>
                <div className="row">
                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        <p>Plan Name</p>
                        {data && (
                            <p>{data.title}</p>
                        )}
                    </div>
                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        <p>Duration</p>
                        {data && (
                            <p>{data.term} Weeks</p>
                        )}
                    </div>
                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        <p>Daily Profit</p>
                        {data && (
                            <p>{data.daily_interest}%</p>
                        )}
                    </div>
                </div>
            </div>


            {/* plan_display */}
            {data && (
                <>
                    <div className={styles['plan_display']}>
                        <div className={styles['plan_info']}>
                            <p>Payment Account</p>
                            <p><span className="bi bi-wallet"></span> Main Balance</p>
                        </div>
                        {/* amount to invest */}
                        <div className={styles['plan_info']}>
                            <p>Amount to Invest</p>
                            <p>{formatCurrency(data.amount)} USD</p>
                        </div>
                        {/* profit */}
                        <div className={styles['plan_info']}>
                            <p>Total Profit to Earn</p>
                            <p>{formatCurrency(data.profit)} USD</p>
                        </div>
                        {/* total return */}
                        <div className={styles['plan_info']}>
                            <p>Total Return</p>
                            <p>{formatCurrency(data.profit + data.amount)} USD</p>
                        </div>
                    </div>

                    <div className={styles['plan_display']}>
                        <div className={styles['plan_info']}>
                            <p>Amount to debit</p>
                            <p>{formatCurrency(data.amount)} USD</p>
                        </div>
                    </div>

                    <span className={styles['conclusion']}>*The amount will be deducted immediately from your account balance once you confirm.</span>

                    <div className={`${styles['submit_btn']}`}>
                        <button type="button" onClick={handleOperation} className='form-control btn btn-primary'>Confirm & Proceed</button>
                    </div>
                </>
            )}
        </>
    )
}

export default ConfirmInvestment;