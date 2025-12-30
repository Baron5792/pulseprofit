import { NavLink, Outlet } from 'react-router';
import styles from '../../../assets/css/user/Deposit.module.css';
const DepositHeader = () => {
    return (
        <>  
            <div className={`${styles['deposit_header']}`}>
                <NavLink to={'/user/deposit'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`} onClick={(event) => {
                    event.preventDefault();
                }}>
                    <span className="bi bi-dot fs-4"></span>
                </NavLink>
                <NavLink to={'/user/deposit/deposit_form'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`} onClick={(event) => {
                    event.preventDefault();
                }}>
                    <span className="bi bi-dot fs-4"></span>
                </NavLink>
                <NavLink to={`/user/deposit/confirm`} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`} onClick={(event) => {
                    event.preventDefault();
                }}>
                    <span className="bi bi-dot fs-4"></span>
                </NavLink>
                {/* <NavLink to={'/user/deposit/deposit_completion'} end className={({ isActive }) => isActive ? `${styles['active']}`: `${styles['inactive']}`} onClick={(event) => {
                    event.preventDefault();
                }}>
                    <span className="bi bi-dot fs-4"></span>
                </NavLink> */}
            </div>

            <div className={styles['deposit_container']}>
                <Outlet />
            </div>
        </>
    )
}

export default DepositHeader;