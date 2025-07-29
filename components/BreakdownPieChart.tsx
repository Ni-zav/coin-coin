import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface ChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface BreakdownPieChartProps {
  chartData: ChartData[];
  width: number;
  colorScheme: 'dark' | 'light';
}

const BreakdownPieChart: React.FC<BreakdownPieChartProps> = ({ chartData, width }) => {
  // Format number with $ and commas
  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const pieData = chartData.map(item => ({
    name: '', // Hide name from PieChart legend
    population: item.amount,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: item.legendFontSize,
  }));

  return (
    <View
      accessible
      accessibilityLabel="Income/Expense breakdown chart"
      style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
    >
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <PieChart
          data={pieData}
          width={width * 0.9}
          height={160}
          chartConfig={{
            color: () => '#fff',
            labelColor: () => '#fff',
            propsForLabels: {
              fontFamily: 'SpaceMono',
              fontWeight: 'bold',
              fontSize: 14,
            },
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          hasLegend={false}
          center={[0, 0]}
          absolute
        />
      </View>
      {/* Responsive custom legend below chart */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12,
          rowGap: 8,
          columnGap: 24,
          width: '100%',
        }}
      >
        {chartData.map((item, idx) => (
          <View
            key={idx}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginRight: 24 }}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 6 }} />
            <Text style={{ color: item.color, fontFamily: 'SpaceMono', fontWeight: 'bold', fontSize: 14 }}>
              {item.name}: {formatAmount(item.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BreakdownPieChart;
