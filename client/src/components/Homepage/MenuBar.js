import React from 'react';
import '../../stylesheets/App.css'


function MenuBar({showhomePage, showtagPage, onQuestions, ontagpage}) {

  return (
    <td id="menubar" >

      <button id="questions_button" className = {onQuestions ? 'gray_button' : ''} onClick={showhomePage}>Questions</button>
      <br />
      <button id="tags_button" className = {ontagpage ? 'gray_button' : ''}  onClick={showtagPage}>Tags</button>
    </td>
  );
}

export default MenuBar;
