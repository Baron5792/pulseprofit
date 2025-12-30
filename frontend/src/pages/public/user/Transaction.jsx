import { NavLink, Outlet } from 'react-router';
import styles from '../../../assets/css/user/Transaction.module.css';
import { useState, useCallback, useEffect } from 'react';
export const Transaction = () => {

    return (
        <>
            <div className={`${styles['intro_container']} row`}>
                <div className={`${styles['intro_text']} col-12 col-md-12 col-lg-10`}>
                    <p>History</p>
                    <p>Transactions</p>
                    <p>List of transactions in your account.</p>
                </div>
                <div className={`${styles['deposit_btn']} col-7 col-md-7 col-lg-2`}>
                    <NavLink to={'/user/deposit'}>
                        <button type="button" className=''>Deposit <span className='bi bi-arrow-right small'></span></button>
                    </NavLink>
                </div>
            </div>

            {/* search transactions */}
            

            <div className={styles['nav_links']}>
                <NavLink to={'/user/transaction'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>History</NavLink>

                <NavLink to={'/user/transaction/deposit'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Deposit</NavLink>

                <NavLink to={'/user/transaction/withdraw'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Withdraw</NavLink>

                <NavLink to={'/user/transaction/investment'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Investment</NavLink>
            </div>

            {/* transactions here */}
           <Outlet />
        </>
    )
}