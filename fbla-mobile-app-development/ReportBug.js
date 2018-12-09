//import all the needed resources
import * as React from 'react';
import { store, styles } from './App';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  View,
  Dimensions,
  Button,
  PixelRatio,
} from 'react-native';
import Expo, { takeSnapshotAsync } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//screen that allows reporting bugs
export class ReportBug extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imguri: this.props.navigation.getParam('imguri'), //screenshot from previous screen
      log: [], //stores log file contents
    };
  }

  //configure header
  static navigationOptions = {
    headerTitle: 'Report A Bug', //header title
    //header bar style
    headerStyle: {
      backgroundColor: '#2196f3',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  //runs when the screen renders
  componentDidMount = () => {
    let fullLog = [];
    //get log contents
    store.getLog(rows => {
      let j = rows.length < 15 ? rows.length : 15;
      for (let i = 0; i < j; i++) {
        fullLog.push(rows._array[i]);
      }
      this.setState({ log: fullLog });
    });
  };

  //display screenshot and log file
  render() {
    return (
      <ScrollView
        ref="reportbug"
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
          paddingBottom: 35,
        }}>
        {/*bug icon to report bugs*/}
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            margin: 5,
          }}
          onPress={async () => {
            //takes screenshot
            const targetPixelCount = 1080;
            const pixelRatio = PixelRatio.get();
            const pixels = targetPixelCount / pixelRatio;
            const result = await takeSnapshotAsync(this.refs.reportbug, {
              result: 'file',
              height: pixels,
              width: pixels,
              quality: 1,
              format: 'png',
            });
            console.log(result);
            this.props.navigation.replace('ReportBug', { imguri: result });
          }}>
          <MaterialCommunityIcons name="bug" size={35} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 25,
            textAlign: 'center',
          }}>
          Screenshot
        </Text>
        {/*screenshot from previous screen*/}
        <Image
          source={{ uri: this.state.imguri }}
          style={{
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').height / 2,
            marginTop: 5,
            alignSelf: 'center',
            resizeMode: 'stretch',
            borderWidth: 2,
            borderColor: '#000000',
          }}
        />
        <Text style={{ margin: 10, textAlign: 'center' }}>
          Below is the log file, which I will use to figure out why the bug
          occured.
        </Text>
        {/*contains the log file*/}
        <View
          style={{
            width: '80%',
            backgroundColor: '#ffffff',
            borderWidth: 2,
            padding: 10,
            flex: 1,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 30,
            }}>
            Log File Contents:
          </Text>

          {this.state.log.map((message, i) => {
            //renders each log file content
            return <Text>{message.message}</Text>;
          })}
        </View>
        {/*submit button*/}
        <View
          style={{
            marginTop: 10,
            marginBottom: 50,
            width: '50%',
            alignSelf: 'center',
          }}>
          <Button
            title="Submit"
            style={[styles.coverbutton]}
            onPress={async () => {
              //sends an email
              let logstr = 'Log File:\n';
              this.state.log.map((message, i) => {
                logstr += message.message + '\n';
              });
              await Expo.MailComposer.composeAsync({
                recipients: ['ssk4988@gmail.com'],
                subject: 'FBLA Quiz! Bug',
                body:
                  'Please describe the bug here.\n\n\n\n**********\n' + logstr,
                attachments: [this.state.imguri],
              });
              this.prop.navigation.popToTop();
            }}
          />
        </View>
      </ScrollView>
    );
  }
}
