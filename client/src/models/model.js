export default class Model {
    constructor() {
      this.data = {
        questions: [
                    {
                      qid: 'q1',
                      title: 'Programmatically navigate using React router',
                      text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                      tagIds: ['t1', 't2'],
                      askedBy : 'JoJi John',
                      askDate: new Date('December 17, 2020 03:24:00'),
                      ansIds: ['a1', 'a2'],
                      views: 10,
                    },
                    {
                      qid: 'q2',
                      title: 'android studio save string shared preference, start activity and load the saved string',
                      text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                      tagIds: ['t3', 't4', 't2'],
                      askedBy : 'saltyPeter',
                      askDate: new Date('January 01, 2022 21:06:12'),
                      ansIds: ['a3', 'a4', 'a5'],
                      views: 121,
                    }
                  ],
        tags: [
          {
            tid: 't1',
            name: 'react',
          },
          {
            tid: 't2',
            name: 'javascript',
          },
          {
            tid: 't3',
            name: 'android-studio',
          },
          {
            tid: 't4',
            name: 'shared-preferences',
          }
        ],
  
        answers: [
          {
            aid: 'a1',
            text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
            ansBy: 'hamkalo',
            ansDate: new Date('March 02, 2022 15:30:00'),
          },
          {
            aid: 'a2',
            text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
            ansBy: 'azad',
            ansDate: new Date('January 31, 2022 15:30:00'),
          },
          {
            aid: 'a3',
            text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
            ansBy: 'abaya',
            ansDate: new Date('April 21, 2022 15:25:22'),
          },
          {
            aid: 'a4',
            text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
            ansBy: 'alia',
            ansDate: new Date('December 02, 2022 02:20:59'),
          },
          {
            aid: 'a5',
            text: 'I just found all the above examples just too confusing, so I wrote my own. ',
            ansBy: 'sana',
            ansDate: new Date('December 31, 2022 20:20:59'),
          }
        ]
      };
    }
    // add methods to query, insert, and update the model here. E.g.,
    // getAllQstns() {
    //   return this.data.questions;
    // }
    addQuestion(question) {
      console.log("added")
      //this.questions.push(question);
      question.qid = 'q' + (this.data.questions.length + 1);
      question.ansIds = [];
  
      this.data.questions.push(question);
    }
    
    getQuestionCount() {
      return this.questions.length;
    }
  
    numOfQuestionsperTag(target){
      let counter = 0;
      for(let question of this.data.questions){
        for(let tagid of question.tagIds){
          if(tagid==target){
            counter++;
          }
        }
      }
      return counter;
  
    }
    num_of_tags(){
      return this.data.tags.length;
    }
    getQuestionCount(){
      return this.data.questions.length;
    }
  
    
    
    // add methods to query, insert, and update the model here. E.g.,
     getAllQuestions() {
       return this.data.questions;
     }
    addanswer(qid, ansBy, text){
      const answerid = "a"+(this.data.answers.length+1);
      const q = this.getquestionbyId(qid);
      q.ansIds.push(answerid);
      const newanswer ={
        aid:answerid,
        text: text,
        ansBy:ansBy,
        ansDate: new Date(),
      };
      this.data.answers.push(newanswer);
    
    }
  
    getquestionbyId(questionid){
      return this.data.questions.find(question=>question.qid==questionid);
    }
    getAnswersofquestion(questionid){
      const question = this.getquestionbyId(questionid);
      if(!question){
        return [];
      }else{
        const answers = [];
        for(let id of question.ansIds){
          const answer = this.data.answers.find(ans=>ans.aid==id);
          if(answer){
            answers.push(answer);
          }
        }
        answers.sort((d1,d2)=>d2.ansDate-d1.ansDate) //newest answers appear first. 
        return answers;
      }
    }
    getlatestanswerdate(question){
      if(question.ansIds.length==0){
        return new Date(0);
      }else{
        let latestdate = new Date(0);
        
        for(let i =0; i<question.ansIds.length;i++){
          let answer = this.data.answers.find(answer=>answer.aid==question.ansIds[i]);
          if(answer.ansDate>latestdate){
            latestdate = answer.ansDate;
          }  
        } 
        return latestdate
      }
    }
    /*Clicking the Newest button should display all questions in the model
      sorted by the date they were posted. The most recently posted questions
      should appear first.(default)*/
    sortbynewest(question_list){
       question_list.sort((q1,q2)=>q2.askDate-q1.askDate);
    }
    /*Clicking the Active button should display all questions in the model sorted
    by answer activity. The most recently answered questions must appear
    first.*/
    sortbyactive(question_list){
      question_list.questions.sort((q1,q2)=> this.getlatestanswerdate(q2)-this.getlatestanswerdate(q1));
    }
  /*The Unanswered button should display only the questions that have no
  answers associated with them*/
  getunanswered(question_list){
    
    return question_list.filter(question=> question.ansIds.length===0);
  }
  getTagsOfQuestion(question) {
    const tagNames = [];
    if (Array.isArray(question.tagIds)) {
      for (let tagId of question.tagIds) {
        const tag = this.data.tags.find((t) => t.tid === tagId);
        if (tag) {
          tagNames.push(tag.name);
        }
      }
    }
    return tagNames;
  }
  get_tags_of_q(question){
    const result = [];
    if (!Array.isArray(question.tagIds)) {
      return result; 
    }
    //if (this.questions.tagIds){//make sure that tagIDs exist to not caues error
      for(let tagid of question.tagIds){
        for(let target of this.data.tags){
          if(tagid==target.tid){  
           result.push(target);
          }
        }
      }
  //}
    return result;
    
  }
  addview(question){
    question.views = question.views +1;
  }
  
  getquestionsoftagid(targetid){
    let questions = [];
    this.data.questions.forEach((question) => {
      for(let id of question.tagIds){
        if(id==targetid){
          questions.push(question);
        }
      } 
    });
    return questions;
  
  
  
  }
  
  }
  