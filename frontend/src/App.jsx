import { Routes, Route } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';   

// for public routes
import PublicLayout from './component/public/Layout'; 
import Home from './pages/public/Home';
import AccountLayout from './component/public/AccountLayout';
import PublicRegister from './pages/public/account/Register';
import { PublicLogin } from './pages/public/account/Login';
import Contact from './pages/public/Contact';
import OurPlans from './pages/public/Our_Plans';
import AboutUs from './pages/public/About_us';
import Dashboard from './pages/public/user/Dashboard';
import { UserHeader } from './component/user/partials/UserHeader';
import ProfileLayout from './component/user/ProfileLayout';
import Profile from './pages/public/user/profile/Profile';
import DepositHeader from './component/user/partials/DepositHeader';
import Deposit from './pages/public/user/Deposit/Deposit';
import DepositForm from './pages/public/user/Deposit/DepositForm';
import DepositConfirm from './pages/public/user/Deposit/DepositConfirm';
import { Transaction } from './pages/public/user/Transaction';
import Investment from './pages/public/user/Investment';
import { History } from './pages/public/user/transaction/History';
import { TransactionDeposit } from './pages/public/user/transaction/Deposit';
import { Plans } from './pages/public/user/Plans';
import { InvestHeader } from './component/user/InvestHeader';
import { Invest } from './pages/public/user/invest/Invest';
import ConfirmInvestment from './pages/public/user/invest/Investment_Confirm';
import InvestmentTransaction from './pages/public/user/transaction/Investment';
import Faq from './pages/public/Faq';
import Withdraw from './pages/public/user/withdrawal/Withdraw';
import Security from './pages/public/user/profile/Security';
import Activity from './pages/public/user/profile/Activity';
import WithdrawWallet from './pages/public/user/withdrawal/Withdraw_wallet';
import WithdrawalForm from './pages/public/user/withdrawal/Withdraw_Form';
import WithdrawalHistory from './pages/public/user/transaction/Withdrawal';
import Transfer from './pages/public/user/transfer/Transfer';
import AdminHeader from './component/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDeposit from './pages/admin/Deposit';
import ManageUsers from './pages/admin/Manage_users';
import Services from './pages/public/Services';
import RealEstate from './pages/public/services/Real_estate';
import GoldInvestment from './pages/public/services/Gold-Investment';
import ResetPassword from './pages/public/account/password/Reset-Password';
import Agriculture from './pages/public/services/Agriculture';
import Cryptocurrency from './pages/public/services/Cryptocurrency';
import TransferWallet from './pages/public/user/transfer/Transfer-Wallet';
import TransferForm from './pages/public/user/transfer/TransferForm';
import TransferDetails from './pages/public/user/transfer/Transfer-Details';
import TransferCompletion from './pages/public/user/transfer/Transfer-Completion';
import Referral from './pages/public/user/Referral';
import ContactUs from './pages/admin/Contact';

// for auth routes
function App() {
  return (
    <>
      <Routes>
        {/* layout for public users */}
        <Route element={<PublicLayout />} path='/'>
          <Route element={<Home />} index />
          <Route element={<Contact />} path='contact' />
          <Route element={<OurPlans />} path='our_plans' />
          <Route element={<AboutUs />} path='about' />
          <Route element={<Faq />} path='faq' />
          <Route element={<Services />} path='services' />

          {/* for services pages */}
          <Route element={<RealEstate />} path='real-estate' />
          <Route element={<GoldInvestment />} path='gold-investment' />
          <Route element={<Agriculture />} path='agriculture' />
          <Route element={<Cryptocurrency />} path='cryptocurrency' />
        </Route>

      

        {/* login and regsietr */}
        <Route element={<AccountLayout />} path='/account'>
          <Route element={<PublicRegister />} path='register' />
          <Route element={<PublicLogin />} path='login' />
          <Route element={<ResetPassword />} path='password/reset-password' />
        </Route>


          {/* for logged in users */}
          <Route element={<UserHeader />} path='/user'>
              <Route element={<Dashboard />} path='dashboard' />
              <Route element={<Investment />} path='investment' />
              <Route element={<Plans />} path='plans' />
              <Route element={<Referral />} path='referrals' />

              {/* route for transfer */}
              <Route element={<Transfer />} path='transfer'>
                <Route element={<TransferWallet />} index />
                <Route element={<TransferForm />} path='transfer-form' />
                <Route element={<TransferDetails />} path='transfer-details' />
                <Route element={<TransferCompletion />} path='transfer-completion' />
              </Route>

              {/* route for transaction */}
              <Route element={<Transaction />} path='transaction'>
                <Route element={<History />} index />
                <Route element={<TransactionDeposit />} path='deposit' />
                <Route element={<InvestmentTransaction />} path='investment' />
                <Route element={<WithdrawalHistory />} path='withdraw' />
              </Route>

              {/* for investment */}
              <Route element={<InvestHeader />} path='invest'>
                <Route element={<Invest />} index />
                <Route element={<ConfirmInvestment />} path='confirm_Investment' />
              </Route>

              {/* route my profile here */}
              <Route element={<ProfileLayout />} path='profile'>
                  <Route element={<Profile />} index />
                  <Route element={<Security />} path='security' />
                  <Route element={<Activity />} path='activity' />
              </Route>


              {/* for withdrawal */}
              <Route element={<Withdraw />} path='withdraw'>
                  <Route element={<WithdrawWallet />} index />
                  <Route element={<WithdrawalForm />} path='withdrawal_form' />
              </Route>

              {/* for deposits */}
              <Route path='deposit' element={<DepositHeader />}>
                  <Route index element={<Deposit />} />
                  <Route path='deposit_form' element={<DepositForm />} />
                  <Route path='confirm' element={<DepositConfirm />} />
              </Route>
          </Route>



          {/* for admin users */}
          <Route element={<AdminHeader />} path='/admin'>
            <Route element={<AdminDashboard />} index  />
            <Route element={<AdminDeposit />} path='deposit' />
            <Route element={<ManageUsers />} path='manage_users' />
            <Route element={<ContactUs />} path='contact_us' />
          </Route>
      </Routes>

      

      <ToastContainer 
          position="bottom-center" // position
          autoClose={4000} // Close after 4 seconds
          hideProgressBar={false} 
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />
    </>
  )
}


export default App;
