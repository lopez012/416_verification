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
import UserProfile from './profiles/userProfile.js';

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      displayQuestionForm: false,
      displayQuestionHeader: true,
      displaySearchHeader:false,
      questions: [],
      question_count:0, 
      viewedQuestion: null,
      showAnswer : false,
      searchResults: [],
      tagpage:false,
      displayquestions:true,
      tagQuestions:[],
      tagclicked:false,
      sortedbynewest:false,
      sortedbyactive:false,
      sortedbyunanswered:false,
      page_controls:true,
      current_page:0,
      question_per_page:5,
      currUser: null,
      showUserProfile: false, 
      changeForm: false,
      questionToPass: null,
      tagString : null,
      answerDelete : false,
      tagDelete : false,
      tagsToPass : null,
    };
    this.model = new Model();
    this.handlehomepage = this.handlehomepage.bind(this);
    this.handletagpage = this.handletagpage.bind(this);   
    this.handletagclick = this.handletagclick.bind(this);
   // this.refreshQuestionData = this.refreshQuestionData.bind(this);
    
  }
  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:8000/questions/all'); 
      const questions = response.data;
      this.setState({ questions });
      let count = questions.length;
      this.setState({question_count: count})
      console.log(count);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    
    if(this.props.user){
      console.log(`user loggedin with id ${this.props.user._id}`);
      try{
        const res = await axios.get(`http://localhost:8000/users/${this.props.user._id}`);
        if(res.data){
          console.log('user found!');
          this.setState({currUser:res.data});
        }else{
          console.log("user not found")
        }

      }catch(error){
        console.error('err',error);
      }
    }
  }
 
  handlehomepage(event){
    this.fetchQuestions();
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
      page_controls:true,
      showUserProfile:false,
      changeForm: false,
      answerDelete:false,
      tagDelete : false,

      
      
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
      initSearch: false,
      page_controls:false,
      showUserProfile: false,
      changeForm: false,
      answerDelete : false,

    })
  }
  handletagclick(questionsoftag){
    this.setState({
      tagclicked:true,
      tagQuestions:questionsoftag,
      tagpage:false,
      displayquestions:true,
      initSearch :false, 
      showUserProfile:false,
      changeForm: false,
      answerDelete : false,

    })
  }
  sortbynewest(question_list) {
    return question_list.sort((q1, q2) => {
        const date1 = new Date(q1.askDate);
        const date2 = new Date(q2.askDate);
        return date2 - date1;
    });
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
  total_pages = () =>{
    return Math.ceil(this.state.questions.length/this.state.question_per_page);
  };

  next_page = ()=>{
    this.setState(prevState =>({
      current_page: (prevState.current_page +1)% this.total_pages()

    }));
  };
  prev_page =()=>{
    this.setState(prevState=>({
      current_page: prevState.current_page===0?0: prevState.current_page-1


    }));
  };
  handleUpVote = async (qid) => {
    const { user } = this.props;    
    const userId = user._id
    const userReputation = user.reputation;
    const response = await axios.get(`http://localhost:8000/questions/${qid}`);
    const askedBy = response.data.askedBy;
    if (userReputation >= 50) {
     if(askedBy !== user._id){
    try {
      console.log(qid, user._id);
      
      const vote = await axios.post(`http://localhost:8000/questions/${qid}/${userId}/upvote`);
      const voteMessage = vote.data.message;
      const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
      this.fetchQuestions();

      console.log(response);
    } 
    catch (error) {
      console.error('Error:', error);
    }}
    else {
      alert("can't upvote your own own questions");
    }
    }
    else {
      alert('You need 50 or more reputation to upvote.');
    }
  };



  handleDownvote = async (qid) => {
    const {  user } = this.props;
    const userReputation = user.reputation;
    const response = await axios.get(`http://localhost:8000/questions/${qid}`);
    const askedBy = response.data.askedBy;
    if (userReputation >= 50){
      if(askedBy !== user._id){
    try {

      const vote = await axios.post(`http://localhost:8000/questions/${qid}/${user._id}/downvote`);
      const voteMessage = vote.data.message;
      const response = await axios.post(`http://localhost:8000/users/${askedBy}/${voteMessage}`);
      this.fetchQuestions();
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
    }
    else {
      alert("can't downvote your own own questions");
    }
  }
   else {
    alert('You need 50 or more reputation to downvote.');
   }
  };

    fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/questions/all');
      const questions = response.data;
      this.setState({ questions });
      let count = questions.length;
      this.setState({ question_count: count });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  handleUserProfile = () => {
    this.setState({
      showUserProfile: true,
      displayQuestionForm: false,
      displayQuestionHeader: false,
      displaySearchHeader:false, 
      tagpage:false,
      displayquestions:false,
      page_controls: false,
      changeForm: false,
      showAnswer: false,
      answerDelete : false,
      tagDelete : false,

    });
  };
  

  renderQuestions() {
    let questions = this.state.questions;
    
    if(this.state.tagclicked){
      return this.state.tagQuestions.map((question) => (
        <Question
          key={question._id}
          question={question}
          onViewQuestion={this.handleViewQuestion}
          tagName={question.tags} 
          userId={this.props.user} // Pass the user ID to Question component
          onUpVote={this.handleUpVote} // Pass the upvote function to Question component
          onDownVote={this.handleDownvote} // Pass the downvote function to Question component

        />
    ));
    }else if(this.state.sortedbyactive){
      questions = this.sortbyactive(this.state.questions);
    }else if(this.state.sortedbyunanswered){
      questions = this.getunanswered(this.state.questions);
    }else{
        questions = this.sortbynewest(this.state.questions);
    }
    const start_ind = this.state.current_page * this.state.question_per_page;
    const questions_on_page = questions.slice(start_ind, start_ind+this.state.question_per_page)

    const questions_on_page_comp = questions_on_page.map((question) => (
      <Question
        key={question._id}
        question={question}
        onViewQuestion={this.handleViewQuestion}
        tagName={question.tags} 
        onUpVote={this.handleUpVote} // Pass the upvote function to Question component
        onDownVote={this.handleDownvote} // Pass the downvote function to Question component
        
      />
  ));
    
  return (
    <div>
      <div className="question-list">
        {questions_on_page_comp}
      </div>

    </div>
  );

  }

  
  toggleQuestionForm = () => {
    this.setState((prevState) => ({
      displayQuestionForm: !prevState.displayQuestionForm,
      displayQuestionHeader: false,
      displaySearchHeader : false,
      initSearch : false,
      tagpage:false,
      page_controls:false,
      showUserProfile:false,
      answerDelete : false,
      tagDelete : false,

    }));
  };

  handleViewQuestion = async (qid) => {
    const viewedQuestion = this.state.questions.find((question) => question._id === qid);
    if (viewedQuestion) {
      try {

        console.log(qid);
        const response = await axios.post(`http://localhost:8000/questions/${qid}/view`);
        viewedQuestion.views = response.data.views;
        this.setState({
          showAnswer: true,
          viewedQuestion,
          displayQuestionHeader: false,
          initSearch: false,
          displaySearchHeader: false,
          page_controls:false,
          showUserProfile: false,
          changeForm: false,
          tagDelete : false,
        });
      } catch (error) {
        console.error('Error updating view count:', error);
      }
      
    }
  };


  handleBackToQuestions = () => {
    this.fetchQuestions();
    this.setState({
      viewedQuestion: null,
      showAnswer: false,
      initSearch : false,
      page_controls:true,
      answerDelete : false,
      tagDelete : false,

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
  handleUserAnswersPage = async (questions1) => {
    console.log("zhi");
    console.log(questions1);
    if(questions1.length === 0) {
      alert("You answered no questions.");
    }
    else {
      const filtered = this.state.questions.filter(question => questions1.includes(question._id));
      this.setState({questions: filtered});
      console.log("hello");
      this.setState({
        displayQuestionHeader: true,
        displayquestions:true,
        tagQuestions:[],
        page_controls:true,
        current_page:0,
        question_per_page:5,
        showUserProfile: false,
        answerDelete : true,
        tagDelete : false,
      });
    }
  }

  handleUserTagsPage = async (tags) => {
    console.log("jell");
    if(tags.length === 0) {
      alert("You have created no tags");
    }
    this.setState({
      tagpage:true,
      tagQuestions:[],
      tagDelete : true,
      showUserProfile: false,
      tagsToPass : tags,
    });
    

  }
  handleSearch = async (searchString) => {
    if(searchString.trim() === "") {
      this.handleBackToQuestions();
     return;
    } 
    const searchWords = searchString.toLowerCase().split(/\s+/);
    const tagSearch = searchWords.filter((word) => word.startsWith('[') && word.endsWith(']'));
    const nonTagSearch = searchWords.filter((word) => !word.startsWith('[') || !word.endsWith(']'));

    const tagsToSearch = tagSearch.map((tag) => tag.replace(/\[|\]/g, '').toLowerCase());
    
    const tagIds = await Promise.all(tagsToSearch.map(async (tagName) => {
      try {
          const response = await axios.get(`http://localhost:8000/tags/${tagName}/01`);
          return response.data?._id;
      } catch (error) {
          console.error('Error fetching tag ID:', error);
          return null;
      }
  }));
  const validTagIds = tagIds.filter(id => id !== null);
  console.log(validTagIds);

    let searchResults;
    console.log("fdd");
  console.log(validTagIds);
    if (nonTagSearch.length === 0) {
      searchResults = this.state.questions.filter((question) => {
          const tags = question.tags.map((tag) => tag._id);
          return tags.some((tagId) => validTagIds.includes(tagId));
      });
  }
    else {
      searchResults = this.state.questions.filter((question) => {
        const title = question.title.toLowerCase();
        const text = question.text.toLowerCase();
        const tags = question.tags.map((tag) => tag._id);
        const tagsMatch = tags.some((tagId) => validTagIds.includes(tagId));
        const otherWordsMatch = nonTagSearch.every((word) => title.includes(word) || text.includes(word));
        return tagsMatch || otherWordsMatch;
      });
    }

    
  
    this.setState({
      displayQuestionHeader: false,
      displaySearchHeader : true,
      searchResults,
      displayQuestionForm: false,
      initSearch : true,
      ansDelete : false,
      tagDelete : false,
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
    } 
    else {
      const totalSearchPages = Math.ceil(this.state.searchResults.length / this.state.question_per_page);
      const startSearchIndex = this.state.current_page * this.state.question_per_page;
      const searchResultsOnPage = this.state.searchResults.slice(
        startSearchIndex,
        startSearchIndex + this.state.question_per_page
      );
  
      const searchResultsComp = searchResultsOnPage.map((question) => (
        <Question
          key={question.qid}
          question={question}
          onViewQuestion={(qid) => this.handleViewQuestion(qid)}
          tagName={question.tags}
          onUpVote={this.handleUpVote}
          onDownVote={this.handleDownvote}
        />
      ));
  
      return (
        <div>
          <div className="question-list">{searchResultsComp}</div>
          <div className="pagination-buttons">
            <button onClick={this.prev_page} disabled={this.state.current_page === 0}>
              Prev
            </button>
            <button onClick={this.next_page} disabled={this.state.current_page === totalSearchPages - 1}>
              Next
            </button>
          </div>
        </div>
      );
    }
  };


  handleQuestionChange = async (question) => {
    try {
      console.log(question.tags);
      const response = await axios.get(`http://localhost:8000/tags/tagNames/${question.tags.join(',')}`);
      const tagString = response.data; 
      console.log('Tag String:', tagString);
      this.setState({
        displayQuestionForm: true,
        showUserProfile: false,
        changeForm: true,
        questionToPass: question,
        tagString: tagString,
      });
    } catch (error) {
      console.error('Error fetching tag names:', error);
      // Handle error if needed
    }
  }
  handleDeleteQuestion = async (question) => {
    const response = await axios.post(`http://localhost:8000/questions/${question._id}/delete`);
    console.log(response.data);
    if (response.data.answerIds.length > 0) {
    const responsed = await axios.post(`http://localhost:8000/answers/${response.data.answerIds}/delete`);
    const combinedCommentArray = response.data.commentIds.concat(responsed.data.commentArrays);
    
    console.log(combinedCommentArray); 
    if (combinedCommentArray.length > 0) {
      const respons = await axios.post(`http://localhost:8000/comments/${combinedCommentArray}/delete`);
    }
    }
    this.fetchQuestions();
    alert("Question deleted!");

    this.setState({
      showUserProfile: false,
      displayQuestionForm: false,
      displayQuestionHeader: true,
      displaySearchHeader:true,   
      tagpage:false,
      displayquestions:true,
      page_controls: true,
      changeForm: true,

    });
  }
  handleQuestionMod = async (question, formData) => {
    const title = formData.questionTitle;
    const text = formData.questionText;
    const Tags = formData.tags;
    const tags = Tags.trim().split(/\s+/).slice(0, 5);
    const summary = formData.summary;
    const id = question._id;
    const response = await axios.post('http://localhost:8000/questions/modify', {
      id,
      title,
      text,   
      summary,
    });
    console.log(tags);
    const response01 = await axios.post('http://localhost:8000/questions/tagmodify', {
      id,
      tags
    });
    this.fetchQuestions();

    this.setState({
      displayQuestionForm: false,
      displayQuestionHeader: true,
      showAnswer: false,
      viewedQuestion: null,
      displaySearchHeader: false,
      displayquestions: true,
      page_controls:true,
      changeForm: false,

    });

  }


  handleQuestionSubmit = async (formData) => {
    console.log('Question submitted:', formData);
    const title = formData.questionTitle;
    const text = formData.questionText;
    const Tags = formData.tags;
    const { user } = this.props;
    const askedBy = user._id;
    const summary = formData.summary;

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
            createdBy: user._id
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
        askedBy, 
        summary,
      });
      console.log('Question added successfully:', response.data);
      const updatedResponse = await axios.get('http://localhost:8000/questions/all');
      const updatedQuestions = updatedResponse.data;
      let updated_q_count = updatedQuestions.length;

      this.setState({
        displayQuestionForm: false,
        displayQuestionHeader: true,
        showAnswer: false,
        viewedQuestion: null,
        displaySearchHeader: false,
        displayquestions: true,
        questions: updatedQuestions,
        page_controls:true,
        question_count:updated_q_count,
        changeForm: false,

      });
    } catch (error) {
      console.error('Error adding question:', error.response.data);
    }
  };
  render() {
    const { user } = this.props;

    
    //console.log("Logout prop in Homepage:", this.props.logout);
    return (
      
      <div>
      <div className="homepage">
        <Header onSearch={this.handleSearch} logout ={this.props.logout} user= {this.props.user} />
        {user && (
          <div>
            <h1>Welcome {user.username}!</h1>
            <button onClick={this.handleUserProfile}>Go to Profile</button>
          </div>
        )}
        {this.state.displayQuestionHeader && (
            <QuestionsHeader
              totalQuestions={this.state.questions.length}
              onAskQuestion={this.toggleQuestionForm}
              sortbynewest = {this.handlesortedbynewest}
              sortbyactive ={this.handlesortedbyactive}
              sortbyunanswered ={this.handlesortedbyunanswered} 
              user = {this.props.user}
              ansdel = {this.state.answerDelete}
            />
          )}
        <MenuBar className = "menubar" showhomePage = {this.handlehomepage} showtagPage = {this.handletagpage} onQuestions = {this.state.displayquestions} ontagpage = {this.state.tagpage}/>


        
        <div className= "right_content">
          
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
          ? (<QuestionForm
             onQuestionSubmit={this.handleQuestionSubmit}
              user={this.state.currUser}
              passedQuestion={this.state.questionToPass}
              change = {this.state.changeForm}
              onDeleteQuestion={this.handleDeleteQuestion}
              ts = {this.state.tagString}
              onChangeQuestion = {this.handleQuestionMod} />
          ) : this.state.showAnswer? (
             <AnswerPage
                question={this.state.viewedQuestion}
                onBackToQuestions={this.handleBackToQuestions}
                //model={this.model}
                onAskQuestion={this.toggleQuestionForm}
                user ={this.state.currUser}
                ansDelete = {this.state.answerDelete}

              />
            )
          : this.state.displayquestions?
          this.renderQuestions():null
          
          
          
          }
          {this.state.tagpage && (
            <>
            <TagPageHeader onAskQuestion={this.toggleQuestionForm}
             user={this.props.user} 
             tagDel = {this.state.tagDelete}
             passTag = {this.state.tagsToPass}/>
            <TagPage onTagclick= {this.handletagclick} 
            tagDel = {this.state.tagDelete}
            passTag = {this.state.tagsToPass}
            />
            </>
          )}
        {this.state.page_controls && this.state.questions.length>5&&(
        <div className="Page_controls">
        <button onClick={this.prev_page} disabled={this.state.current_page === 0}>Prev</button>
        <button onClick={this.next_page}>Next</button>
        </div>
        )}
        {this.state.showUserProfile && (
          <UserProfile
          user = {this.props.user}
          onChangeQuestion={this.handleQuestionChange}
          onDeleteQuestion={this.handleDeleteQuestion}
          onUserAnswers = {this.handleUserAnswersPage}
          onTagsPage = {this.handleUserTagsPage}
          set_logged_in_user={this.props.set_logged_in_user}
          />
        )

        }

        </div>

        
        
    </div>
    
  </div>
  );
}
}

export default Homepage;