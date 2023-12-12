import React, { Component } from 'react';
import axios from 'axios';
import FormatDate from './FormatDate';
import memSince from './memSince';



class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Names: [],
          Answers:[]
        };
      }
    async componentDidMount() {
        const { user } = this.props;
          try {
            const response = await axios.get(`http://localhost:8000/questions/${user._id}/names`);
            this.setState({ Names: response.data.questions });
            const response01 = await axios.get(`http://localhost:8000/questions/${user._id}/getanswers`);
            
            this.setState({Answers: response01.data.questions});
            

          } catch (error) {
            console.error('Error fetching titles', error);
          }
      }
  render() {
    const { user, onChangeQuestion, onDeleteQuestion, onUserAnswers, onTagsPage } = this.props;
    const membershipDuration = user ? memSince(user.member_since) : '--';
    return (
        <div>
          <h2>User Profile</h2>
          <p>
            <strong style={{ fontSize: '1.2em' }}>User Information</strong> <br />
            User Name: {user ? user.username : '--username--'} <br />
            Member Since: {user ? FormatDate(user.member_since) : '--member_since--'} <br />
            Member for {membershipDuration} <br />
            Reputation: {user.reputation} <br />
            <strong style={{ fontSize: '1.2em' }}>Questions User Asked</strong> <br />
            {this.state.Names && this.state.Names.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {this.state.Names.map((question, index) => (
                  <li key={index}>
                    {/* Make the title clickable */}
                    <span
                      style={{ display: 'block', cursor: 'pointer', color: 'blue' }}
                      onClick={() => onChangeQuestion(question)}
                    >
                      {question.title}
                    </span>
                    <div style={{ marginBottom: '10px' }}>
                      <button onClick={() => onDeleteQuestion(question)}>Delete</button>
                      <button onClick={() => onChangeQuestion(question)}>Modify</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no Questions</p>
            )}
          </p>
          <p>
            <strong style={{ fontSize: '1.2em', cursor: 'pointer' }} onClick={() => onUserAnswers(this.state.Answers)}>
              Questions User answered Page
            </strong>
            <br />
            <strong style={{ fontSize: '1.2em', marginTop: '20px', cursor: 'pointer' }} onClick={() => onTagsPage(this.state.Tags)}>
              Tags User Created
            </strong>
            <br />
          </p>
        </div>
      );
    }
  }

export default UserProfile;