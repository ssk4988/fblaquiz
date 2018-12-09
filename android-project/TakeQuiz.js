//import all the needed resources
import * as React from 'react';
import { store } from './App';
import {
  View,
  Dimensions,
  Text,
  Modal,
  Button,
  Share,
  TouchableOpacity,
  PixelRatio,
  AsyncStorage,
} from 'react-native';
import { Constants, takeSnapshotAsync } from 'expo';
import * as Progress from 'react-native-progress';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';

//screen for taking a quiz
export class TakeQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //reerence list of categories
      categories: [
        'FBLA Events',
        'FBLA Rules',
        'FBLA Officers',
        'Business Skills',
        'FBLA Facts',
      ],
      seconds: null, //amount of seconds per question
      questions: null, //the questions on the quiz
      questionnumber: null, //the number of questions
      question: null, //the current question
      correct: 0, //the amount of questions correct
      attempted: 0, //the amount of questions attempted
      finalModalVisible: false, //whether to view the end of the quiz
      progress: 1, //how wide the timer bar should be
      timerenabled: true, //whether the timer is running
      pauseModal: false, //whether the quiz is paused
      lastanswer: true, //whether the last answer was correct
      explanationmodal: false, //whether to show the explanation
      outoftime: false, //whether the timne for the question has ran out
      duration: 0, //how long the quiz has elapsed
      timeleft: null, //how much time is left for this question
      ready: false, //whether the quiz is ready to display
      chosen: null, //which answer was chosen last
      width: Dimensions.get('window').width, //screen width for reference
      height: Dimensions.get('window').height, //screen height for reference
      score: 100, //the amount of points the user has earned for this quiz
    };
  }

  //configure header
  static navigationOptions = ({ navigation }) => {
    return {
      header: null, //no header
    };
  };

  //runs when the screen renders
  componentDidMount = () => {
    //get the quiz settings
    store.getSettings(rows => {
      let settings = rows._array[0];
      console.log(settings);
      settings.categories = JSON.parse(settings.categories);
      let questions = [];
      //get questions from valid categories
      store.getQuestionsFromCategories(settings.categories, rows2 => {
        //randomly choose questions from the list to add to the quiz
        for (let i = 0; i < settings.questions; i++) {
          let selectquestion = Math.round(Math.random() * (rows2.length - 1));
          questions.push(rows2[selectquestion]);
          rows2.splice(selectquestion, 1);
        }
        //add an answers array to the questiosn
        for (let i = 0; i < questions.length; i++) {
          questions[i].answers = JSON.parse(questions[i].answers);
        }
        //ready the test by configuring all the settings
        this.setState(
          {
            seconds: settings.seconds,
            categories2: settings.categories,
            questionnumber: questions.length,
            questions,
            question: questions[0],
            timeleft: settings.seconds,
            ready: true,
          },
          this.animate()
        );
        store.log('quiz state initialized');
      });
    });
  };

  //remove timer interval
  componentWillUnmount = () => {
    clearInterval(this.state.timerInterval);
  };

  //called when an answer is selected
  chosenAnswer = answer => {
    this.setState({ chosen: answer });
    let state2 = this.state;
    console.log(state2.attempted + ' ' + this.state.questionnumber);
    store.log(
      'Question ' +
        state2.attempted +
        ' out of ' +
        this.state.questionnumber +
        ' attempted'
    );
    if (state2.attempted == this.state.questionnumber - 1) {
      //this is the last question
      //update information
      this.setState(
        {
          correct:
            answer == this.state.question.correctanswer
              ? state2.correct + 1
              : state2.correct,
          attempted: state2.attempted + 1,
          timerenabled: false,
        },
        async () => {
          store.getSettings(async rows => {
            let settings = rows._array[0];
            let value = JSON.parse(
              await AsyncStorage.getItem('FBLAQUIZUSERINFO')
            );
            //generate quiz id
            var text = '';
            var possible =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < 9; i++)
              text += possible.charAt(
                Math.floor(Math.random() * possible.length)
              );
            //save quiz data locally
            store.addQuiz(
              settings.categories,
              settings.questions,
              settings.seconds,
              this.state.correct,
              store.scorify(
                JSON.parse(settings.categories).length,
                settings.questions,
                this.state.duration,
                this.state.correct
              ),
              text,
              Math.round(this.state.duration)
            );
            //get current date and time
            var today = new Date();
            var date =
              today.getFullYear() +
              '-' +
              (today.getMonth() + 1) +
              '-' +
              today.getDate();
            var time =
              today.getHours() +
              ':' +
              today.getMinutes() +
              ':' +
              today.getSeconds();
            var dateTime = date + ' ' + time;
            //add quiz to the server
            firebase
              .database()
              .ref('quizzes/' + text)
              .set({
                name: value['name'],
                key: value['key'],
                categories: JSON.parse(settings.categories),
                questions: settings.questions,
                duration: this.state.duration,
                correct: this.state.correct,
                points: store.scorify(
                  JSON.parse(settings.categories).length,
                  settings.questions,
                  this.state.duration,
                  this.state.correct
                ),
                date: dateTime,
              })
              .then(() => {
                console.log('INSERTED!');
              })
              .catch(error => {
                console.log(error);
              });
            //view end of quiz modal
            this.setState({
              finalModalVisible: true,
            });
          });
        }
      );
    } else {
      //not the last question
      //update
      this.setState({
        question: state2.questions[state2.attempted + 1],
        correct:
          answer == this.state.question.correctanswer
            ? state2.correct + 1
            : state2.correct,
        attempted: state2.attempted + 1,
        progress: 1,
        lastanswer: answer == this.state.question.correctanswer,
        timerenabled: false,
        explanationmodal: true,
        outoftime: answer == -1,
        timeleft: this.state.seconds,
      });
    }
  };

  //starts the timer
  animate = () => {
    //interval to call timer
    let interval = 100;
    //create timer
    let timerInterval = setInterval(() => {
      if (this.state.timerenabled) {
        //get current data
        let progress = this.state.progress;
        let duration = this.state.duration;
        let timeleft = this.state.timeleft;
        let score;
        //update current data
        duration += interval / 1000;
        progress -= interval / 1000 / this.state.seconds;
        timeleft -= interval / 1000;
        if (progress <= 0) {
          //reset time if question has run out of time
          progress = 1;
          this.chosenAnswer(-1);
          timeleft = this.state.seconds;
        }
        //set state with new data
        if (this.state.attempted == 0) {
          this.setState({
            progress,
            duration,
            timeleft,
          });
        } else {
          score = store.scorify(
            this.state.categories2.length,
            this.state.attempted,
            duration,
            this.state.correct
          );
          this.setState({
            progress,
            duration,
            timeleft,
            score,
          });
        }
      }
    }, interval);
    this.setState({ timerInterval });
    store.log('Timer animated');
  };

  //displays a testing environment if ready
  render() {
    //don't render quiz if there is no data yet
    if (!this.state.ready) return null;
    //render quiz because data is ready
    return (
      <View
        ref="quiz"
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: Constants.statusBarHeight,
          backgroundColor:
            this.state.finalModalVisible ||
            this.state.pauseModal ||
            this.state.explanationmodal
              ? 'rgba(0,0,0,0.5)'
              : '#ecf0f1',
        }}>
        {/*the timer bar*/}
        <Progress.Bar
          height={this.state.height * 0.04}
          width={this.state.width}
          borderRadius={0}
          borderWidth={0}
          progress={this.state.progress}
          useNativeDriver={true}>
          <Text style={{ marginLeft: 5, fontSize: this.state.height * 0.03 }}>
            {new Date(Math.round(this.state.timeleft) * 1000)
              .toISOString()
              .substr(14, 5)}
          </Text>
        </Progress.Bar>
        {/*modal for if it is the last question*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.finalModalVisible}>
          <View
            style={{
              alignItems: 'center',
              paddingTop: Constants.statusBarHeight,
              backgroundColor: '#ecf0f1',
              flex: 1,
              marginTop: 50,
              marginBottom: 75,
              marginLeft: 25,
              marginRight: 25,
              borderWidth: 2,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
              }}>
              Congratulations, you finished this quiz!
            </Text>
            {/*quiz statistics*/}
            <Text style={{ margin: 5 }}>Correct: {this.state.correct}</Text>
            <Text style={{ margin: 5 }}>Attempted: {this.state.attempted}</Text>
            <Text style={{ margin: 5 }}>
              Percent:{' '}
              {this.state.attempted == 0
                ? 0
                : Math.round(
                    (this.state.correct * 1000) / this.state.attempted
                  ) / 10}
              %
            </Text>
            <Text style={{ margin: 5 }}>Score: {this.state.score} points</Text>
            <Text style={{ margin: 5 }}>
              Duration:{' '}
              {new Date(Math.round(this.state.duration) * 1000)
                .toISOString()
                .substr(11, 8)}
            </Text>
            {/*share results button*/}
            <View
              style={{
                width: '50%',
                marginTop: 10,
              }}>
              <Button
                title="Share Results"
                onPress={() => {
                  store.log('Results shared');
                  //get quiz settings
                  store.getSettings(rows => {
                    let settings = rows._array[0];
                    settings.categories = JSON.parse(settings.categories);
                    let cat = '';
                    for (let i = 0; i < settings.categories.length; i++) {
                      if (i == settings.categories.length - 1) {
                        cat += this.state.categories[settings.categories[i]];
                      } else {
                        cat +=
                          this.state.categories[settings.categories[i]] + ', ';
                      }
                    }
                    //share the quiz info through social media of user's choosing
                    Share.share(
                      {
                        message:
                          'I got a ' +
                          Math.round(
                            (this.state.correct * 1000) / this.state.attempted
                          ) /
                            10 +
                          '% on this FBLA Quiz and earned ' +
                          store.scorify(
                            settings.categories.length,
                            settings.questions,
                            this.state.duration,
                            this.state.correct
                          ) +
                          ' points!\nThe quiz had these categories:  ' +
                          cat +
                          '\n and I only had' +
                          settings.seconds +
                          ' seconds to answer each of the ' +
                          settings.questions +
                          ' questions.',
                        title: 'FBLA Quiz!',
                      },
                      {
                        dialogTitle: 'Share your quiz results',
                      }
                    );
                  });
                }}
              />
            </View>
            {/*return to main menu button*/}
            <View
              style={{
                width: '50%',
                marginTop: 5,
                marginBottom: 5,
              }}>
              <Button
                title="Finish"
                onPress={() => {
                  store.log('Quiz finished');
                  this.props.navigation.popToTop();
                }}
              />
            </View>
          </View>
        </Modal>
        {/*modal to pause the quiz*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.pauseModal}>
          <View
            style={{
              alignItems: 'center',
              paddingTop: Constants.statusBarHeight,
              backgroundColor: '#ecf0f1',
              flex: 1,
              marginTop: this.state.height * 0.15,
              marginBottom: this.state.height * 0.15,
              paddingBottom: 50,
              marginLeft: 25,
              marginRight: 25,
              borderWidth: 2,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
              }}>
              Quiz Paused
            </Text>
            {/*statistics*/}
            <Text style={{ margin: 5 }}>Correct: {this.state.correct}</Text>
            <Text style={{ margin: 5 }}>Attempted: {this.state.attempted}</Text>
            <Text style={{ margin: 5 }}>
              Percent:{' '}
              {this.state.attempted == 0
                ? 0
                : Math.round(
                    (this.state.correct * 1000) / this.state.attempted
                  ) / 10}
              %
            </Text>
            <Text style={{ margin: 5 }}>Score: {this.state.score} points</Text>
            <Text style={{ margin: 5 }}>
              Duration:{' '}
              {new Date(Math.round(this.state.duration) * 1000)
                .toISOString()
                .substr(11, 8)}
            </Text>
            {/*button to return to quiz*/}
            <View
              style={{
                width: '50%',
                margin: 10,
              }}>
              <Button
                title="Resume"
                onPress={() => {
                  store.log('Quiz resumed');
                  this.setState({
                    pauseModal: false,
                    timerenabled: true,
                  });
                }}
              />
            </View>
            {/*button to quit quiz*/}
            <View
              style={{
                width: '50%',
                margin: 10,
              }}>
              <Button
                title="Main Menu"
                onPress={() => {
                  store.log('Quiz quit');
                  this.props.navigation.popToTop();
                }}
              />
            </View>
          </View>
        </Modal>
        {/*modal to explain what the right answer was or confirm that they were right*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.explanationmodal}>
          {this.state.lastanswer ? (
            <View
              style={{
                alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
                backgroundColor: '#ecf0f1',
                marginTop: 50,
                marginBottom: 100,
                marginLeft: 25,
                marginRight: 25,
                borderWidth: 2,
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: 'center',
                  flex: 1,
                }}>
                Correct Answer!
              </Text>
              {/*current score*/}
              <Text>Current Score: {this.state.score} points</Text>
              <View
                style={{
                  width: '50%',
                  margin: 20,
                }}>
                <Button
                  title="Continue"
                  onPress={() => {
                    this.setState({
                      explanationmodal: false,
                      timerenabled: true,
                    });
                  }}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#ecf0f1',
                flex: 1,
                marginTop: this.state.height * 0.15,
                marginBottom: this.state.height * 0.15,
                marginLeft: 25,
                marginRight: 25,
                borderWidth: 2,
                justifyContent: 'space-evenly',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: 'center',
                }}>
                {this.state.outoftime
                  ? 'You Ran Out of Time!'
                  : 'Incorrect Answer!'}
              </Text>
              <Text style={{ margin: 5 }}>
                Correct Answer:{' '}
                {
                  this.state.questions[this.state.attempted - 1].answers[
                    this.state.questions[this.state.attempted - 1].correctanswer
                  ]
                }
              </Text>
              {/*render choices in colors for right or wrond*/}
              {this.state.questions[this.state.attempted - 1].answers.map(
                (answer, index) => {
                  return (
                    <View
                      style={{
                        margin: 10,
                        width: '90%',
                      }}>
                      {index == this.state.chosen ? (
                        <Text> You Picked: </Text>
                      ) : null}
                      <Button
                        title={answer}
                        color={
                          index ==
                          this.state.questions[this.state.attempted - 1]
                            .correctanswer
                            ? '#33cc00'
                            : '#cc2900'
                        }
                      />
                    </View>
                  );
                }
              )}
              {/*continue to next question*/}
              <View
                style={{
                  width: '50%',
                  margin: 10,
                }}>
                <Button
                  title="Continue"
                  onPress={() => {
                    this.setState({
                      explanationmodal: false,
                      timerenabled: true,
                    });
                  }}
                />
              </View>
            </View>
          )}
        </Modal>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          {/*pause button and category of question*/}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <MaterialIcons
              name="pause"
              size={this.state.height * 0.06}
              color="#ecf0f100"
            />
            <Text
              style={{
                fontSize: this.state.width * 0.044,
                marginTop: 5,
                marginBottom: 10,
                textAlign: 'center',
                marginLeft: this.state.width * 0.15,
                marginRight: this.state.width * 0.15,
              }}>
              Category: {this.state.categories[this.state.question.category]}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                store.log('Quiz Paused');
                this.setState({
                  pauseModal: true,
                  timerenabled: false,
                });
              }}>
              <MaterialIcons name="pause" size={this.state.height * 0.06} />
            </TouchableOpacity>
          </View>
          {/*question prompt*/}
          <Text
            style={{
              fontSize: 20,
              paddingTop: 15,
              paddingRight: 20,
              paddingLeft: 20,
              textAlign: 'center',
            }}>
            {this.state.attempted + 1}. {this.state.question.prompt}
          </Text>
          {/*generate button for each answer choice*/}
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.question.answers.map((answer, index) => {
              return (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    width: '80%',
                    margin: 10,
                    backgroundColor: '#2196f3',
                    borderRadius: 3,
                  }}
                  onPress={() => {
                    this.chosenAnswer(index);
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    {answer.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/*back arrow to quit quiz*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.popToTop();
            }}
            style={{
              margin: 5,
            }}>
            <MaterialIcons name="arrow-back" size={35} />
          </TouchableOpacity>
          {/*bug icon to report bugs*/}
          <TouchableOpacity
            style={{
              margin: 5,
            }}
            onPress={async () => {
              //screen shot
              const targetPixelCount = 1080;
              const pixelRatio = PixelRatio.get();
              const pixels = targetPixelCount / pixelRatio;
              const result = await takeSnapshotAsync(this.refs.quiz, {
                result: 'file',
                height: pixels,
                width: pixels,
                quality: 1,
                format: 'png',
              });
              console.log(result);
              this.setState({
                pauseModal: true,
                timerenabled: false,
              });
              this.props.navigation.replace('ReportBug', { imguri: result });
            }}>
            <MaterialCommunityIcons name="bug" size={35} />
          </TouchableOpacity>
        </View>
        {/*quiz statistics*/}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: '#2196f3',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{ margin: 3, color: '#ffffff' }}>
            Correct: {this.state.correct}
          </Text>
          <Text style={{ margin: 3, color: '#ffffff' }}>
            Attempted: {this.state.attempted}
          </Text>
          <Text style={{ margin: 3, color: '#ffffff', width: '35%' }}>
            Duration:{' '}
            {new Date(Math.round(this.state.duration) * 1000)
              .toISOString()
              .substr(11, 8)}
          </Text>
          {this.state.attempted == 0 ? null : (
            <Text style={{ margin: 3, color: '#ffffff' }}>
              Percent:{' '}
              {Math.round((this.state.correct * 1000) / this.state.attempted) /
                10}
              %
            </Text>
          )}
          {this.state.attempted == 0 ? null : (
            <Text style={{ margin: 3, color: '#ffffff' }}>
              Score: {this.state.score}
              {' points'}
            </Text>
          )}
        </View>
      </View>
    );
  }
}
