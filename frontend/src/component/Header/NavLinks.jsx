import styles from '../../assets/css/PublicHeader.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleTranslateCustom from '../public/Translator';

const AllLinks = () => {
    const navigate = useNavigate();
    return (
        <>
            <NavLink to={'/user/dashboard'} onClick={(e) => {
                e.preventDefault();
                navigate('/user/dashboard');
                closeMobileMenu();
            }} end className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-grid px-2'></span> Dashboard</NavLink>

            <NavLink to={'/user/transaction'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-arrow-counterclockwise px-2'></span> Transaction</NavLink>

            <NavLink to={'/user/investment'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-graph-up px-2'></span> Investment</NavLink>

            <NavLink to={'/user/plans'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-basket px-2'></span> Our Plans</NavLink>

            <NavLink to={'/user/transfer'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-arrow-left-right px-2'></span> Transfer</NavLink>

            <NavLink to={'/user/referrals'} className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-person-add px-2'></span> Referral</NavLink>

            <NavLink to={'/user/profile'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: ``}><span className='bi bi-person-gear px-2'></span> My Profile</NavLink>
        </>
    )
}

export default AllLinks;