import _ from 'lodash';

const categoryToColor = {
  'Food and Drinks': '#FF5733',
  Shopping: '#00CFCF',
  Housing: '#FF9F00',
  Transportation: '#30873B',
  'Life & Entertainment': '#672595',
  'Communication, PC': '#0059FF',
  'Financial expenses': '#33FF00',
  Investments: '#C70039',
  Income: '#FFC300',
  Others: '#5D5F5D',
};

interface Transaction {
  _id: string;
  email: string;
  transactionType: string;
  account: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

interface Expense {
  category: string;
  amount: number;
}

const extractExpenseData = (data?: [Transaction]) => {
  return _(data)
    .filter(function (transaction) {
      return transaction.transactionType === 'expense';
    })
    .groupBy('category')
    .map((transaction, id) => ({
      category: id,
      amount: _.sumBy(transaction, 'amount'),
    }))
    .value();
};

const getBackgroundColors = (expenseData: Expense[]) => {
  const backgroundColors = [];
  for (let expense of expenseData) {
    backgroundColors.push(
      categoryToColor[expense.category as keyof typeof categoryToColor]
    );
  }
  return backgroundColors;
};

const getData = (expenseData: Expense[]) => {
  const data = [];
  for (let expense of expenseData) {
    data.push(expense.amount);
  }
  return data;
};

const getLabels = (expenseData: Expense[]) => {
  const labels = [];
  for (let expense of expenseData) {
    labels.push(expense.category);
  }
  return labels;
};

export const getChartData = (data?: [Transaction]) => {
  const expenseData: Expense[] = extractExpenseData(data);

  const chartData = {
    labels: getLabels(expenseData),
    datasets: [
      {
        backgroundColor: getBackgroundColors(expenseData),
        data: getData(expenseData),
      },
    ],
  };

  return chartData;
};
