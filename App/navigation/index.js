import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';

const SimpleApp = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});


export default SimpleApp;
