import styles from '../../assets/css/account/AccountLayout.module.css';
import { NavLink, Outlet } from "react-router";
import Logo from '../../assets/images/logo/image.png';
import { PublicFooter } from './partials/Footer';

const AccountLayout = () => {
    return (
        <>
            <div className={`${styles['account-layout']} container-fluid`}>
                {/* conatainer width */}
                <div className={styles['container']}>
                    <header>
                        {/* logo here */}
                        <div className={styles['logo']}>
                            <NavLink to={'/'}>
                                <img src={Logo} alt="__blank" />
                            </NavLink>
                        </div>     
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
            <div>
                <PublicFooter />
            </div>
        </>
    )
}

export default AccountLayout;