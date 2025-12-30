import { NavLink, Outlet } from 'react-router';
import styles from '../../../../assets/css/user/Withdraw.module.css';

const Withdraw = () => {
    return (
        <>
            <div className={styles['withdraw_container']}>
                {/* icon track */}
                <div className={styles['icon_track']}>
                    <NavLink to={'/user/withdraw'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                    <NavLink to={'/user/withdraw/withdrawal_form'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                </div>
                
                <Outlet />
            </div>
        </>
    )
}

export default Withdraw;