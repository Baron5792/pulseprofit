import { useEffect, useState } from "react";
import { useUser } from "../../../component/middleware/Authentication";
import DashboardWidget from "../../../component/Dashboard/TradingView";
import styles from '../../../assets/css/user/Dashboard.module.css';
import ScrollFadeIn from "../../../component/public/ScrollFadeIn";
import DashboardCarousel from "../../../component/Dashboard/Carousel";
import DashboardLineChart from "../../../component/Dashboard/LineChart";
import BitcoinImg from '../../../assets/images/featured/bitcoin.jpeg';
import { NavLink } from "react-router";
import { toast } from "react-toastify";
import RecentTransactions from "../../../component/Dashboard/Recent_Transactions";

const Dashboard = () => {
    const { user } = useUser();
    useEffect(() => {
        document.title = `Dashboard - ${import.meta.env.VITE_APP_NAME}`;
    }, [])

    const [input, setInput] = useState({
        email: ''
    })

    const handleReferalInput = (event) => {
        const { name, value } = event.target;
        setInput(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const [referBtn, setReferBtn] = useState(false);
    const handleEmail = async(event) => {
        event.preventDefault();
        setReferBtn(true);
        const isEmpty = Object.values(input).some(value => value.trim() === '');
        if (isEmpty) {
            toast.warning('An email address is required to proceed', {toastId: 'empty-field'});
            setTimeout(() => {
                setReferBtn(false);
            }, 3000)
            return;
        }

        // send email to user
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}create/create_referral_message.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            })

            const request = await response.json();
            if (request.status === 'success') {
                toast.info('Invitation sent!', {toastId: 'success'});
                setInput({
                    email: ''
                })
                setTimeout(() => {
                    setReferBtn(false);
                }, 3000)
            }

            else {
                setTimeout(() => {
                    setReferBtn(false);
                }, 3000)
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            setTimeout(() => {
                setReferBtn(false);
            }, 3000)
            toast.error(error.message || 'Something went wrong', {toastId: 'network-error'});
        }
    }
    const copyReferralLink = async() => {
        if (!user) {
            toast.error('User not authenticated', {toastId: 'not-authenticated'});
            return;
        }
        try {
            const RefLink = `${import.meta.env.VITE_APP_DOMAIN}=${user.referral_id}`;
            await navigator.clipboard.writeText(RefLink);
            toast.success('Your referral link has been copied successfully', {toastId: 'copied success'});
        }

        catch (error) {
            toast.error('Something went wrong');
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

    // 
    return (
        <>
            <div className="my-4">
                <DashboardWidget />  
            </div>

            {/* welcome user */}
            <ScrollFadeIn>
                <div className={styles['welcome_user']}>
                    {user && (
                        <p>Welcome back, {user.username}!</p>
                    )}
                    <p>We're glad to see you again.</p>
                </div>
            </ScrollFadeIn>

            <div className="row">
                {/* first row */}
                <div className="col-12 col-md-6 col-lg-6">
                    {/* Here's a summary of your account. Have fun! */}
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className="account_summary">
                            <p className={styles.summary_title}>Here's a summary of your account. Have fun!</p>
                            <div className={styles.carousel_container}>
                                <DashboardCarousel />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-12 col-lg-12 my-5">
                        {/* values would be executed in the line chart page */}
                        <DashboardLineChart />
                    </div>


                    {/* recent transaction */}
                    <RecentTransactions />
                </div>



                {/* second row */}
                <div className="col-12 col-md-6 col-lg-6 col-xl-6">
                    {/* refer users */}
                    <div className="col-12 col-md-12 col-lg-12 my-5">
                        <div className={styles['refer_user']}>
                            <p>Refer and earn from your referral's deposits.</p>
                            <p className="small text-secondary">
                                {import.meta.env.VITE_APP_DOMAIN}={user && (
                                    user.referral_id
                                )} 
                                <button type="button" onClick={copyReferralLink} className="btn btn-normal bi bi-copy small"></button>
                            </p>

                            <form method="POST" onSubmit={handleEmail}>
                                <input type="email" name="email" value={input.email} placeholder="Enter email address" className="form-control" id="email" onChange={handleReferalInput} />
                                <button disabled={referBtn} type="submit" className="form-control my-3">{referBtn ? 'Sending...': 'Invite Friends'}</button>
                            </form>

                            <p className="small my-3 text-info"><span className="bi bi-info-circle small text-info" title="Confirm inputed email to avoid spamming individuals"></span> Confirm inputed email to avoid spamming unknown individuals which could lead to violating our community rules and guidelines.</p>
                        </div>
                    </div>



                    {/* take a chance and earn a bitcoi */}
                    <div className="col-12 col-md-12 col-lg-12 my-5">
                        <div className="container-fluid">
                            <div className={`${styles['bitcoin_container']} row`}>
                                <div className={`${styles['bitcoin_text']} col-9 col-md-9 col-lg-9`}>
                                    <p>Take a chance and earn massively</p>
                                    <p>Start Earning Now. Deposit Today</p>
                                    <NavLink to={'/user/deposit'}>
                                        <button type="button" className="btn btn-normal">Learn more</button>
                                    </NavLink>
                                </div>
                                <div className={`${styles['bitcoin_img']} col-3 col-md-3 col-lg-3`}>
                                    <img src={BitcoinImg} alt="__blank" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;