// Global Variable Quiz //
var quiz = {};


/////////////////////////////////////////////////////////////
/////////////// TRIVIA QUIZ /////////////////////////////////
/////////////////////////////////////////////////////////////


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
    $('#question').text("You got " + score + " out of " + quiz['content'].length + " correct.");
    $(document.createElement('h2')).attr('id', 'score').css({'text-align':'center', 'font-size':'7em'}).text(Math.round(score/quiz['content'].length * 100) + '%').insertAfter('#question');

    $('#score').hide().fadeIn(1000);
}

// helper function to create elements on the DOM
function htmlEncode(value){
    return $(document.createElement('div')).text(value).html();
}

function initialize() {
    // add title to page
    if (typeof quiz['title'] !== 'undefined' && $.type(quiz['title']) == 'string') {
        $(document.createElement('h1')).text(quiz['title']).appendTo('#frame');
    } else {
        $(document.createElement('h1')).text('Quiz').appendTo('#frame');
    }

    if (typeof quiz !== 'undefined' && $.type(quiz) == 'object') {

        // add pager
        $(document.createElement('p')).attr('id','pager').addClass('pager').text('Question 1 of '+quiz['content'].length).appendTo('#frame');

        // add first question
        $(document.createElement('h2')).attr('id', 'question').addClass('question').text(quiz['content'][0]['question']).appendTo('#frame');

        // add image if present
        if (quiz['content'][0].hasOwnProperty('image') && quiz['content'][0]['image'] != '') {
            $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][0]['image']).appendTo('#frame').fadeIn();
        }

        // add choices-block
        $(document.createElement('ul')).attr('id', 'choices-block').appendTo('#frame');
        addChoices(quiz['content'][0]['choices'])

        // add submit button
        $(document.createElement('div')).attr('id', 'submitbutton').text('Submit Answer').css({'font-weight':700,'color':'white','padding':'30px 0','text-align':'center'}).appendTo('#frame');

        // set up choices buttons and submit button
        setUpButtons();

        // fade in frame and explanation; explanation is behind frame so isn't visible until question #2.
        $('#frame').hide().fadeIn(1000);
        $('#explanation').hide().fadeIn(1000);
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
        $('#explanation').append('<br/><br/><h3 style="font-variant: small-caps; text-decoration: underline;">Your Last Answer<h3><br/>').append(quiz['content'][lastquestion]['question']+'<br/><br/>');

        if ( quiz['content'][lastquestion]['choices'][picked] == quiz['content'][lastquestion]['correct'] ) {
            $('#explanation').append('<p style="color: green;"><strong>Correct!</strong></p>' + ' ' + quiz['content'][lastquestion]['explanation']);
            score++;
        } else {
            $('#explanation').append('<p style="color: red"><strong>Incorrect.</strong></p>' + ' ' + quiz['content'][lastquestion]['explanation']);
        }

        // first 'Your Last Answer' slides out; the rest fade in
        if (lastquestion == 0) {
            $('#frame').animate({left : "400px"}, 1000);
        } else {
            $('#explanation').hide().fadeIn(1000);
        }
    }

    // reset global variable submission
    submission = true;

    // end quiz if there are no more questions
    if (quiz['content'][currentquestion] == undefined) {
        endQuiz();
    } else {
        $('#question').text(quiz['content'][currentquestion]['question']);
        $('#pager').text("Question " + Number(currentquestion+1) + " of " + quiz['content'].length);
        
        if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
            if ($('#question-image').length == 0) {
                $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            } else {
                $('#question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            }
        } else {
            $('#question-image').remove();
        }

    addChoices(quiz['content'][currentquestion]['choices']);
    setUpButtons();

    }

}

// set up event listeners and highlighting on buttons
function setUpButtons(){

    // add highlight to choices on mouseover and remove on mouseout
    $('.choice').mouseover(function(){ $(this).css({'background-color' : 'rgb(202, 202, 202)'}); })
    $('.choice').mouseout(function(){ $(this).css({'background-color' : '#FFE099;'}); })

    // event listeners
    $('.choice').click(function(){

        // grab data-index and change color of choice when picked
        var picked = $(this).attr('data-index');
        $('.choice').removeAttr('style').off('mouseover mouseout');
        $(this).css({'border-color':'#222','font-weight':700,'background-color':'rgb(250, 174, 0)'});

        // submit button click triggers nextQuestion and passes choice's data-index (via var picked)
        if (submission) {
            submission = false;
            $('#submitbutton').click(function(){
                $('.choice').off('click');
                $(this).off('click');
                nextQuestion(picked);
            })
        };
    })
}


///////////////////////////////////////////////////////////////
//////////////// PERSONALITY QUIZ /////////////////////////////
///////////////////////////////////////////////////////////////


var PersonalityQuiz = {

    init : function() {
        // load title
        if (typeof quiz['title'] !== 'undefined' && $.type(quiz['title']) == 'string') {
            $(document.createElement('p')).addClass('title').text(quiz['title']).appendTo('.quiz-frame');
        } else {
            $(document.createElement('p')).addClass('title').text('Quiz').appendTo('.quiz-frame');
        }

        // add frame elements
        if (typeof quiz['content'] !== 'undefined' && $.type(quiz['content']) == 'array') {

            // pager
            $(document.createElement('p')).addClass('pager').text('Question 1 of '+quiz['content'].length).appendTo('.quiz-frame');

            // first question
            $(document.createElement('p')).addClass('question').text(quiz['content'][0]['question']).appendTo('.quiz-frame');

            // add image if present
            if (quiz['content'][0].hasOwnProperty('image') && quiz['content'][0]['image'] != '') {
                $(document.createElement('img'))
                .addClass('question-image')
                .attr('src', quiz['content'][0]['image'])
                .appendTo('.quiz-frame');
            }

            // choices block
            $(document.createElement('ul'))
                .addClass('choices-block')
                .appendTo('.quiz-frame');

            // choices
            PersonalityQuiz.addChoices(quiz['content'][0]['choices']);

            // submit button
            $(document.createElement('div'))
                .addClass('submit-button')
                .text('Submit Answer')
                .appendTo('.quiz-frame');

            // set up choices buttons and submit button
            PersonalityQuiz.setUpButtons();

        }

    },

    addChoices : function(choices) {
        // get keys from each choice and push into array x (so choices keys can be appended to the page)
        $.each(choices, function(k, v){
            x.push(k);
            y.push(v);
        })

        if (typeof x !== 'undefined' && $.type(x) == 'array') {
            $('.choices-block').empty();
            for (var i=0; i<x.length; i++){
                // append choices
                $(document.createElement('li'))
                    .addClass('choice')
                    .attr('data-index', i)
                    .text(x[i])
                    .appendTo('.choices-block');
                // append choice photos
                $(document.createElement('img'))
                    .addClass('picture')
                    .attr('src', y[i])
                    .appendTo('.choices-block');
            }
        }
    },

    setUpButtons : function() {

        $('.choice').click(function(){

            // set global variable picked to data-index and change styling of picked choice
            picked = $(this).attr('data-index');
            $('.choice').removeAttr('style').off('mouseover mouseout');
            $(this).css({'border-color':'#222','font-weight':700,'background-color':'rgb(250, 174, 0)'});

            if (submission) {
                // set submission as false so multiple clicks won't be counted
                submission = false;
                $('.submit-button').click(function(){
                    $('.choice').off('click');
                    $(this).off('click');
                    PersonalityQuiz.nextQuestion(picked);
                })
            };

        })
    },

    nextQuestion : function(picked) {
        // iterate to next question
        currentquestion++

        // place choice score array (in the right bucket)
        score[picked]++

        // reset global variable submission
        submission = true;

        // reset global variable y so it can hold new choices' pictures
        y = [];

        if (quiz['content'][currentquestion] == undefined) {
            // end quiz if there are no more questions
            PersonalityQuiz.endTheQuiz();
        } else {
            // reset x and then set to new choices
            x = [];

            $('.question').text(quiz['content'][currentquestion]['question']);

            $('.pager').text("Question " + Number(currentquestion+1) + " of " + quiz['content'].length);

            // add new choices
            PersonalityQuiz.addChoices(quiz['content'][currentquestion]['choices']);

            PersonalityQuiz.setUpButtons();
        
            // image stuff
            if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
                if ($('.question-image').length == 0) {
                    $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
                } else {
                    $('.question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
                }
            } else {
                $('.question-image').remove();
            }

        }
    },

    endTheQuiz : function(){
        // find array key of largest score
        var key_of_largest_score = score.indexOf(Math.max.apply(Math, score));

        // use key to find corresponding result
        var results = quiz['results'][key_of_largest_score];

        $('.question').empty();
        $('.pager').empty();
        $('.choices-block').empty();
        $('.question-image').remove();
        $('.submit-button').remove();
        $('.question').attr('id', 'results')
            .addClass('results')
            .text("You got " + results + "!");

        $('#results').hide().fadeIn(1000);
    }

};


/////////////////////////////////////////////////////////////////////
///////////// DOCUMENT READY FUNCTION ///////////////////////////////
/////////////////////////////////////////////////////////////////////


$(document).ready(function() {

    quiz = jQuery.parseJSON(jQuery('.skift-quiz .skift-quiz-object').text());

    if ( quiz['type'] == 'trivia' ) {
        var currentquestion = 0, score = 0, submission = true, picked;
        initialize();
    } else if ( quiz['type'] == 'personality' ) {
        //x array to hold choices keys.  use to append keys to the page
        //y array to hold choices values (images)
        var currentquestion = 0, x = [], y = [], score = [], submission = true, picked;
        // the length of score is dependent upon how many personality types there are
        for (i=0; i<quiz['results'].length; i++) {
            score.push(0);
        }
        // personality quiz initialize
        PersonalityQuiz.init();

    } else {
        console.log("Initializing conditional failed.");
    }

});








