import React, { Component } from 'react'
import Question from './Question'

export default class QuestionsList extends Component {
  

    render({questions}) {
        return(
            <div id="right_content">
            {questions.map((question) => (
              <Question key={question._id} question={question} />
            ))}
          </div>
        );
    }
}