//import all the needed resources
import * as React from 'react';
import { store, styles } from './App';
import {
  ScrollView,
  View,
  TouchableOpacity,
  PixelRatio,
  Text,
  Switch,
  Slider,
  Button,
} from 'react-native';
import { takeSnapshotAsync } from 'expo';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

//screen that allows for quiz customation
export class QuizSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //selection state of the categories
      categories: [
        { label: 'FBLA Events', selected: false, count: 10 },
        { label: 'FBLA Rules', selected: false, count: 10 },
        { label: 'FBLA Officers', selected: false, count: 10 },
        { label: 'Business Skills', selected: false, count: 10 },
        { label: 'FBLA Facts', selected: false, count: 10 },
      ],
      //selection state of the "seconds" choices
      seconds: [
        { label: '5', selected: true },
        { label: '15', selected: false },
        { label: '30', selected: false },
        { label: '45', selected: false },
        { label: '60', selected: false },
      ],
      selectedSeconds: '5', //amount of seconds selected
      questions: 1, //amount of questions selected
      maxQuestions: 50, //maximum amount of questions
    };
  }

  //runs when screen renders
  componentDidMount = () => {
    let categories = this.state.categories;
    //for each category selected, get how many questions there are
    categories.map((category, index) => {
      store.getQuestionsFromCategory(index, rows => {
        categories[index].count = rows.length;
        if (index == this.state.categories.length - 1) {
          this.setState({ categories: categories });
        }
      });
    });
    //update settings with current saved setting
    store.getSettings(rows => {
      let settings = rows._array[0];
      //get categories
      settings.categories = JSON.parse(settings.categories);
      let state2 = this.state;
      //update seconds state
      for (let i = 0; i < state2.seconds.length; i++) {
        if (state2.seconds[i].selected) {
          state2.seconds[i].selected = false;
        }
        if (state2.seconds[i].label == settings.seconds.toString()) {
          state2.seconds[i].selected = true;
        }
      }
      //update categories state
      for (let i = 0; i < state2.categories.length; i++) {
        if (state2.categories[i].selected) {
          state2.categories[i].selected = false;
        }
        if (settings.categories.includes(i)) {
          state2.categories[i].selected = true;
        }
      }
      //update state with information
      this.setState({
        selectedSeconds: settings.seconds.toString(),
        seconds: state2.seconds,
        categories: state2.categories,
        questions: settings.questions,
      });
      store.log('quiz settings retrieved and configured');
    });
  };

  //verifies a correct state
  componentDidUpdate = (prevProps, prevState) => {
    //prevents infinite loops by stopping the update of the update if it's the same data
    let totalquestions = 0;
    for (let i = 0; i < this.state.categories.length; i++) {
      if (this.state.categories[i].selected) {
        totalquestions += this.state.categories[i].count;
      }
    }
    if (totalquestions != this.state.maxQuestions) {
      this.setState({ maxQuestions: totalquestions });
    }
    if (this.state.questions > totalquestions) {
      this.setState({ questions: totalquestions });
    }
    store.log('state verified');
  };

  //check if only one "seconds" choice is selected
  shouldComponentUpdate(nextProps, nextState) {
    let selected = 0;
    for (let i = 0; i < nextState.categories.length; i++) {
      if (nextState.categories[i].selected) {
        selected++;
      }
    }
    if (selected == 0) {
      return false;
    }
    return true;
  }

  //configure header
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Quiz Settings', //header title
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

  //display setting configurations
  render() {
    return (
      <ScrollView ref="quizsettings" style={styles.container3}>
        <View style={styles.container2}>
          {/*bug icon to report bug*/}
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              margin: 5,
            }}
            onPress={async () => {
              const targetPixelCount = 1080;
              const pixelRatio = PixelRatio.get();
              const pixels = targetPixelCount / pixelRatio;
              const result = await takeSnapshotAsync(this.refs.quizsettings, {
                result: 'file',
                height: pixels,
                width: pixels,
                quality: 1,
                format: 'png',
              });
              console.log(result);
              store.log('reporting bug');
              this.props.navigation.navigate('ReportBug', { imguri: result });
            }}>
            <MaterialCommunityIcons name="bug" size={35} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
            }}>
            Question Categories
          </Text>
          <View
            style={{
              margin: 10,
              justifyContent: 'center',
            }}>
            {/*Switches for selecting categories*/}
            {this.state.categories.map((category, index) => {
              return (
                <View style={{ flexDirection: 'row', margin: 5 }}>
                  <Switch
                    value={category.selected}
                    onValueChange={() => {
                      let categories = this.state.categories;
                      categories[index].selected = !categories[index].selected;
                      this.setState({ categories: categories });
                      store.log(
                        'switch for ' + categories[index].label + 'toggled'
                      );
                    }}
                  />
                  <Text style={{ marginTop: 5 }}> {category.label}</Text>
                </View>
              );
            })}
          </View>
          <Text
            style={{
              fontSize: 20,
            }}>
            Seconds Per Question
          </Text>
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/*selectors to choose the amount of seconds per question*/}
            {this.state.seconds.map((second, index) => {
              return (
                <TouchableOpacity
                  style={{
                    width: '25%',
                    margin: 3,
                    backgroundColor: second.selected ? '#2196f3' : '#bbbbbb',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    store.log('amount of seconds changed');
                    let seconds = this.state.seconds;
                    for (let i = 0; i < seconds.length; i++) {
                      if (i !== index) {
                        seconds[i].selected = false;
                      } else {
                        seconds[i].selected = true;
                      }
                    }
                    this.setState({
                      seconds: seconds,
                      selectedSeconds: seconds[index].label,
                    });
                  }}>
                  <Text style={{ margin: 10, color: '#ffffff' }}>
                    {second.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={{
              fontSize: 20,
            }}>
            Number of Questions
          </Text>
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ marginRight: 10, color: '#ecf0f1' }}>
              Max: {this.state.maxQuestions}
            </Text>
            {/*minus button*/}
            <TouchableOpacity
              onPress={() => {
                store.log('number of questions decreased');
                this.setState(prevState => ({
                  questions:
                    prevState.questions != 5
                      ? prevState.questions - 1
                      : prevState.questions,
                }));
              }}
              style={{ padding: 5 }}>
              <MaterialCommunityIcons name="minus" size={20} />
            </TouchableOpacity>
            {/*number of questions text*/}
            <Text style={{ margin: 5 }}>{this.state.questions}</Text>
            {/*plus button*/}
            <TouchableOpacity
              onPress={() => {
                store.log('number of questions increased');
                this.setState(prevState => ({
                  questions:
                    prevState.questions != this.state.maxQuestions
                      ? prevState.questions + 1
                      : prevState.questions,
                }));
              }}
              style={{ padding: 5 }}>
              <MaterialIcons name="add" size={20} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 10 }}>
              Max: {this.state.maxQuestions}
            </Text>
          </View>
          {/*slider to choose number of questions */}
          <Slider
            minimumValue={5}
            maximumValue={this.state.maxQuestions}
            value={this.state.questions}
            step={1}
            style={{ width: '80%' }}
            onValueChange={val => {
              this.setState({ questions: val });
              store.log('slider moved to ' + val);
            }}
          />
          {/*save button*/}
          <View style={[{ width: '50%', margin: 20, paddingBottom: 30 }]}>
            <Button
              style={[styles.coverbutton]}
              title="Save Settings"
              onPress={() => {
                //saves these settings
                let categories = [];
                for (let i = 0; i < this.state.categories.length; i++) {
                  if (this.state.categories[i].selected) {
                    categories.push(i);
                  }
                }
                store.updateSettings({
                  categories,
                  questions: this.state.questions,
                  seconds: parseInt(this.state.selectedSeconds),
                });
                store.log('settings saved');
                this.props.navigation.goBack();
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
