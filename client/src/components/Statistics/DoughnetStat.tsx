import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { default as api } from '../../store/apiSlice';
import { getChartData } from '../../utils/statistics';

ChartJS.register(ArcElement, Tooltip);

const DoughnetStat = () => {
  let transactions;
  const { data, isFetching, isSuccess, isError } =
    api.useGetTransactionsByDateQuery({
      timeSpan: 'Month',
      date: 'December',
    });
  if (isFetching) {
  } else if (isSuccess) {
    const { transactions: tx } = data;
    transactions = tx;
  } else if (isError) {
  }

  const chartData = getChartData(transactions);
  return (
    <div style={{ maxWidth: 500 }}>
      <Doughnut data={chartData} />
    </div>
  );
};

export default DoughnetStat;
