import InvestmentProgressChart from './InvestmentProgressChart';
import { useUser } from '../middleware/Authentication';
import { useEffect } from 'react';

function DashboardLineChart() {
  const { user, refreshUser } = useUser();
  // These values would typically come from your API/state
  useEffect(() => {
    refreshUser();
  }, [])

  const userStats = {
    totalDeposit: user?.total_deposit,    // $15,000 total deposited
    totalWithdrawal: user?.total_withdrawal,  // $3,000 total withdrawn
    totalProfit: user?.interest       // $2,500 total profit
  };

  return (
    <>
        {/* Line Chart Component */}
        <InvestmentProgressChart 
          totalDeposit={userStats.totalDeposit}
          totalWithdrawal={userStats.totalWithdrawal}
          totalProfit={userStats.totalProfit}
        />
    </>
  )
}

export default DashboardLineChart;