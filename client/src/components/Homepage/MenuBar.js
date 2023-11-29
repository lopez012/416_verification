import React from 'react';
import '../../stylesheets/App.css'


function MenuBar({showhomePage, showtagPage, onQuestions, ontagpage}) {

  return (
    <div id="menubar" className="full-width-menu">

      <button id="questions_button" className = {onQuestions ? 'gray_button' : ''} onClick={showhomePage}>Questions</button>
      <br />
      <button id="tags_button" className = {ontagpage ? 'gray_button' : ''}  onClick={showtagPage}>Tags</button>
    </div>
  );
}

export default MenuBar;
