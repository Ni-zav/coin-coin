import React from 'react';
import { Text, View } from 'react-native';
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
    name: '', // Empty name ensures no label appears on the chart
    population: item.amount,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: item.legendFontSize,
  }));

  return (
    <View
      accessible
      accessibilityLabel="Income/Expense breakdown chart"
      style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ width: width / 2, height: 160, alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0, borderWidth: 0 }}>
        <PieChart
          paddingLeft='50'
          data={pieData}
          width={width / 1.5}
          height={160}
          chartConfig={{
            color: () => '#fff',
            labelColor: () => '#fff',
          }}
          accessor="population"
          backgroundColor="transparent"
          hasLegend={false}
          absolute
          avoidFalseZero
        />
      </View>
      {/* Custom legend to the side of the chart */}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginLeft: 0,
          padding: 0,
          borderWidth: 0,
          width: width / 2,
        }}
      >
        {chartData.map((item, idx) => (
          <View
            key={idx}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: idx < chartData.length - 1 ? 12 : 0, padding: 0, borderWidth: 0 }}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 4, padding: 0, borderWidth: 0 }} />
            <Text style={{ color: item.color, fontFamily: 'SpaceMono', fontWeight: 'bold', fontSize: 14, padding: 0, margin: 0, borderWidth: 0 }}>
              {item.name}: {formatAmount(item.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BreakdownPieChart;