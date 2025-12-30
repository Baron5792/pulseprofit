import { useEffect, useState } from "react";
import styles from "../../../assets/css/user/Referral.module.css";
import { useUser } from "../../../component/middleware/Authentication";
import { toast } from "react-toastify";
import UnknowImg from '../../../assets/images/avatar/unknown.jpeg';

const Referral = () => {
    const { user, refreshUser } = useUser();

    const [data, setData] = useState(null);
    const fetchReferrals = async () => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/referrals.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }

            else {
                setData(null);
                toast.error(request.message || 'Something went wrong', {toastId: 'something'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'something-error'});
            setData(null);
        }
    }

    useEffect(() => {
        document.title = `Referrals - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
        fetchReferrals();
    }, [])

    const copyLink = (referral_id) => {
        const referralLink = `${import.meta.env.VITE_APP_DOMAIN}=${referral_id}`;
        try {
            navigator.clipboard.writeText(referralLink);
            toast.info('Referral link copied successfully', {toastId: 'success'});
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'something-error'});
        }
    }

    return (
        <>
            <div>
                <div className={styles['referral_header']}>
                    <p><span className="bi bi-people"></span> Referrals</p>
                    <p>Invite friends to join our community and earn attractive rewards!</p>
                </div>

                <div className={styles['referral_title']}>
                    <p>How it Works</p>
                    <ol>
                        <li>Share your unique referral link with friends and family.</li>
                        <li>When they sign up and make a deposit, you'll receive a referral reward.</li>
                        <li>Earn interest on your reward, and watch your earnings grow!</li>
                    </ol>
                </div>

                <div className={styles['referral_title']}>
                    <p>Start Referring Now!</p>
                    <p>Share your referral link:</p>
                </div>

                <div className={styles['referral_link']}>
                    {user && (
                        <p><span className="bi bi-share-fill"></span> {import.meta.env.VITE_APP_DOMAIN}={user.referral_id} <span className="bi bi-files" onClick={() => copyLink(user.referral_id)}></span></p>
                    )}
                </div>
            </div>

            <div className={styles['table_container']}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th>Full Name <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>E-Mail <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Date <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}.</td>
                                    <td><img src={item.avatar && item.avatar.length > 1 ? import.meta.env.VITE_APP_AVATAR + item.avatar: UnknowImg} alt="_blank" /></td>
                                    <td>{item.fullname}</td>
                                    <td>{item.email && item.email.length > 20 ? item.email.slice(0, 20) + '...': item.email}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={7}>
                                    No referrals found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Referral;