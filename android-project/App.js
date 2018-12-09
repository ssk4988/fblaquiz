//Last updated: 12/8/18
//import all the resources to be used
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Constants, SQLite } from 'expo';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Store } from './Store';
import { StartScreen } from './StartScreen';
import { QuizSettings } from './QuizSettings';
import { TakeQuiz } from './TakeQuiz';
import { Instructions } from './Instructions';
import { AboutFBLA } from './AboutFBLA';
import { ReportBug } from './ReportBug';
import { Quizzes } from './Quizzes';

//set up a database connection to be used
export const db = SQLite.openDatabase('AppData.db');

//the abstracted-out app initializer
export class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

//initiate data store
db.transaction(tx => {
  tx.executeSql('delete from log'); //clear log file contents
});
export let store = new Store();
store.log('log cleared');
store.log('Store Initialized');

//initiate navigation
var AppNavigator = createStackNavigator({
  StartScreen,
  TakeQuiz,
  Instructions,
  QuizSettings,
  AboutFBLA,
  ReportBug,
  Quizzes,
});

//common styles for all elements
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  text: {
    fontSize: 16,
    flex: 1,
    margin: 5,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  container3: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});
export default createAppContainer(AppNavigator);
