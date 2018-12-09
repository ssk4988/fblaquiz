//import the connection to the database
import { db } from './App';
import { AsyncStorage } from 'react-native';

//data store
export class Store {
  constructor() {
    //description of what fields there are for each question
    let questionKeys = {
      id: 0, //unique for every question
      prompt: 'How many?', //the question
      category: 0, // index of array of categories [events,rules,officers,business skills,history]
      answers: ' {data:[]}', // array of string multiple choice answers
      correctanswer: 0, // index of answer in answers array that is correct
    };
    let quizsettingkeys = {
      id: 1, //to identify the settings
      categories: '[0,1,3,4]', //categories to include
      questions: 3, //number of questions in the quiz
      seconds: 15, //seconds per question
    };

    //initialize question bank
    db.transaction(async tx => {
      this.log('Log created');
      await tx.executeSql(
        'Create table if not exists questions (id integer primary key autoincrement, prompt text, category integer, answers text, correctanswer integer)'
      );
      this.log('Question table created');
      //initialize settings table
      await tx.executeSql(
        'Create table if not exists settings (id integer primary key, categories text, questions integer, seconds integer, opened integer)',
        [],
        async () => {
          //insert initial settings
          await tx.executeSql(
            'insert into settings (id,categories,questions,seconds,opened) values (?,?,?,?,?);',
            [1, JSON.stringify([0, 1, 2, 3, 4]), 50, 60, 0]
          );
        }
      );

      this.log('Settings table created');
      //create table for quiz tracking
      await tx.executeSql(
        'Create table if not exists quizzes (id integer primary key autoincrement, categories text, questions integer, seconds integer, correct integer, date datetime, points integer, key text, duration integer)'
      );
      //initialize a table for tracking which questions have been answered
      await tx.executeSql('Create table if not exists answered (id integer)');
      await tx.executeSql(
        'Create table if not exists log (id integer primary key autoincrement, message text)'
      );
      try {
        const value = await AsyncStorage.getItem('FBLAQuizuser');
        if (value !== null) {
          // We have data!!
          console.log(value);
          await AsyncStorage.setItem('FBLAQuizuser', '');
        }
      } catch (error) {
        // Error saving data
      }
    });
    //change variable to reset the database if error occurs
    this.getQuestions(rows => {
      if (rows.length != 180) {
        db.transaction(tx => {
          tx.executeSql('drop table questions', [], () => {
            tx.executeSql(
              'Create table if not exists questions (id integer primary key autoincrement, prompt text, category integer, answers text, correctanswer integer)',
              [],
              () => {
                this.resetQuestions();
                console.log('Questions reset');
                this.log('questions reset');
              }
            );
          });
        });
      }
    });
    /*
    Categories:
    FBLA Events
    FBLA Rules
    FBLA Officers
    Business Skills
    FBLA Facts
    */
  }

  //calculate points earned from quiz
  scorify = (catnum, questionnum, secs, correct) => {
    let percent = 0;
    percent += questionnum / 600;
    percent +=
      (0.4 * Math.pow(questionnum / 180, 1 / 1.8) * correct) / questionnum;
    percent += catnum * 0.02;
    if (questionnum >= 25) {
      if (questionnum / secs > 0.2) {
        percent += 0.2;
      } else {
        percent += questionnum / secs;
      }
    } else {
      return Math.round(Math.pow(100000 * percent, 1 / 1.5));
    }
    return Math.round(Math.pow(100000 * percent, 1 / 1.5));
  };

  //read all questions
  resetQuestions = () => {
    //Long list of adding questions
    this.getQuestions(rows => {
      let true1 = true;
      console.log(rows.length + ' questions');
      if (rows.length == 0) {
        //FBLA Events
        if (true1) {
          //Is this an event?
          if (true1) {
            this.addQuestion(
              'True or False: Mobile App Development is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: 3D Animation is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Accounting I is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Accounting II is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Advertising is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Agribusiness is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: American Enterprise Project is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business & Financial Systems is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Broadcast Journalism is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Calculations is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Communications is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Ethics is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Financial Plan is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Law is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Business Plan is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Client Service is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Coding & Programming is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Community Service Project is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Computer Applications is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Computer Game & Simulation Programming is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Computer Problem Solving is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Cyber Security is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Database Design & Application is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Digital Video Production is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Economics is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: E-business is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Electronic Career Portfolio is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Emerging Business Issues is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Entrepreneurship is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Future Business Leader is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Global Business is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Graphic Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Health Care Administration is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Help Desk is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Hospitality Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Impromptu Speaking is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Insurance & Risk Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Business is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Business Communication is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Business Presentation is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Business Procedures is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to FBLA is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Financial Math is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Information Technology is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Parliamentary Procedure is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Introduction to Public Speaking is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Job Interview is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Journalism is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: LifeSmarts is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Local Chapter Annual Business Report is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Management Decision Making is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Management Informaton Systems is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Marketing is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Network Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Networking Concepts is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Organizational Leadership is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Parliamentary Procedure is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Partnership with Business Project is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Personal Finance is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Political Science is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Public Service Announcement is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Public Speaking is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Publication Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Sales Presetation is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Securities & Investments is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Social Media Campaign is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Sports & Entertainment Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Spreadsheet Applications is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Virtual Business Finance Challnge is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Virtual Business Management Challenge is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Website Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Word Processing is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              0
            );
            this.addQuestion(
              'True or False: Math 9-10 is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Entrepreneurial Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Financial Literacy is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Presentation is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Business Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Advertisement Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Business Procedure is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Computational Thinking is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Computer Design is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Database Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Economic Planning is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Future Entrepreneur is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: International Business is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Graphics Creation is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Insurance Policy is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Introduction to Economics is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Professional Interview is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Network Security is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Leadership is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Business Partnership is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Politics is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Investing is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Investment is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Social Media Management is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
            this.addQuestion(
              'True or False: Business Media is an FBLA Competitive Event.',
              0,
              ['True', 'False'],
              1
            );
          }
        }
        //FBLA Rules
        if (true1) {
          this.addQuestion(
            'True or False: FBLA Participants can only participate in one chapter event and one indiviudal/team event.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'What kinds of materials may be brought to a testing site for an objective test?',
            1,
            ['Pencil', '#2 Pencil', 'Paper', 'None'],
            3
          );
          this.addQuestion(
            'True or False: Calculators are provided for objective tests.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which date must national and state dues be paid?',
            1,
            [
              'April 1st',
              'March 1st',
              'January 1st',
              '1 week before the competition',
            ],
            1
          );
          this.addQuestion(
            'How many individuals may a state submit to nationals (excluding certain events)?',
            1,
            ['1', '4', '3', '5'],
            0
          );
          this.addQuestion(
            'How many individual events may an individual participate in?',
            1,
            ['3', '4', '1', '2'],
            2
          );
          this.addQuestion(
            'How many team events may an individual participate in?',
            1,
            ['3', '1', '4', '2'],
            1
          );
          this.addQuestion(
            'How many people can participate on a team for a team event (excluding certain events)?',
            1,
            ['2 or 3', '2-5', '3', '2'],
            0
          );
          this.addQuestion(
            'True or False: A competitor can only participate in the same event at the NLC once.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which questions are initially used to break ties on objective tests?',
            1,
            ['First 10', 'Last 20', 'Last 10', 'First 20'],
            2
          );
          this.addQuestion(
            'How many maximum winners are there at the NLC?',
            1,
            ['1', '3', '5', '10'],
            3
          );
          this.addQuestion(
            'True or False: Prejudged Projects sumbitted to FBLA-PBL become their property.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: Prejudged Projects sumbitted to FBLA-PBL do NOT become their property.',
            1,
            ['True', 'False'],
            1
          );
          this.addQuestion(
            'True or False: Reports submitted for events do not count the front page for page limits.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: Points can be deducted from presentation events for not following the dress code.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: There is a way for an individual to participate in multiple events.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Individuals can participate in multiple events if one of them is a(n) _____.',
            1,
            ['Objective Test', 'Pilot Event', 'Presentation'],
            1
          );
          this.addQuestion(
            'True or False: At the NLC, any FBLA member can participate in an online test and receive an award.',
            1,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: Preliminary performances are open to conference attendees.',
            1,
            ['True', 'False'],
            1
          );
        }
        //FBLA Officers
        if (true1) {
          this.addQuestion(
            'Which of these FBLA national officer positions does not exist?',
            2,
            ['President', 'Treasurer', 'Parliamentarian', 'Historian'],
            3
          );
          this.addQuestion(
            'How many national FBLA officers are there?',
            2,
            ['3', '5', '9', '10'],
            2
          );
          this.addQuestion(
            'Which FBLA national officer position is repeated for various regions?',
            2,
            ['President', 'Vice President', 'Treasurer', 'Parliamentarian'],
            1
          );
          this.addQuestion(
            'How many FBLA national vice presidents are there?',
            2,
            ['2', '3', '5', '7'],
            2
          );
          this.addQuestion(
            'Each FBLA national officer has their own _____.',
            2,
            ['Council', 'Secretary', 'Assistant'],
            0
          );
          this.addQuestion(
            'When is the submission deadline for FBLA national officer applications?',
            2,
            ['June 1st', 'May 15th', 'April 15th', 'July 1st'],
            1
          );
          this.addQuestion(
            'True or False: You can schedule a call with your FBLA National Officers to help with your chapter.',
            2,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: The FLBA national officer of President serves on the FBLA-PBL Board of Directors.',
            2,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which of these FBLA Officer positions is not elected?',
            2,
            ['President', 'Parliamentarian', 'Treasurer', 'Secretary'],
            1
          );
          this.addQuestion(
            'How is the FBLA national Parliamentarian chosen?',
            2,
            ['Election', 'Vote by Board of Directors', 'Parliamentary Exam'],
            2
          );
          this.addQuestion(
            'Eu Ro Wang is the current _______. (2018)',
            2,
            ['President', 'Parliamentarian', 'Treasurer', 'Secretary'],
            0
          );
          this.addQuestion(
            'Keerti Soundappan is the current _______. (2018)',
            2,
            ['President', 'Parliamentarian', 'Treasurer', 'Secretary'],
            3
          );
          this.addQuestion(
            'Galadriel Coury is the current _______. (2018)',
            2,
            ['President', 'Parliamentarian', 'Treasurer', 'Secretary'],
            2
          );
          this.addQuestion(
            'Michael Zhao is the current _______. (2018)',
            2,
            ['President', 'Parliamentarian', 'Treasurer', 'Secretary'],
            1
          );
          this.addQuestion(
            'True or False: Each of the 5 Vice Presidents represents their region.',
            2,
            ['True', 'False'],
            0
          );
        }
        //Business Skills
        if (true1) {
          this.addQuestion(
            'What is a name for someone who launches and runs a business?',
            3,
            [
              'Chief Executive Officer',
              'Entrepreneur',
              'Executive',
              'Industrialist',
            ],
            1
          );
          this.addQuestion(
            'True or False: A business financial plan is essential to starting a business.',
            3,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which of the following is most likely to help you secure a job?',
            3,
            [
              'High School Education',
              "Associate's Degree",
              "Bachelor's Degree",
              "Master's Degree",
            ],
            3
          );
          this.addQuestion(
            'The ______ states the approximate amount of time it takes an investment to double.',
            3,
            ['Doubling Law', 'Doubling Power', 'Rule of 72'],
            2
          );
          this.addQuestion(
            'A _____ is compensation to an agent for their services.',
            3,
            ['Commission', 'Salary', 'Wage', 'Payment'],
            0
          );
          this.addQuestion(
            'How much money is in a savings account with an initial principal of $1000 after 2 years if it is compounded annually at a rate of 10%?',
            3,
            ['$1100', '$1200', '$1210', '$1331'],
            2
          );
          this.addQuestion(
            'A(n) ______ person who authorizes another in an agency relationship.',
            3,
            ['Agent', 'Employee', 'Legal Representative', 'Principal'],
            3
          );
          this.addQuestion(
            "______ is the act of taking work created by someone else from the Internet and using it as one's own",
            3,
            ['Plagiarism', 'Phishing', 'Downloading', 'Spamming'],
            0
          );
          this.addQuestion(
            'Which of the following is not one of the major requirements for a contract?',
            3,
            ['Capacity', 'Time', 'Agreement', 'Consideration'],
            0
          );
          this.addQuestion(
            'A patent:',
            3,
            [
              'is good for up to 30 years',
              'can be transferred to another person',
              'protects intellectual property',
              'is granted for a trade secret',
            ],
            1
          );
          this.addQuestion(
            'What is the first part of a business plan?',
            3,
            [
              'Company Summary',
              'Financials',
              'Executive Summary',
              'Company Financials',
            ],
            2
          );
          this.addQuestion(
            'What is the second part of a business plan?',
            3,
            [
              'Company Summary',
              'Financials',
              'Executive Summary',
              'Company Profile',
            ],
            3
          );
          this.addQuestion(
            'What is the third part of a business plan?',
            3,
            [
              'Industry Analysis',
              'Financials',
              'Marketing Strategy',
              'Company Financials',
            ],
            0
          );
          this.addQuestion(
            'What is the fourth part of a business plan?',
            3,
            [
              'Company Summary',
              'Target Market',
              'Executive Summary',
              'Market Analysis',
            ],
            1
          );
          this.addQuestion(
            'What is the fifth part of a business plan?',
            3,
            [
              'Marketing',
              'Company Profile',
              'Executive Summary',
              'Competition Analysis',
            ],
            3
          );
          this.addQuestion(
            'What is the sixth part of a business plan?',
            3,
            [
              'Marketing Strategy',
              'Financials',
              'Executive Summary',
              'Company Financials',
            ],
            0
          );
          this.addQuestion(
            'What is the seventh part of a business plan?',
            3,
            [
              'Company Summary',
              'Operations',
              'Executive Summary',
              'Market Analysis',
            ],
            1
          );
          this.addQuestion(
            'What is the eighth part of a business plan?',
            3,
            [
              'Company Summary',
              'Operations',
              'Executive Summary',
              'Management and Organization',
            ],
            3
          );
          this.addQuestion(
            'True or False: Financials are a part of a business plan.',
            3,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: Taxes are included in Financials of a Business Plan.',
            3,
            ['True', 'False'],
            1
          );
        }
        //FBLA Facts
        if (true1) {
          this.addQuestion(
            'What does PBL stand for in FBLA-PBL?',
            4,
            [
              'People for Business Leadership',
              'Powerful Business Leaders',
              'Phi Beta Lambda',
              'People Business Learners',
            ],
            2
          );
          this.addQuestion(
            'True or False: There is a middle school division in FBLA.',
            4,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which is not a division in FBLA?',
            4,
            [
              'Professional Division',
              'FBLA',
              'Middle Level',
              'Elementary Level',
            ],
            3
          );
          this.addQuestion(
            'What percent of FBLA Participants are in 9th grade? (2018)',
            4,
            ['25%', '32%', '15%', '18%'],
            3
          );
          this.addQuestion(
            'What percent of FBLA Participants are in 10th grade? (2018)',
            4,
            ['30%', '18%', '25%', '29%'],
            2
          );
          this.addQuestion(
            'What percent of FBLA Participants are in 11th grade? (2018)',
            4,
            ['25%', '28%', '21%', '34%'],
            2
          );
          this.addQuestion(
            'What percent of FBLA Participants are in 12th grade? (2018)',
            4,
            ['29%', '15%', '28%', '20%'],
            0
          );
          this.addQuestion(
            'What grade has the most FBLA Participants? (2018)',
            4,
            ['9th Grade', '10th Grade', '11th Grade', '12th Grade'],
            3
          );
          this.addQuestion(
            'True or False: There are over 200,000 members of FBLA. (2018)',
            4,
            ['True', 'False'],
            1
          );
          this.addQuestion(
            'True or False: There are over 190,000 members of FBLA. (2018)',
            4,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: There are over 10,000 advisors in FBLA. (2018)',
            4,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'True or False: There are over 15,000 advisors in FBLA. (2018)',
            4,
            ['True', 'False'],
            1
          );
          this.addQuestion(
            'How many members of FBLA are there? (2018)',
            4,
            ['200,000+', '< 100,000', '150,000+'],
            2
          );
          this.addQuestion(
            'Which gender has more members in FBLA? (2018)',
            4,
            ['Male', 'Female'],
            1
          );
          this.addQuestion(
            'How many states have FBLA chapters? (2018)',
            4,
            ['45', '49', '50', '47'],
            3
          );
          this.addQuestion(
            'About how many chapters are there in FBLA? (2018)',
            4,
            ['2,000', '5,000', '6,000', '10,000'],
            1
          );
          this.addQuestion(
            'Which Division of FBLA has the most members? (2018)',
            4,
            [
              'High School',
              'Middle Level',
              'Professional Division',
              'Phi Beta Lambda',
            ],
            0
          );
          this.addQuestion(
            'True or False: FBLA-PBL is the largest career student business organization in the world. (2018)',
            4,
            ['True', 'False'],
            0
          );
          this.addQuestion(
            'Which age group is Phi Beta Lambda targeted to? (2018)',
            4,
            ['High School', 'Middle School', 'Collegiate', 'Elementary School'],
            2
          );
          this.addQuestion(
            'How many digits are in the number of participants of the FBLA-Middle Level? (2018)',
            4,
            ['3', '4', '5'],
            0
          );
          this.addQuestion(
            'What are the FBLA colors?',
            4,
            [
              'Green and Purple',
              'Yellow and Purple',
              'Red and Blue',
              'Blue and Gold',
            ],
            3
          );
          this.addQuestion(
            'Who founded FBLA?',
            4,
            ['Sam Dalton', '	Hamden L. Forkner', 'Lord Baden-Powell'],
            1
          );
          this.addQuestion(
            'When was the first state chapter chartered?',
            4,
            ['1942', '1948', '1947', '1949'],
            2
          );
          this.addQuestion(
            'What two words are repeated in the FLBA-PBL Creed?',
            4,
            ['We think', 'FBLA-PBL means', 'FBLA-PBL is', 'I believe'],
            3
          );
          this.addQuestion(
            'How many goals does FBLA have?',
            4,
            ['5', '9', '7', '8'],
            1
          );
          this.addQuestion(
            "The parliamentary procedure followed by FBLA is known as _____'s Rules of Order?",
            4,
            ['Robert', 'Sherman', 'Raymond', 'Ronald'],
            0
          );
          this.addQuestion(
            'What is date the FBLA fiscal year starts on?',
            4,
            ['June 30th', 'January 1st', 'July 1st', 'June 1st'],
            2
          );
          this.addQuestion(
            'What was the first FBLA state chapter?',
            4,
            ['Wyoming', 'New York', 'Florida', 'Iowa'],
            3
          );
          this.addQuestion(
            'When was PBL created?',
            4,
            ['1958', '1948', '1957', '1960'],
            0
          );
        }
      }
    });
    this.log('Questions added');
  };

  //add a quiz to the quiz log
  addQuiz = async (
    categories,
    questions,
    seconds,
    correct,
    points,
    key,
    duration
  ) => {
    let d = new Date();
    await db.transaction(async tx => {
      await tx.executeSql(
        'insert into quizzes (categories,questions,seconds,correct, date, points, key, duration) values (?,?,?,?,?,?,?,?)',
        [categories, questions, seconds, correct, d, points, key, duration]
      );
    });
  };

  //get all the recorded quizzes
  getQuizzes = async callback => {
    await db.transaction(async tx => {
      await tx.executeSql('select * from quizzes', [], (_, { rows }) => {
        callback(rows);
      });
    });
  };

  //add a message to the log
  log = async message => {
    await db.transaction(async tx => {
      tx.executeSql('insert into log (message) values (?)', [message]);
    });
  };

  //add question id to already answered
  addToQuestionLog = async id => {
    await db.transaction(async tx => {
      await tx.executeSql('insert into answered (id) values (?)', [id]);
      this.log('Question logged');
    });
  };

  //get question log
  getQuestionLog = async callback => {
    await db.transaction(async tx => {
      await tx.executeSql('select * from answered', [], (_, { rows }) => {
        this.log('Question log retrieved');
        console.log(rows.length);
        callback(rows);
      });
    });
  };

  //clear question log
  clearLog = async () => {
    await db.transaction(async tx => {
      await tx.executeSql('delete * from answered');
    });
  };

  //retrieve the entire log
  getLog = async callback => {
    await db.transaction(async tx => {
      await tx.executeSql('select * from log', [], (_, { rows }) => {
        callback(rows);
      });
    });
  };

  //change the quiz settings
  updateSettings = async settingsobj => {
    await db.transaction(async tx => {
      await tx.executeSql(
        'update settings set categories=?, questions=?, seconds=?',
        [
          JSON.stringify(settingsobj.categories),
          settingsobj.questions,
          settingsobj.seconds,
        ]
      );
      this.log('Settings updated');
    });
  };
  //get current quiz settings
  getSettings = async callback => {
    await db.transaction(async tx => {
      await tx.executeSql(
        'select * from settings where id=1',
        [],
        (_, { rows }) => {
          this.log('Settings retrieved');
          callback(rows);
        }
      );
    });
  };

  //add a question to the question bank
  addQuestion = async (prompt, category, answers, correctanswer) => {
    await db.transaction(async tx => {
      await tx.executeSql(
        'insert into questions (prompt,category,answers,correctanswer) values (?,?,?,?)',
        [prompt, category, JSON.stringify(answers), correctanswer]
      );
    });
  };

  //get specific questions by id from the bank
  getQuestion = async (questionId, callback) => {
    await db.transaction(async tx => {
      await tx.executeSql(
        'select * from questions where id = ?',
        [questionId],
        (_, { rows }) => {
          this.log('Question retrieved');
          callback(rows);
        }
      );
    });
  };

  //get all the quesitons
  getQuestions = async callback => {
    await db.transaction(async tx => {
      await tx.executeSql('select * from questions', [], (_, { rows }) => {
        this.log('Questions retrieved');
        callback(rows);
      });
    });
  };

  //get questions from a specific category
  getQuestionsFromCategory = async (category, callback) => {
    await db.transaction(async tx => {
      await tx.executeSql(
        'select * from questions where category = ?',
        [category],
        (_, { rows }) => {
          callback(rows);
        }
      );
    });
  };

  //get all the questions from specific categories
  getQuestionsFromCategories = async (categories, callback) => {
    let selectedcatquestions = [];
    let addcountq = 0;
    for (let i = 0; i < categories.length; i++) {
      this.getQuestionsFromCategory(categories[i], rows => {
        selectedcatquestions = selectedcatquestions.concat(rows._array);
        addcountq++;
        if (addcountq == categories.length) {
          this.log('Questions retrieved from categories');
          callback(selectedcatquestions);
        }
      });
    }
  };
}
