//import the needed resources
import * as React from 'react';
import { NetInfo, WebView, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { store } from './App';

//screen goes to FBLA website
export class AboutFBLA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true, //whether there is an internet connection
    };
  }

  //change connectivity status if there is a change in connection
  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
    store.log('connection changed to:' + isConnected);
  };

  //configure header
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'About FBLA', //header title
      //header bar styling
      headerStyle: {
        backgroundColor: '#2196f3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  //runs on render of screen
  componentDidMount() {
    //add a listener that calls a change to connectivity status if there is a status change
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
    //get initial connection and update connectivity status
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({ isConnected: connectionInfo.type != 'none' });
    });
  }

  render() {
    //return FBLA website
    if (this.state.isConnected) {
      return (
        <WebView
          source={{ uri: 'https://www.fbla-pbl.org/about/' }}
          style={{ flex: 1 }}
        />
      );
    } else {
      //return error message if no internet
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#ecf0f1',
            justifyContent: 'center',
          }}>
          <Feather name="alert-triangle" size={35} color="red" />
          <Text
            style={{
              fontSize: 30,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            You are not connected to the internet.
          </Text>
        </View>
      );
    }
  }
}
