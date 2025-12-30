import React from 'react';
import { Line } from 'react-chartjs-2';
import { useUser } from '../middleware/Authentication';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function InvestmentProgressChart({ 
  totalDeposit = 0, 
  totalWithdrawal = 0, 
  totalProfit = 0 
}) {

  // Calculate current balance
  const currentBalance = totalDeposit - totalWithdrawal + totalProfit;

  // Sample data - in real app, this would come from your API
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  
  // Generate sample data based on user inputs
  const generateChartData = () => {
    const baseDeposit = totalDeposit / months.length;
    const baseWithdrawal = totalWithdrawal / months.length;
    const baseProfit = totalProfit / months.length;
    
    const depositData = [];
    const withdrawalData = [];
    const profitData = [];
    const balanceData = [];
    
    let runningBalance = 0;
    
    months.forEach((month, index) => {
      const deposit = index === 0 ? totalDeposit * 0.2 : baseDeposit * (0.8 + Math.random() * 0.4);
      const withdrawal = index === months.length - 1 ? totalWithdrawal * 0.3 : baseWithdrawal * (0.7 + Math.random() * 0.6);
      const profit = baseProfit * (0.5 + Math.random());
      
      runningBalance += deposit - withdrawal + profit;
      
      depositData.push(parseFloat(deposit.toFixed(2)));
      withdrawalData.push(parseFloat(withdrawal.toFixed(2)));
      profitData.push(parseFloat(profit.toFixed(2)));
      balanceData.push(parseFloat(runningBalance.toFixed(2)));
    });

    return { depositData, withdrawalData, profitData, balanceData };
  };

  const { depositData, withdrawalData, profitData, balanceData } = generateChartData();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Total Balance',
        data: balanceData,
        borderColor: '#2C7DFF',
        backgroundColor: 'rgba(44, 125, 255, 0.1)',
        borderWidth: 1,
        fill: true,
        tension: 0.9,
        pointBackgroundColor: '#2C7DFF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
      {
        label: 'Deposits',
        data: depositData,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        tension: 0.9,
        pointBackgroundColor: '#28a745',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Withdrawals',
        data: withdrawalData,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.9,
        pointBackgrou9dColor: '#dc3545',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Profits',
        data: profitData,
        borderColor: '#F4BD0E',
        backgroundColor: 'rgba(244, 189, 14, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.9,
        pointBackgroundColor: '#F4BD0E',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: 0
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(value);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const { user } = useUser();
  return (
   
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          {/* Summary Stats */}

          {/* Chart */}
          <div style={{ height: '200px' }}>
            <Line data={chartData} options={options} />
          </div>

          {/* Additional Info */}
          {/* <div className="mt-3 pt-3 border-top">
            <div className="row text-center">
              <div className="col-4">
                <small className="text-muted">Net Growth</small>
                <div className="small fw-bold text-success">
                  +{((totalProfit / totalDeposit) * 100 || 0).toFixed(1)}%
                </div>
              </div>
              <div className="col-4">
                <small className="text-muted">Active Since</small>
                <div className="small fw-bold">{user && user.date ? new Date(user.date).getFullYear() || 'N/A': 'N/A'}</div>
              </div>
              <div className="col-4">
                <small className="text-muted">ROI</small>
                <div className="small fw-bold text-primary">
                  {((totalProfit / (totalDeposit - totalWithdrawal)) * 100 || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
  );
}

export default InvestmentProgressChart;