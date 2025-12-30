import styles from '../../assets/css/user/Invest.module.css';
import { NavLink, Outlet } from "react-router"

export const InvestHeader = () => {
    return (
        <>
            <div className={styles['dots']}>
                <NavLink to={'/user/invest'} end className={({isActive}) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>
                    <span className='bi bi-dot fs-4'></span>
                </NavLink>
                <NavLink to={'/user/invest/confirm_Investment'} end className={({isActive}) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>
                    <span className='bi bi-dot fs-4'></span>
                </NavLink>
            </div>

            <div className={styles['main_container']}>
                <Outlet />
            </div>
        </>
    )
}