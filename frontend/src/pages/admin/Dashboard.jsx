import { useEffect } from 'react';
import styles from '../../assets/css/admin/Dashboard.module.css';
import { useUser } from '../../component/middleware/Authentication';
import DashboardOverview from '../../component/admin/DasboardOverview';

const AdminDashboard = () => {
    const {user, refreshUser} = useUser();
    useEffect(() => {
        document.title = `Admin Dashboard - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    })
    return (
        <>
            <div className={styles['page_title']}>
                <p>Dashboard Overview</p>
            </div>

            <DashboardOverview />


            {/* intro user */}
            <div className={styles['inroduce_user']}>
                <p>Welcome,</p>
                {user && (
                    <p>{user.fullname}</p>
                )}
            </div>

            

            {/* lastest transactions */}
            
        </>
    )
}

export default AdminDashboard;