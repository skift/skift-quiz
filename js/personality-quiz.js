var PersonalityQuiz = {

  // var currentquestion = 0,
  //     beach = 0,
  //     mountains = 0,
  //     country = 0,
  //     city = 0,
  //     submission = true, picked,

  init : function(){

    // load title
    if (typeof personalityQuiztitle !== 'undefined' && $.type(personalityQuiztitle) == 'string') {
      $(document.createElement('h1')).text(personalityQuiztitle).appendTo('#personality-frame');
    } else {
      $(document.createElement('h1')).text('Quiz').appendTo('#personality-frame');
    }

    // add frame elements
    if (typeof quiz !== 'undefined' && $.type(quiz) == 'array') {
      // pager
      $(document.createElement('p')).attr('id','p-pager').addClass('p-pager').text('Question 1 of '+quiz.length).appendTo('#personality-frame');
      // first question
      $(document.createElement('h2')).attr('id', 'p-question').addClass('p-question').text(personalityQuiz[0]['question']).appendTo('#personality-frame');
      // choices block
      $(document.createElement('ul')).attr('id', 'p-choices-block').appendTo('#personality-frame');

      PersonalityQuiz.addChoices(personalityQuiz[0]['choices']);
    }

  },

  addChoices : function(choices) {
    console.log(choices);
    if (typeof choices !== 'undefined' && $.type(choices) == 'array') {
      $('#p-choices-block').empty();
      for (var i=0; i<choices.length; i++){
        $(document.createElement('li')).addClass('p-choice p-choice-box').attr('data-index', i).text(choices[i]).appendTo('#p-choices-block');
      }
    }
  }

};