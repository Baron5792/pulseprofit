import styles from '../../../../assets/css/user/Transfer.module.css';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router';

const Transfer = () => {
    const disAbleAccess = (event) => {
        event.preventDefault();
    }
    return (
        <>
            <div className={styles['withdraw_container']}>
                {/* icon track */}
                <div className={styles['icon_track']}>
                    <NavLink to={'/user/transfer'} onClick={disAbleAccess} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                    <NavLink to={'/user/transfer/transfer-form'} onClick={disAbleAccess} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                    <NavLink to={'/user/transfer/transfer-details'} onClick={disAbleAccess} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                    <NavLink to={'/user/transfer/transfer-completion'} onClick={disAbleAccess} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['inActive']}`}>
                        <span className="bi bi-dot"></span>
                    </NavLink>
                </div>
                
                <Outlet />
            </div>
        </>
    )
}

export default Transfer;