import { Text, View } from 'react-native';

export default function NotFoundCatchAll() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen not found. Go to home screen!</Text>
    </View>
  );
}