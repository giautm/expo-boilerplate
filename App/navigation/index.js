import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';

const AppNavigation = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      }
    }
  },
}, {
  headerMode: 'screen',
  cardStyle: {
    backgroundColor: '#fff',
  },
});


export default AppNavigation;
