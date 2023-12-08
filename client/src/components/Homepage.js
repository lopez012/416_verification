import React, { Component } from 'react';
import Question from './Homepage/Question'; // Import the Question component
import MenuBar from './Homepage/MenuBar';
import QuestionsHeader from './Homepage/questionsHeader.js';
import QuestionForm from './QuestionsForm/QuestionsForm';
import Header from './Homepage/Header.js';
import Model from '../models/model'
import AnswerPage from './answerpage/Answerpage';
import TagPage from './TagPage/TagPage.js'
import TagPageHeader from './TagPage/tagPageHeader.js'
import '../stylesheets/App.css'
import SearchHeader from './Search/SearchHeader';
import axios from 'axios';

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      displayQuestionForm: false,
      displayQuestionHeader: true,
      displaySearchHeader:false,
      questions: [], 
      viewedQuestion: null,
      showAnswer : false,
      searchResults: [],
      tagpage:false,
      displayquestions:true,
      tagQuestions:[],
      tagclicked:false,
      sortedbynewest:false,
      sortedbyactive:false,
      sortedbyunanswered:false
    };
    this.model = new Model();
    this.handlehomepage = this.handlehomepage.bind(this);
    this.handletagpage = this.handletagpage.bind(this);   
    this.handletagclick = this.handletagclick.bind(this);
    
  }
  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:8000/questions/all'); 
      const questions = response.data;
      this.setState({ questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }
  handlehomepage(event){
    this.setState({
      displayQuestionForm:false,
      displayQuestionHeader:true,
      displaySearchHeader :false,
      viewedQuestion:null,
      showAnswer:false,
      tagpage:false,
      displayquestions:true,
      tagclicked:false,
      initSearch : false,
    })

  }
  handletagpage(event){
    this.setState({
      tagpage: true,
      displayQuestionForm:false,
      displayQuestionHeader:false,
      displaySearchHeader: false,
      viewedQuestion:null,
      showAnswer:false,
      displayquestions:false,
      initSearch: false
    })
  }
  handletagclick(questionsoftag){
    this.setState({
      tagclicked:true,
      tagQuestions:questionsoftag,
      tagpage:false,
      displayquestions:true,
      initSearch :false
    })
  }
  sortbynewest(question_list){
    return question_list.sort((q1,q2)=>q2.askDate-q1.askDate);
  }
  getlatestanswerdate(question){
    if(question.answers.length===0){
      return new Date(0);
    }else{
      let latestdate = new Date(0);
      
      for(let i =0; i<question.answers.length;i++){
        let answer = this.model.data.answers.find(answer=>answer.aid===question.answers[i]);
        if(answer.ansDate>latestdate){
          latestdate = answer.ansDate;
        }  
      } 
      return latestdate
    }
  }
  sortbyactive(question_list){
    return question_list.questions.sort((q1,q2)=> this.getlatestanswerdate(q2)-this.getlatestanswerdate(q1));
  }
  getunanswered(question_list){
    let sortedList = question_list.filter(question=> question.answers.length===0);
    console.log("Sorted by unanswered:", sortedList);

    return sortedList;
  }
  renderQuestions() {
    let questions = this.state.questions;
    
    if(this.state.tagclicked){
      questions = this.state.tagQuestions;
    }else if(this.state.sortedbyactive){
      questions = this.sortbyactive(this.state.questions);
    }else if(this.state.sortedbyunanswered){
      questions = this.getunanswered(this.state.questions);
    }else{
        questions = this.sortbynewest(this.state.questions);
    }
    
      return questions.map((question) => (
        <Question
          key={question._id}
          question={question}
          onViewQuestion={this.handleViewQuestion}
          tagName={question.tags} 
        />
      ));
  }

  
  toggleQuestionForm = () => {
    this.setState((prevState) => ({
      displayQuestionForm: !prevState.displayQuestionForm,
      displayQuestionHeader: false,
      displaySearchHeader : false,
      initSearch : false,
      tagpage:false
    }));
  };

  handleViewQuestion = async (qid) => {
    const viewedQuestion = this.state.questions.find((question) => question._id === qid);
    if (viewedQuestion) {
      try {
        const response = await axios.post(`http://localhost:8000/questions/${qid}/view`);
        viewedQuestion.views = response.data.views;
        this.setState({
          showAnswer: true,
          viewedQuestion,
          displayQuestionHeader: false,
          initSearch: false,
          displaySearchHeader: false,
        });
      } catch (error) {
        console.error('Error updating view count:', error);
      }
      
    }
  };


  handleBackToQuestions = () => {
    this.setState({
      viewedQuestion: null,
      showAnswer: false,
      initSearch : false,
    });
  }
  handlesortedbynewest = () => {
    this.setState({
      sortbynewest:true,
      sortbyactive:false,
      sortedbyunanswered:false,

    });
  }
  handlesortedbyactive = () => {
    this.setState({
      sortbynewest:false,
      sortbyactive:true,
      sortedbyunanswered:false
    });
  }
  handlesortedbyunanswered = () => {
    console.log("Sort by newest clicked");

    this.setState({
      sortbynewest:false,
      sortbyactive:false,
      sortedbyunanswered:true,
      displayquestions:true
    },()=> {
      console.log('State after clicking Unanswered:', this.state);      
    });
  }
  handleSearch = (searchString) => {
    if(searchString.trim() === "") {
     return;
    } 
    const searchWords = searchString.toLowerCase().split(/\s+/);
    const tagSearch = searchWords.filter((word) => word.startsWith('[') && word.endsWith(']'));
    const nonTagSearch = searchWords.filter((word) => !word.startsWith('[') || !word.endsWith(']'));

    const tagsToSearch = tagSearch.map((tag) => tag.replace(/\[|\]/g, '').toLowerCase());
    let searchResults;

    if (nonTagSearch.length === 0) {
      searchResults = this.state.questions.filter((question) => {
        const tags = this.model.getTagsOfQuestion(question).map((tag) => tag.toLowerCase());
        return tagsToSearch.some((tagToSearch) => tags.includes(tagToSearch));
      });
    }
    else {
      searchResults = this.state.questions.filter((question) => {
        const title = question.title.toLowerCase();
        const text = question.text.toLowerCase();
        const tags = this.model.getTagsOfQuestion(question).map((tag) => tag.toLowerCase());
        const tagsMatch = tagsToSearch.some((tagToSearch) => tags.includes(tagToSearch));
        const otherWordsMatch = nonTagSearch.every((word) => title.includes(word) || text.includes(word));
        return tagsMatch || otherWordsMatch;
      });
    }

    
  
    this.setState({
      displayQuestionHeader: false,
      displaySearchHeader : true,
      searchResults,
      displayQuestionForm: false,
      initSearch : true
    });
  };

  renderSearch = () => {
    console.log('Search initiated');
    console.log(this.state.searchResults);
    if (this.state.searchResults.length === 0) {
      console.log("hello");
      return(
      <div className="no-questions-found">
        <p style={{ fontSize: '25px', marginTop: '200px' }}>
          No Questions Found With given Tags/text
        </p>
      </div>
      );
    } else {
      const searchResults = this.state.searchResults.map((question) => (
        <Question
          key={question.qid}
          question={question}
          onViewQuestion={(qid) => this.handleViewQuestion(qid)}
          tagName={this.model.getTagsOfQuestion(question)}
        />
      ));
      return <div className="question-list">{searchResults}</div>;
    }
  };

  handleQuestionSubmit = async (formData) => {
    console.log('Question submitted:', formData);
    const title = formData.questionTitle;
    const text = formData.questionText;
    const Tags = formData.tags;
    const askedBy = formData.username

    const tagArray = Tags.trim().split(/\s+/).slice(0, 5);
  
    const tags = [];

    for (let tag of tagArray) {
      console.log(tag);
      try {
        const response = await axios.get(`http://localhost:8000/tags/${encodeURIComponent(tag)}`);
        const existingTag = response.data;
        // If the tag exists
        if (existingTag) {
          tags.push(existingTag._id);
        } else {
          const newTagResponse = await axios.post('http://localhost:8000/tags/add', { //add to tag collection
            name: tag,
          });
          const res = await axios.get(`http://localhost:8000/tags/${encodeURIComponent(tag)}`);
          const t = res.data;

          tags.push(t._id); //not pushing id

        }
      } catch (error) {
        console.error('Error processing tags:', error.response.data);
      }
    }
    console.log(tags)
   
    try {
      const response = await axios.post('http://localhost:8000/questions/add', {
        title,
        text,
        tags,
        askedBy
      });
      console.log('Question added successfully:', response.data);
      const updatedResponse = await axios.get('http://localhost:8000/questions/all');
      const updatedQuestions = updatedResponse.data;
      this.setState({
        displayQuestionForm: false,
        displayQuestionHeader: true,
        showAnswer: false,
        viewedQuestion: null,
        displaySearchHeader: false,
        displayquestions: true,
        questions: updatedQuestions,
      });
    } catch (error) {
      console.error('Error adding question:', error.response.data);
    }
  };
  render() {
    const { user } = this.props;
    console.log("Logout prop in Homepage:", this.props.logout);
    return (
      
      
      <div className="homepage">
        <Header onSearch={this.handleSearch} logout ={this.props.logout} user= {this.props.user} />
        {user && (<h1>Welcome {user.username} !</h1>)}
        <MenuBar className = "menubar" showhomePage = {this.handlehomepage} showtagPage = {this.handletagpage} onQuestions = {this.state.displayquestions} ontagpage = {this.state.tagpage}/>

        <div className= "right_content">
          {this.state.displayQuestionHeader && (
            <QuestionsHeader
              totalQuestions={this.state.questions.length}
              onAskQuestion={this.toggleQuestionForm}
              sortbynewest = {this.handlesortedbynewest}
              sortbyactive ={this.handlesortedbyactive}
              sortbyunanswered ={this.handlesortedbyunanswered} 
            />
          )}
          {this.state.displaySearchHeader && (
            <SearchHeader
              totalQuestions={this.state.searchResults.length}
              onAskQuestion={this.toggleQuestionForm}
              sortbynewest = {this.handlesortedbynewest}
              sortbyactive ={this.handlesortedbyactive}
              sortbyunanswered ={this.handlesortedbyunanswered} 
            />
          )}
          {
            this.state.initSearch ? this.renderSearch() :
            this.state.displayQuestionForm
          ? (<QuestionForm onQuestionSubmit={this.handleQuestionSubmit} />
          ) : this.state.showAnswer? (
             <AnswerPage
                question={this.state.viewedQuestion}
                onBackToQuestions={this.handleBackToQuestions}
                //model={this.model}
                onAskQuestion={this.toggleQuestionForm}
              />
            )
          : this.state.displayquestions?
          this.renderQuestions():null
          
          
          }
          {this.state.tagpage && (
            <>
            <TagPageHeader onAskQuestion={this.toggleQuestionForm}/>
            <TagPage onTagclick= {this.handletagclick}  />
            </>
          )}
        </div>
    </div>
  );
}
}

export default Homepage;