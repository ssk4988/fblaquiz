//import all the needed resources
import * as React from 'react';
import { store, styles } from './App';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Button,
  PixelRatio,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { takeSnapshotAsync } from 'expo';
import * as Progress from 'react-native-progress';
import SwitchSelector from 'react-native-switch-selector';

//an interactive instructions guide on how to use this app
export class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: [], //will contain log file contents for demonstrative purposes
      what: false, //boolean for showing "what is fbla quiz?" content
      start: false, //boolean for showing "start screen" content
      settings: false, //boolean for showing "quiz settings" content
      quiz: false, //boolean for showing "take the quiz" content
      quizzes: false, //boolean for showing "quiz history" content
      bug: false, //boolean for showing "report a bug" content
    };
  }

  //configure header
  static navigationOptions = {
    headerTitle: 'Instructions', //header title
    //header bar styling
    headerStyle: {
      backgroundColor: '#2196f3',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  //get first 10 entries of log file when screen renders
  componentDidMount = async () => {
    let fullLog = [];
    store.getLog(rows => {
      let len = 10;
      if (rows.length < 10) {
        len = rows.length;
      }
      for (let i = 0; i < len; i++) {
        fullLog.push(rows._array[i]);
      }
      this.setState({ log: fullLog });
    });
    store.l0g('log retrieved');
  };

  //makes sure only one "link" is open at time by closing others when a new one is opened
  toggle = keyS => {
    let state = this.state;
    let newCondition = !state[keyS];
    for (let key in state) {
      if (state[key] == true) {
        state[key] = false;
      }
    }
    state[keyS] = newCondition;
    this.setState(state);
  };
  render() {
    //renders set of links which show instructions
    return (
      <ScrollView ref="instructions" style={styles.container3}>
        <Text style={{ fontSize: 16, flex: 1, margin: 5, alignSelf: 'center' }}>
          Click any of the links to reveal text.
        </Text>
        {/*"What is FBLA Quiz?" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('what');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            What is FBLA Quiz?
          </Text>
        </TouchableOpacity>
        {/*"What is FBLA Quiz?" content*/}
        {this.state.what ? (
          <View>
            <Text style={styles.text}>
              FBLA Quiz! is a quizzing app designed to teach users about FBLA
              through computer-generated quizzes. The questions come in 5
              categories: FBLA Events, FBLA Rules, FBLA Officers, FBLA Skills,
              and FBLA Facts. This instructions guide will teach you how to use
              this app and make the most out of it. This app was created for the
              FBLA Mobile App Development Event.
            </Text>
            {/*bug icon that reports a bug*/}
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                margin: 5,
              }}
              onPress={async () => {
                //takes a screenshot and navigates to bug reporting page
                const targetPixelCount = 1080;
                const pixelRatio = PixelRatio.get();
                const pixels = targetPixelCount / pixelRatio;
                const result = await takeSnapshotAsync(this.refs.instructions, {
                  result: 'file',
                  height: pixels,
                  width: pixels,
                  quality: 1,
                  format: 'png',
                });
                console.log(result);
                this.props.navigation.navigate('ReportBug', { imguri: result });
              }}>
              <MaterialCommunityIcons name="bug" size={35} />
            </TouchableOpacity>
            <Text style={styles.text}>
              This "bug" icon will show up on each page. Clicking this icon will
              allow you to report any bugs you find in this app and describe
              them in detail. Click it if you want to test it out.
            </Text>
          </View>
        ) : null}
        {/*"Start Screen" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('start');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            Start Screen
          </Text>
        </TouchableOpacity>
        {/*"Start Screen" content*/}
        {this.state.start ? (
          <View>
            <Text style={styles.text}>
              The start screen is the very first screen you see when opening the
              app.
            </Text>
            {/*settings icon that takes user to quiz settings page*/}
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => {
                store.getQuestions(rows => {
                  console.log(rows.length);
                });
                store.log('Navigate to quiz settings');
                this.props.navigation.navigate('QuizSettings');
              }}>
              <MaterialIcons name="settings" size={25} />
            </TouchableOpacity>
            <Text style={styles.text}>
              The settings icon takes you to a page where you can change the
              settings of the quizzes that you take.
            </Text>
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button style={[styles.coverbutton]} title="Take The Quiz" />
            </View>
            <Text style={styles.text}>
              This button allows you to take the quiz using the settings
              configured earlier. If you have not configured a player name, you
              will be prompted to do so.
            </Text>
            {/*button that takes you to instructions page (this page)*/}
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button
                style={[styles.coverbutton]}
                title="Instructions"
                onPress={() => {
                  store.log('Navigate to instructions');
                  this.props.navigation.navigate('Instructions');
                }}
              />
            </View>
            <Text style={styles.text}>
              This button takes you to the very page you are on now, the
              instructions guide.
            </Text>
            {/*button that takes you to the leaderboard*/}
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button
                style={[styles.coverbutton]}
                title="Quiz History"
                onPress={() => {
                  this.props.navigation.navigate('Quizzes');
                }}
              />
            </View>
            <Text style={styles.text}>
              This button allows you to view your quiz scores and the
              leaderboard.
            </Text>
            {/*button that takes you to the fbla website home page*/}
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button
                style={[styles.coverbutton]}
                title="Learn About FBLA"
                onPress={() => {
                  this.props.navigation.navigate('AboutFBLA');
                }}
              />
            </View>
            <Text style={styles.text}>
              This button takes you to the FBLA website, where you can learn
              more about FBLA and its purpose.
            </Text>
          </View>
        ) : null}
        {/*"Quiz Settings" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('settings');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            Quiz Settings
          </Text>
        </TouchableOpacity>
        {/*"Quiz Settings" content*/}
        {this.state.settings ? (
          <View>
            <Text style={styles.text}>
              Clicking the settings icon on the start screen brings you to this
              page. On this page, you can change the settings of the quiz you
              want to take.
            </Text>
            <Text style={styles.text}>
              First you will see a list of categories that questions can be
              pulled from. Toggling the switches allows you to change which
              categories will show up on your quiz.
            </Text>
            <Text style={styles.text}>
              Next you can choose how much time you have per question.
            </Text>
            <Text style={styles.text}>
              Lastly you can change how many questions you want to have on your
              quiz. You must click the save button or the settings will not
              change.
            </Text>
          </View>
        ) : null}
        {/*"Take The Quiz" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('quiz');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            Take the Quiz
          </Text>
        </TouchableOpacity>
        {/*"Take the Quiz" content*/}
        {this.state.quiz ? (
          <View>
            {/*Button takes you to the quiz-taking screen*/}
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button
                style={[styles.coverbutton]}
                title="Take The Quiz"
                onPress={() => {
                  store.log('Quiz started');
                  this.props.navigation.navigate('TakeQuiz');
                }}
              />
            </View>
            <Text style={styles.text}>
              Pressing the take the quiz button on the start screen will open up
              a quizzing environment.
            </Text>
            {/*Sample timer bar to show how it will look*/}
            <Progress.Bar
              height={20}
              width={Dimensions.get('window').width}
              borderRadius={0}
              borderWidth={0}
              progress={0.6}
              useNativeDriver={true}>
              <Text style={{ marginLeft: 5 }}>00:09</Text>
            </Progress.Bar>
            <Text style={styles.text}>
              At the top is a progress bar showing how much time you have left,
              based on how much time was configured per question in the settings
              page.
            </Text>
            {/*Pause button*/}
            <MaterialIcons
              name="pause"
              size={25}
              style={{ alignSelf: 'center' }}
            />
            <Text style={styles.text}>
              The pause button is just below the progress bar. This button
              pauses the quiz and allows you to take a break.
            </Text>
            {/*Sample Question*/}
            <Text
              style={{
                fontSize: 20,
                paddingTop: 20,
                paddingRight: 20,
                paddingLeft: 20,
                textAlign: 'center',
              }}>
              5. Which of these is not an FBLA Officer Position?
            </Text>
            {/*Sample Answer buttons for sample question*/}
            <View
              style={{
                margin: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: '80%',
                  margin: 10,
                  backgroundColor: '#2196f3',
                  borderRadius: 3,
                }}
                onPress={() => {
                  alert('Wrong Answer.');
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  PRESIDENT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: '80%',
                  margin: 10,
                  backgroundColor: '#2196f3',
                  borderRadius: 3,
                }}
                onPress={() => {
                  alert('Wrong Answer.');
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  SECRETARY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: '80%',
                  margin: 10,
                  backgroundColor: '#2196f3',
                  borderRadius: 3,
                }}
                onPress={() => {
                  alert('Wrong Answer.');
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  PARLIAMENTARIAN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: '80%',
                  margin: 10,
                  backgroundColor: '#2196f3',
                  borderRadius: 3,
                }}
                onPress={() => {
                  alert('Correct Answer.');
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  LIBRARIAN
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>
              This is a sample question. It contains a prompt, the category of
              the question, and the answers. A popup will tell you if you picked
              the right answer.
            </Text>
            {/*Sample statistics bar*/}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#2196f3',
                justifyContent: 'space-evenly',
              }}>
              <Text style={{ margin: 3, color: '#ffffff' }}>Correct: 5</Text>
              <Text style={{ margin: 3, color: '#ffffff' }}>Attempted: 15</Text>
              <Text style={{ margin: 3, color: '#ffffff', width: '35%' }}>
                Duration: 00:05:56
              </Text>
              <Text style={{ margin: 3, color: '#ffffff' }}>
                Percent: 33.3%
              </Text>
              <Text style={{ margin: 3, color: '#ffffff' }}>
                Score: {store.scorify(5, 15, 356, 5)} points
              </Text>
            </View>
            <Text style={styles.text}>
              The statistics bar at the problem tells you how you're doing on
              the quiz.
            </Text>
            <Text style={styles.text}>
              After finishing your quiz, you may share your results with others
              through virtually any form of social media installed on your
              device by clicking the "Share Results" button.
            </Text>
          </View>
        ) : null}
        {/*"Quiz History" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('quizzes');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            Quiz History
          </Text>
        </TouchableOpacity>
        {/*"Quiz History" content*/}
        {this.state.quizzes ? (
          <View>
            {/*Button takes you to the leaderboard page*/}
            <View style={{ width: '50%', alignSelf: 'center' }}>
              <Button
                style={[styles.coverbutton]}
                title="Quiz History"
                onPress={() => {
                  this.props.navigation.navigate('Quizzes');
                }}
              />
            </View>
            <Text style={styles.text}>
              This screen is reached by clicking the quiz history button on the
              start screen.
            </Text>
            <Text style={styles.text}>
              Clicking the trash icon on the header bar will allow you to clear
              your personal quiz history. However, your scores may remain on the
              leaderboard.
            </Text>
            {/*Sample selector for which data to view*/}
            <SwitchSelector
              initial={0}
              onPress={value => {}}
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
            <Text style={styles.text}>
              Changing this switch will allow you to choose whether to view your
              own quizzes or look at the leaderboard. Choosing "Just You" will
              show all your quizzes, but choosing the leaderboard will only show
              the top 20 scorers. Clicking on the quiz will reveal more
              information about the quiz.
            </Text>
          </View>
        ) : null}
        {/*"Report a Bug" link*/}
        <TouchableOpacity
          onPress={() => {
            this.toggle('bug');
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 20,
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            Report a Bug
          </Text>
        </TouchableOpacity>
        {/*"Report a Bug" content*/}
        {this.state.bug ? (
          <View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                margin: 5,
              }}
              onPress={async () => {
                //takes a screenshot and navigates to bug reporting screen
                const targetPixelCount = 1080;
                const pixelRatio = PixelRatio.get();
                const pixels = targetPixelCount / pixelRatio;
                const result = await takeSnapshotAsync(this.refs.instructions, {
                  result: 'file',
                  height: pixels,
                  width: pixels,
                  quality: 1,
                  format: 'png',
                });
                console.log(result);
                this.props.navigation.navigate('ReportBug', { imguri: result });
              }}>
              <MaterialCommunityIcons name="bug" size={35} />
            </TouchableOpacity>
            <Text style={styles.text}>
              This screen is reached by clicking on the bug icon on any of the
              pages.
            </Text>
            <Text style={styles.text}>
              First on this page is a screenshot of the screen from which you
              clicked the bug icon. This screenshot will help the developer
              visually identify the bug.
            </Text>
            {/*First 10 entries of the log file*/}
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
                return <Text>{message.message}</Text>;
              })}
              <Text>...</Text>
            </View>
            <Text style={styles.text}>
              Second is the contents of the app's log file which can be used to
              identify logic bugs.
            </Text>
            <Text style={styles.text}>
              Clicking the submit button at the bottom will open an email prompt
              where you can describe the bug and send the email to the developer
              with the log file contents and screenshot attached.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    );
  }
}
