import { useEffect, useState } from 'react';
import styles from '../../../assets/css/user/Plans.module.css';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';
import { useCsrfToken } from '../../../component/middleware/Csrf-token';
import { useNavigate } from 'react-router';

export const Plans = () => {
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();
    // fetch plans
    const [plans, setPlans] = useState(null);
    const fetchPlans = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/fetch_plans.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                    setPlans(request.data);
            }

            else {
                toast.error(request.message || "Something went wrong");
            }
        }

        catch (error) {
            toast.error("Something went wrong", {toastId: 'network-error'});
            setPlans(null);
        }
    }

    const handleSelectedPlan = async(selectedPlan) => {
        try {
            const submitResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/plan_eligibility.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ uniqId: selectedPlan })
            })

            const submitRequest = await submitResponse.json();
            if (submitRequest.status === 'success') {
                navigate('/user/invest');
                toast.info(`Congrats, you've successfully selected an investment plan.`);
            }

            else {
                toast.error(submitRequest.message || 'Something went wrong', {toastId: 'error-occured'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }

    useEffect(() => {
        document.title = `Our Plans - ${import.meta.env.VITE_APP_NAME}`;
        fetchPlans();
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
            <div className={styles['plans_intro']}>
                <p>Investment Plans</p>
                <p>Here are our several investment plans. You can invest daily, weekly or monthly and get higher returns in your investment.</p>
                <p>Choose your favourite plan and start earning now.</p>
            </div>

            {/* for every plan */}
            <div className={`${styles['all_plans']} row`}>
                    {plans && plans.length > 0 ? (
                        plans.map((item) => (
                            <div className="col-12 col-md-12 col-lg-4" key={item.uniqId}>
                                <div className={styles['plan_main_container']}>
                                    <div className={styles['plan_title']}>
                                        <p>{item.title}</p>
                                    </div>
                                    <div className={styles['rate']}>
                                        <div className="d-flex justify-content-between">
                                            <div className={styles['rate_amount']}>
                                                <p>{item.daily_interest}%</p>
                                                <p>Daily Interest</p>
                                            </div>
                                            <div className={styles['rate_amount']}>
                                                <p>{item.term}</p>
                                                <p>Term Weeks</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* plan details */}
                                    <div className={styles['plan_details']}>
                                        <div className={`${styles['plan_details']} row`}>
                                            <div className="col-4 col-md-4 col-lg-4">Min Deposit</div>
                                            <div className="col-4 col-md-4 col-lg-4">-</div>
                                            <div className="col-4 col-md-4 col-lg-4 fw-bold">{formatCurrency(item.min)} USD</div>
                                        </div>
                                        <div className={`${styles['plan_details']} row`}>
                                            <div className="col-4 col-md-4 col-lg-4">Max Deposit</div>
                                            <div className="col-4 col-md-4 col-lg-4">-</div>
                                            <div className="col-4 col-md-4 col-lg-4">{formatCurrency(item.max)} USD</div>
                                        </div>
                                        <div className={`${styles['plan_details']} row`}>
                                            <div className="col-4 col-md-4 col-lg-4">Capital Return</div>
                                            <div className="col-4 col-md-4 col-lg-4">-</div>
                                            <div className="col-4 col-md-4 col-lg-4">Each Term</div>
                                        </div>
                                        <div className={`${styles['plan_details']} row`}>
                                            <div className="col-4 col-md-4 col-lg-4">Total Return</div>
                                            <div className="col-4 col-md-4 col-lg-4">-</div>
                                            <div className="col-4 col-md-4 col-lg-4">{item.total_return}%</div>
                                        </div>
                                    </div>
                                    {/* plan button */}
                                    <div className={styles['plan_submit_btn']}>
                                        <button onClick={() => {
                                            handleSelectedPlan(item.uniqId)
                                        }} type="button">Invest Now</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ): (
                        <div className='alert alert-info'>
                            <span className='text-center small'>No active plans found</span>
                        </div>
                    )}
            </div>
        </>
    )
}