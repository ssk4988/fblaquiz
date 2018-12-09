//import all the needed resourcces
import * as React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { store, db } from './App';
import { vsprintf } from 'sprintf-js';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import SwitchSelector from 'react-native-switch-selector';

//screen shows a leaderboard
export class Quizzes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [], //stores personal scores
      leaderboard: true, //boolean for whether to show personal or leaderboard
      allquizzes: [], //stores leaderboard top 20 scores
      notready: true, //whether the data has been loaded yet
    };
  }

  //configures header
  static navigationOptions = ({ navigation }) => {
    return {
      //header title
      headerTitle: navigation.getParam('leaderboard')
        ? 'Leaderboard'
        : 'Your Quizzes',
      //header bar right button
      headerRight: (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={() => {
            //gets confirmation to clear quiz records
            Alert.alert(
              'Delete Local Quiz History',
              'Would you like to delete your local quiz history? (Note: It will still appear on the leaderboard if it is already.)',
              [
                {
                  text: 'No',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    store.log('local quiz storage deleted');
                    console.log('OK Pressed');
                    db.transaction(tx => {
                      tx.executeSql('drop table quizzes');
                      tx.executeSql(
                        'Create table if not exists quizzes (id integer primary key autoincrement, categories text, questions integer, seconds integer, correct integer, date datetime, points integer, key text, duration integer)'
                      );
                      navigation.popToTop();
                    });
                  },
                },
              ],
              { cancelable: false }
            );
          }}>
          <Ionicons name="md-trash" size={30} color="white" />
        </TouchableOpacity>
      ),
      //header bar style
      headerStyle: {
        backgroundColor: '#2196f3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  //runs when screen renders
  componentDidMount = async () => {
    //makes the parameter visible in the header
    this.props.navigation.setParams({ leaderboard: true });
    //sets listener to update leaderboard when new scores are added on the server
    let changedevent = firebase
      .database()
      .ref('/quizzes')
      .on('value', snapshot => {
        //gets leaderboard data
        let data = snapshot.val();
        let sortquizzes = [];
        //push quizzes to an array
        for (let key in data) {
          let tempobj;
          if (typeof data[key] === 'object' && data[key] !== null) {
            tempobj = data[key];
            tempobj.quizId = key;
            sortquizzes.push(tempobj);
          }
        }
        //sort the array
        sortquizzes.sort((quizA, quizB) => {
          return quizB.points - quizA.points;
        });
        this.setState({
          allquizzes: sortquizzes.slice(0, 20),
          notready: false,
        });
      });
    //change value on leaderboard on server to trigger listener
    await firebase
      .database()
      .ref('/quizzes')
      .update({ changer: Math.random() })
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    //get and sort personal quizzes from local database
    store.getQuizzes(rows => {
      this.setState({
        quizzes: rows._array.sort(
          (quizA, quizB) => quizB.points - quizA.points
        ),
      });
    });
  };

  //runs when screen is not shown
  componentWillUnmount = () => {
    //removes listeners so they don't cause problems
    firebase
      .database()
      .ref('/quizzes')
      .off();
  };

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        refreshControl={<RefreshControl refreshing={this.state.notready} />}>
        <View
          style={{
            flex: 1,
          }}>
          {/*selector lets you choose whether to view personal or leaderboard scores*/}
          <SwitchSelector
            initial={1}
            onPress={value => {
              this.setState({ leaderboard: value });
              this.props.navigation.setParams({ leaderboard: value });
            }}
            textColor="#2196f3"
            selectedColor="#fff"
            buttonColor="#2196f3"
            borderRadius={5}
            options={[
              { label: 'Just You', value: false },
              { label: 'Leaderboard', value: true },
            ]}
            style={{
              flex: 1,
              margin: 10,
              borderWidth: 1,
              borderColor: '#2196f3',
              borderRadius: 5,
            }}
          />
        </View>
        {this.state.leaderboard ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: '#2196f3',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  width: '15%',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Rank
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '45%',
                  textAlign: 'left',
                  color: 'white',
                }}>
                Name
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '20%',
                  textAlign: 'left',
                  color: 'white',
                }}>
                Date
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '20%',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Score
              </Text>
            </View>
            {this.state.allquizzes.length == 0 ? (
              <Text style={{ fontSize: 15, alignSelf: 'center' }}>
                No quizzes have been finished yet.
              </Text>
            ) : (
              this.state.allquizzes.map((quiz, index) => {
                //generates one row for each quiz on leaderboard
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      flex: 1,
                      paddingTop: 10,
                      paddingBottom: 10,
                      alignItems: 'center',
                      backgroundColor: index % 2 == 1 ? '#99ccff' : '#e6e6e6',
                    }}
                    onPress={() => {
                      //gives more quiz info when clicked
                      Alert.alert(
                        'Quiz Info',
                        'Player: ' +
                          quiz.name +
                          '\nDate: ' +
                          quiz.date.substring(5, 10) +
                          '\nCategories: ' +
                          quiz.categories.map((category, index) => {
                            let categories1 = [
                              'FBLA Events',
                              'FBLA Rules',
                              'FBLA Officers',
                              'Business Skills',
                              'FBLA Facts',
                            ];
                            return ' ' + categories1[category];
                          }) +
                          '\nNumber of Questions: ' +
                          quiz.questions +
                          '\nDuration: ' +
                          new Date(Math.round(quiz.duration) * 1000)
                            .toISOString()
                            .substr(11, 8) +
                          '\nScore (%): ' +
                          Math.round((100 * quiz.correct) / quiz.questions) +
                          '\nScore (points): ' +
                          quiz.points,
                        [{ text: 'Close' }]
                      );
                    }}>
                    {/*general quiz data for immediate viewing*/}
                    <Text
                      style={{
                        fontSize: 16,
                        width: '15%',
                        textAlign: 'center',
                      }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        width: '45%',
                        textAlign: 'left',
                      }}>
                      {quiz.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        width: '20%',
                      }}>
                      {quiz.date.substring(5, 10)}
                    </Text>
                    <View
                      style={{
                        width: '20%',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          textAlign: 'right',
                          paddingRight: 25,
                        }}>
                        {quiz.points}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : (
          <View>
            {/*viewing personal scores*/}
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: '#2196f3',
              }}>
              {/*table headers*/}
              <Text
                style={{
                  fontSize: 16,
                  width: '33%',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Rank
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '33%',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Date
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '33%',
                  textAlign: 'center',
                  color: 'white',
                }}>
                Score
              </Text>
            </View>
            {this.state.quizzes.length == 0 ? (
              <Text
                style={{ fontSize: 15, alignSelf: 'center', marginTop: 10 }}>
                You have not finished any quizzes yet.
              </Text>
            ) : (
              this.state.quizzes.map((quiz, index) => {
                //generates a row for each personal quiz
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      flex: 1,
                      paddingTop: 10,
                      paddingBottom: 10,
                      alignItems: 'center',
                      backgroundColor: index % 2 == 1 ? '#99ccff' : '#e6e6e6',
                    }}
                    onPress={() => {
                      //popup shows more quiz info when clicked
                      Alert.alert(
                        'Quiz Info',
                        'Player: ' +
                          quiz.name +
                          '\nDate: ' +
                          quiz.date.substring(5, 10) +
                          '-' +
                          quiz.date.substring(0, 4) +
                          '\nCategories: ' +
                          JSON.parse(quiz.categories).map((category, index) => {
                            let categories1 = [
                              'FBLA Events',
                              'FBLA Rules',
                              'FBLA Officers',
                              'Business Skills',
                              'FBLA Facts',
                            ];
                            return ' ' + categories1[category];
                          }) +
                          '\nNumber of Questions: ' +
                          quiz.questions +
                          '\nDuration: ' +
                          new Date(Math.round(quiz.duration) * 1000)
                            .toISOString()
                            .substr(11, 8) +
                          '\nScore (%): ' +
                          Math.round((100 * quiz.correct) / quiz.questions) +
                          '\nScore (points): ' +
                          quiz.points,
                        [{ text: 'Close' }]
                      );
                    }}>
                    {/*general quiz data*/}
                    <Text
                      style={{
                        fontSize: 16,
                        width: '33%',
                        textAlign: 'center',
                      }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        width: '33%',
                        textAlign: 'center',
                      }}>
                      {quiz.date.substring(5, 10) +
                        '-' +
                        quiz.date.substring(0, 4)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: 'center',
                        width: '33%',
                      }}>
                      {quiz.points}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}
