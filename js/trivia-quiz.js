var currentquestion = 0, score = 0, submission = true, picked;

// append choices to choices-block
function addChoices(choices) {
    if (typeof choices !== 'undefined' && $.type(choices) == 'array') {
        $('#choices-block').empty();
        for (var i=0; i<choices.length; i++){
            $(document.createElement('li')).addClass('choice choice-box').attr('data-index', i).text(choices[i]).appendTo('#choices-block');
        }
    }
}

function endQuiz(){
    $('#question').empty();
    $('#pager').empty();
    $('#choices-block').empty();
    $('#question-image').remove();
    $('#submitbutton').remove();
    $('#question').text("You got " + score + " out of " + quiz.length + " correct.");
    $(document.createElement('h2')).attr('id', 'score').css({'text-align':'center', 'font-size':'7em'}).text(Math.round(score/quiz.length * 100) + '%').insertAfter('#question');

    $('#score').hide().fadeIn(1000);
}

// helper function to create elements on the DOM
function htmlEncode(value){
    return $(document.createElement('div')).text(value).html();
}

function initialize() {
    // add title to page
    if (typeof quiztitle !== 'undefined' && $.type(quiztitle) == 'string') {
        $(document.createElement('h1')).text(quiztitle).appendTo('#frame');
    } else {
        $(document.createElement('h1')).text('Quiz').appendTo('#frame');
    }

    if (typeof quiz !== 'undefined' && $.type(quiz) == 'array') {
        // add pager
        $(document.createElement('p')).attr('id','pager').addClass('pager').text('Question 1 of '+quiz.length).appendTo('#frame');

        // add first question
        $(document.createElement('h2')).attr('id', 'question').addClass('question').text(quiz[0]['question']).appendTo('#frame');

        // add image if present
        if (quiz[0].hasOwnProperty('image') && quiz[0]['image'] != '') {
            $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz[0]['image']).appendTo('#frame').fadeIn();
        }

        // add choices-block
        $(document.createElement('ul')).attr('id', 'choices-block').appendTo('#frame');
        addChoices(quiz[0]['choices'])

        // add submit button
        $(document.createElement('div')).attr('id', 'submitbutton').text('Submit Answer').css({'font-weight':700,'color':'white','padding':'30px 0','text-align':'center'}).appendTo('#frame');
        setUpButtons();

        //hide explanation div on first question
        $('#explanation').hide().fadeIn(1000);
        $('#frame').hide().fadeIn(1000);
    }
}

// nextQuestion has two purposes:
//     1. show whether user's last answer was correct and show explanation, and
//     2. pose next question
function nextQuestion(picked) {
    $('#explanation').empty();

    // iterate to next question and set up var lastquestion so we can access last question results
    currentquestion++;
    lastquestion = currentquestion - 1;

    // show answer and explanation to last question
    if (lastquestion >= 0) {
        $('#explanation').append('<br/><br/><h3 style="font-variant: small-caps; text-decoration: underline;">Your Last Answer<h3><br/>').append(quiz[lastquestion]['question']+'<br/><br/>');

        if ( quiz[lastquestion]['choices'][picked] == quiz[lastquestion]['correct'] ) {
            $('#explanation').append('<p style="color: green;"><strong>Correct!</strong></p>' + ' ' + quiz[lastquestion]['explanation']);
            score++;
        } else {
            $('#explanation').append('<p style="color: red"><strong>Incorrect.</strong></p>' + ' ' + quiz[lastquestion]['explanation']);
        }

        // first 'Your Last Answer' slides out; the rest fade in
        if (lastquestion == 0) {
            $('#frame').animate({left : "400px"}, 1000);
        } else {
            $('#explanation').hide().fadeIn(1000);
        }
    }

  //allow submit button to be used again
    submission = true;
    if (quiz[currentquestion] == undefined) {
        endQuiz();
    } else {
        $('#question').text(quiz[currentquestion]['question']);
        $('#pager').text("Question " + Number(currentquestion+1) + " of " + quiz.length);
        
        if (quiz[currentquestion].hasOwnProperty('image') && quiz[currentquestion]['image'] != '') {
            if ($('#question-image').length == 0) {
                $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question']));
            } else {
                $('#question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question']));
            }
        } else {
            $('#question-image').remove();
        }

    addChoices(quiz[currentquestion]['choices']);
    setUpButtons();

    }

}

// set up event listeners and highlighting on buttons
function setUpButtons(){
  //add highlight to choices on mouseover and remove on mouseout
    $('.choice').mouseover(function(){ $(this).css({'background-color' : 'rgb(202, 202, 202)'}); })
    $('.choice').mouseout(function(){ $(this).css({'background-color' : '#FFE099;'}); })
    $('.choice').click(function(){
        var picked = $(this).attr('data-index');
        $('.choice').removeAttr('style').off('mouseover mouseout');
        $(this).css({'border-color':'#222','font-weight':700,'background-color':'rgb(250, 174, 0)'});
        if(submission) {
            submission = false;
            $('#submitbutton').css({'color':'white'}).click(function(){
                $('.choice').off('click');
                $(this).off('click');
                nextQuestion(picked);
            })
        }
    })
}