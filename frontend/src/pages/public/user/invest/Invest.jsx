import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Invest.module.css';
import { toast } from 'react-toastify';
import { useUser } from '../../../../component/middleware/Authentication';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';
import { useNavigate } from 'react-router';

export const Invest = () => {
    // fetch last plan of user
    const [data, setData] = useState(null);
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();
    const { user } = useUser();
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
            }
        }

        catch (error) {
            toast.error('Something went wrong!', {toastId: 'network-error'});
        }
    }


    // for form submission
    const [formData, setFormData] = useState({
        amount: ''
    })

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const requiredFields = ['amount'];

    const handleSubmit = async(e) => {
        e.preventDefault();
        // check for empty fields
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.warning('Please fill in all required fields', {toastId: 'required-fields'});
                return;
            }
        }

        if (!data || !data.plan_id) {
            toast.warning('No investment plan selected', {toastId: 'no-plan-selected'});
            return;
        }

        const amount = Number(formData.amount);
        if (amount < Number(data.min) || amount > Number(data.max)) {
            toast.warning('Please enter an amount within the specified range', {toastId: 'amount-out-of-range'});
            return;
        }

        try {
            const submitResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}update/plan_selected.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ 
                    amount: Number(formData.amount), 
                    planId: data.plan_id,
                    uniqId: data.uniqId
                })
            })

            const submitRequest = await submitResponse.json();
            if (submitRequest.status === 'success') {
                toast.info('Congratulations! One last step required to complete your investment', {toastId: 'investment-successful'});
                navigate('/user/invest/confirm_Investment');
            }

            else {
                toast.error(submitRequest.message || 'Something went wrong', {toastId: 'error-occured'});
            }
        }

        catch(error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }

    useEffect(() => {
        document.title = `Invest & Earn - ${import.meta.env.VITE_APP_NAME}`;
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
                {data && (
                    <p>Invest on {data.title} Plan</p>
                )}
                <p>Entry level of investment & earn money.</p>
            </div>

            {/* all data here */}
            <div className={styles['title']}>
                <p>Invested Plan</p>
            </div>

            {/* plan display */}
            <div className={styles['plan_container']}>
                <div className="d-flex">
                    <div className={styles['plan_icon']}>
                        <span className='bi bi-tags-fill'></span>
                    </div>
                    <div className={`${styles['plan_details']} px-3`}>
                        {data && (
                            <p>{data.title} Plan</p>
                        )}

                        {data && (
                            <p>Invest for {data.term} weeks & earn daily {data.daily_interest}% as profit.</p>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* amount inputed */}
                <div className={styles['inputed_amount']}>
                    <div className={styles['title']}>
                        <p>Enter your amount</p>
                    </div>

                    <div className={styles['amount_input']}>
                        {data && (
                            <div className="input-group">
                                <input type="number" name='amount' onChange={handleInput} placeholder={data.min} className='form-control' />
                                <span className="input-group-text bg-white text-secondary">USD</span>
                            </div>
                        )}
                        {data && (
                            <div className={styles['min_max']}>
                                <span>Minimum: {formatCurrency(data.min)} USD</span>
                                <span>Maximum: {formatCurrency(data.max)} USD</span>
                            </div>
                        )}
                    </div>
                </div>



           

                {/* plan display */}
                <div className={styles['inputed_amount']}>
                    {/* main balance */}
                    <div className={styles['title']}>
                        <p>Payment Acount</p>
                    </div>
                    <div className={styles['plan_container']}>
                        <div className="d-flex">
                            <div className={styles['plan_icon']}>
                                <span className='bi bi-wallet'></span>
                            </div>
                            { user ? (
                                <div className={`${styles['plan_details']} px-3`}>
                                    <p>Main Balance</p>
                                    <p>Current Balance: {formatCurrency(user.balance)} USD</p>
                                </div>
                            ): (
                                null
                            ) }
                            
                        </div>
                    </div>
                </div>


                {/* button submit */}
                <div className={`${styles['submit_btn']}`}>
                    <button type="submit" className='form-control btn btn-primary'>Continue to Invest</button>
                    <span>By clicking on the button above you accept to our investment terms and conditions</span>
                </div>
            </form>
        </>
    )
}