//import all the needed resources
import { store, db, styles } from './App';
import * as React from 'react';
import {
  ScrollView,
  Modal,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  PixelRatio,
  Dimensions,
  Alert,
  AsyncStorage,
  TextInput,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { takeSnapshotAsync } from 'expo';
import firebase from 'firebase';

//the landing page when opening the app
export class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      licensing: false, //whether to show licensing and terms of agreement
      width: Dimensions.get('window').width, //width of screen for scaling
      height: Dimensions.get('window').height, //height of screen for scaling
      key: true, //whether a server has a unique key for this device
      name: false, //whether a player name has been chosen
      nametext: '', //the player name
      userkey: '', //the device's unique server key
    };
    //show licensing if this is first time opening
    store.getSettings(async rows => {
      if (rows._array[0].opened == 0) {
        this.setState({ licensing: true });
      }
    });
  }
  //runs when screen renders
  componentDidMount = async () => {
    //server links to use for firebase
    var config = {
      apiKey: 'AIzaSyDf3sjtFmtU_tQPD3OR_fpRD5Pfrt6PKPY',
      authDomain: 'fbla-mobile.firebaseapp.com',
      databaseURL: 'https://fbla-mobile.firebaseio.com',
      projectId: 'fbla-mobile',
      storageBucket: 'fbla-mobile.appspot.com',
      messagingSenderId: '382970421558',
    };
    firebase.initializeApp(config);
    try {
      //get user info
      const value1 = await AsyncStorage.getItem('FBLAQUIZUSERINFO');
      let value = JSON.parse(value1);
      if (value !== null) {
        //server already has unique key for this
        this.setState({ userkey: value['key'] });
      } else {
        this.setState({ key: false });
        //generate a new server key for this device
        var text = '';
        var possible =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 9; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        //assign the new server key
        firebase
          .database()
          .ref('users/' + text)
          .set({
            name: '',
          })
          .then(() => {
            console.log('INSERTED!');
          })
          .catch(error => {
            console.log(error);
          });
        //save the server key locally
        await AsyncStorage.setItem(
          'FBLAQUIZUSERINFO',
          JSON.stringify({ key: text, name: '' })
        );
        this.setState({ key: true, userkey: text });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  //configure header
  static navigationOptions = ({ navigation }) => {
    return {
      header: null, //no header
    };
  };

  //shows navigational screen
  render() {
    return (
      <ScrollView ref="imgcont" style={styles.container3}>
        {/*modal for making player name*/}
        <Modal
          visible={this.state.name}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            this.setState({ name: false });
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: '#00000099',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                alignSelf: 'center',
                height: this.state.height * 0.3,
                width: this.state.width * 0.8,
                alignItems: 'center',
              }}>
              <Text style={{ padding: 5, textAlign: 'center' }}>
                Enter a Player Name
                {'\n'}
                (You may not change this name later)
              </Text>
              {/*text box for player name*/}
              <TextInput
                style={{
                  width: '100%',
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 20,
                  marginBottom: 20,
                  textAlign: 'left',
                  paddingLeft: 15,
                  padding: 5,
                  paddingRight: 15,
                }}
                maxLength={20}
                placeholder="Enter a new player name"
                value={this.state.nametext}
                onChangeText={text => {
                  this.setState({ nametext: text });
                }}
              />
              <View style={{ flex: 1 }} />
              {/*submit button for player name*/}
              <View style={{ width: '100%' }}>
                <Button
                  title="Submit"
                  disabled={
                    this.state.nametext == '' ||
                    !this.state.nametext.replace(/\s/g, '').length
                  }
                  onPress={async () => {
                    try {
                      //get user data
                      const value = JSON.parse(
                        await AsyncStorage.getItem('FBLAQUIZUSERINFO')
                      );
                      value['name'] = this.state.nametext;
                      await AsyncStorage.setItem(
                        'FBLAQUIZUSERINFO',
                        JSON.stringify(value)
                      );
                      //update server with player name
                      firebase
                        .database()
                        .ref('users/' + value['key'])
                        .set({
                          name: this.state.nametext,
                        })
                        .then(() => {
                          console.log('INSERTED!');
                        })
                        .catch(error => {
                          console.log(error);
                        });

                      console.log(value.name);
                      store.log('Quiz started');
                      this.props.navigation.navigate('TakeQuiz');
                      this.setState({ name: false });
                    } catch (error) {
                      alert(error);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/*modal to show licensing*/}
        <Modal visible={this.state.licensing} transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: '#00000099',
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginTop: 50,
                marginBottom: 50,
                marginLeft: 25,
                marginRight: 25,
                backgroundColor: '#ffffff',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                App Licensing, Terms, and Conditions
              </Text>
              {/*licensing, terms, and conditions*/}
              <ScrollView style={{ flex: 1, width: '100%' }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginTop: 20,
                  }}>
                  Licensing
                </Text>
                <Text style={{ flex: 1, margin: 5 }}>
                  FBLA Quiz! is free for anyone to use non-commercially and does
                  not require any specific licensing.
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginTop: 20,
                  }}>
                  Terms And Conditions
                </Text>
                <Text style={{ flex: 1, margin: 5 }}>
                  FBLA Quiz! is owned by the developer and the developer retains
                  this ownership. {'\n'}
                  {'\n'}
                  Users may not claim ownership of this product or use it
                  commercially.
                  {'\n'}
                  {'\n'}
                  The developer retains the right to modify the product at any
                  time.
                  {'\n'}
                  {'\n'}
                  The developer does not provide warranties and does not have
                  any liability or responsibility for misuse of the app.
                  {'\n'}
                  {'\n'}
                  The developer can ban users from using the product at any
                  time.
                </Text>
              </ScrollView>
              {/*agreement button*/}
              <View style={{ marginTop: 10 }}>
                <Button
                  title="I accept the Licensing, Terms, and Conditions"
                  onPress={async () => {
                    store.log('Terms were accepted');
                    this.setState({ licensing: false });
                    await db.transaction(async tx => {
                      await tx.executeSql('update settings set opened = ?', [
                        1,
                      ]);
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={[
            styles.container,
            { opacity: this.state.licensing ? 0.5 : 1 },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            {/*info button to get developer contact info*/}
            <TouchableOpacity
              style={{
                paddingTop: this.state.height * 0.0085,
                paddingRight: 5,
              }}
              onPress={() => {
                Alert.alert(
                  'FBLA Quiz!',
                  'Sachin Sivakumar\nEmail: ssk4988@gmail.com',
                  [{ text: 'Close' }]
                );
              }}>
              <MaterialIcons
                name="info-outline"
                size={this.state.height * 0.05}
              />
            </TouchableOpacity>
            {/*settings icon takes you to settings page*/}
            <TouchableOpacity
              style={{
                paddingTop: this.state.height * 0.0085,
                paddingRight: 5,
              }}
              onPress={() => {
                store.getQuestions(rows => {
                  console.log(rows.length);
                });
                store.log('Navigate to quiz settings');
                this.props.navigation.navigate('QuizSettings');
              }}>
              <MaterialIcons name="settings" size={this.state.height * 0.05} />
            </TouchableOpacity>
          </View>
          {/*app logo*/}
          <Image
            style={{
              width: this.state.height * 0.41,
              height: this.state.height * 0.33,
              resizeMode: 'stretch',
            }}
            source={require('./assets/FBLAQuizLogo.png')}
          />
          {/*take quiz button*/}
          <TouchableOpacity
            style={{
              padding: this.state.height * 0.017,
              width: '60%',
              marginTop: this.state.height * 0.05,
              backgroundColor: '#2196f3',
              borderRadius: 3,
            }}
            onPress={async () => {
              //check if name is defined to figure out whether to prompt for name
              const value = JSON.parse(
                await AsyncStorage.getItem('FBLAQUIZUSERINFO')
              );
              if (
                value['name'] == null ||
                value == null ||
                value['name'] == ''
              ) {
                //prompt for name
                console.log(value.name);
                this.setState({ name: true });
              } else {
                console.log(value.name);
                store.log('Quiz started');
                this.props.navigation.navigate('TakeQuiz');
              }
            }}>
            <Text
              style={{
                fontSize: this.state.height * 0.025,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}>
              Take The Quiz
            </Text>
          </TouchableOpacity>
          {/*instructions button*/}
          <TouchableOpacity
            style={{
              padding: this.state.height * 0.017,
              width: '60%',
              marginTop: this.state.height * 0.05,
              backgroundColor: '#2196f3',
              borderRadius: 3,
            }}
            onPress={() => {
              store.log('Navigate to instructions');
              this.props.navigation.navigate('Instructions');
            }}>
            <Text
              style={{
                fontSize: this.state.height * 0.025,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}>
              Instructions
            </Text>
          </TouchableOpacity>
          {/*quiz history/leaderboard button*/}
          <TouchableOpacity
            style={{
              padding: this.state.height * 0.017,
              width: '60%',
              marginTop: this.state.height * 0.05,
              backgroundColor: '#2196f3',
              borderRadius: 3,
            }}
            onPress={() => {
              this.props.navigation.navigate('Quizzes');
            }}>
            <Text
              style={{
                fontSize: this.state.height * 0.025,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}>
              Quiz History
            </Text>
          </TouchableOpacity>
          {/*learn about fbla button*/}
          <TouchableOpacity
            style={{
              padding: this.state.height * 0.017,
              width: '60%',
              marginTop: this.state.height * 0.05,
              backgroundColor: '#2196f3',
              borderRadius: 3,
            }}
            onPress={() => {
              this.props.navigation.navigate('AboutFBLA');
            }}>
            <Text
              style={{
                fontSize: this.state.height * 0.025,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}>
              Learn About FBLA
            </Text>
          </TouchableOpacity>
          {/*bug icon to report bugs*/}
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginRight: this.state.height * 0.0085,
              marginTop: this.state.height * 0.02,
            }}
            onPress={async () => {
              //take screenshot
              const targetPixelCount = 1080;
              const pixelRatio = PixelRatio.get();
              const pixels = targetPixelCount / pixelRatio;
              const result = await takeSnapshotAsync(this.refs.imgcont, {
                result: 'file',
                height: pixels,
                width: pixels,
                quality: 1,
                format: 'png',
              });
              console.log(result);
              this.props.navigation.navigate('ReportBug', { imguri: result });
            }}>
            <MaterialCommunityIcons
              name="bug"
              size={this.state.height * 0.06}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
