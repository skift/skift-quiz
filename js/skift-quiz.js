// Global variables
var quiz = {},
    currentquestion = 0,
    score = 0,                  // score for trivia quiz
    x = [],                     // array x to hold choices keys.  use to append keys to the page
    y = [],                     // array y to hold choices values (images)
    personality_score = [],     // score for personality quiz
    submission = true, picked;

// Trivia quiz
// append choices to choices-block
function addChoices(choices) {
    if (typeof choices !== 'undefined' && jQuery.type(choices) == 'array') {
        jQuery('.choices-block').empty();
        for (var i=0; i<choices.length; i++){
            jQuery(document.createElement('li'))
                .attr('data-index', i)
                .append('<a href="#" class="choice"><span class="box">&#9745;</span>'+ choices[i] +'</a>')
                .appendTo('.choices-block');
        }
    }
}

function endQuiz() {
    jQuery('.question').empty();
    jQuery('.pager').empty();
    jQuery('.choices-block').empty();
    jQuery('.question-image').remove();
    jQuery('#submitbutton').remove();
    jQuery('.question').text("You got " + score + " out of " + quiz['content'].length + " correct.");
    jQuery(document.createElement('h2')).addClass('score').css({'text-align':'center', 'font-size':'7em'}).text(Math.round(score/quiz['content'].length * 100) + '%').insertAfter('.question');

    jQuery('.score').hide().fadeIn(1000);
}

// helper function to create elements on the DOM
function htmlEncode(value){
    return jQuery(document.createElement('div')).text(value).html();
}

function triviaQuizInit() {
    // add title to page
    if (typeof quiz['title'] !== 'undefined' && jQuery.type(quiz['title']) == 'string') {
        jQuery(document.createElement('h1')).text(quiz['title']).appendTo('.quiz-frame');
    } else {
        jQuery(document.createElement('h1')).text('Quiz').appendTo('.quiz-frame');
    }

    if (typeof quiz !== 'undefined' && jQuery.type(quiz) == 'object') {

        // add pager
        jQuery(document.createElement('p')).addClass('pager').text('Question 1 of '+quiz['content'].length).appendTo('.quiz-frame');

        // add first question
        jQuery(document.createElement('p')).addClass('question').text(quiz['content'][0]['question']).appendTo('.quiz-frame');

        // add image if present
        if (quiz['content'][0].hasOwnProperty('image') && quiz['content'][0]['image'] != '') {
            jQuery(document.createElement('img')).addClass('question-image').attr('src', quiz['content'][0]['image']).appendTo('.quiz-frame').fadeIn();
        }

        // add choices-block
        jQuery(document.createElement('ul')).addClass('choices-block').appendTo('.quiz-frame');
        addChoices(quiz['content'][0]['choices'])

        // add submit button
        jQuery(document.createElement('div'))
            .addClass('submit')
            .text('Submit Answer')
            // .css({'font-weight':700,'color':'white','padding':'30px 0','text-align':'center'})
            .appendTo('.quiz-frame');

        // add submit-button anchor link
        jQuery(document.createElement('a')).addClass('submit-button').attr('href', '#').appendTo('.submit');

        // set up choices buttons and submit button
        setUpButtons();

        // fade in frame and explanation; explanation is behind frame so isn't visible until question #2.
        jQuery('.quiz-frame').hide().fadeIn(1000);
        jQuery('.explanation').hide().fadeIn(1000);
    }
}

// nextQuestion has two purposes:
//     1. show whether user's last answer was correct and show explanation, and
//     2. pose next question
function nextQuestion(picked) {
    jQuery('.explanation').empty();

    // iterate to next question and set up var lastquestion so we can access last question results
    currentquestion++;
    lastquestion = currentquestion - 1;

    // show answer and explanation to last question
    if (lastquestion >= 0) {
        jQuery('.explanation').append('<h3 style="font-variant: small-caps; text-decoration: underline;">Your Last Answer<h3>').append(quiz['content'][lastquestion]['question']);

        if ( quiz['content'][lastquestion]['choices'][picked] == quiz['content'][lastquestion]['correct'] ) {
            jQuery('.explanation').append('<p style="color: green;"><strong>Correct!</strong></p>' + ' ' + quiz['content'][lastquestion]['explanation']);
            score++;
        } else {
            jQuery('.explanation').append('<p style="color: red"><strong>Incorrect.</strong></p>' + ' ' + quiz['content'][lastquestion]['explanation']);
        }

        // first 'Your Last Answer' slides out; the rest fade in
        if (lastquestion == 0) {
            jQuery('.quiz-frame').animate({left : "400px"}, 1000);
        } else {
            jQuery('.explanation').hide().fadeIn(1000);
        }
    }

    // reset global variable submission
    submission = true;

    // end quiz if there are no more questions
    if (quiz['content'][currentquestion] == undefined) {
        endQuiz();
    } else {
        jQuery('.question').text(quiz['content'][currentquestion]['question']);
        jQuery('.pager').text("Question " + Number(currentquestion+1) + " of " + quiz['content'].length);
        
        if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
            if (jQuery('.question-image').length == 0) {
                jQuery(document.createElement('img')).addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            } else {
                jQuery('.question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            }
        } else {
            jQuery('.question-image').remove();
        }

    addChoices(quiz['content'][currentquestion]['choices']);
    setUpButtons();

    }

}

// set up event listeners and highlighting on buttons
function setUpButtons() {

    // add highlight to choices on mouseover and remove on mouseout
    jQuery('.choice').mouseover(function(){ jQuery(this).css({'background-color' : 'rgb(202, 202, 202)'}); })
    jQuery('.choice').mouseout(function(){ jQuery(this).css({'background-color' : '#FFE099;'}); })

    // event listeners
    jQuery('.choice').click(function(e){
        e.preventDefault();

        // grab data-index and change color of choice when picked
        var picked = jQuery(this).attr('data-index');
        jQuery('.choice').removeAttr('style').off('mouseover mouseout');
        jQuery(this).css({'border-color':'#222','font-weight':700,'background-color':'rgb(250, 174, 0)'});

        // submit button click triggers nextQuestion and passes choice's data-index (via var picked)
        if (submission) {
            submission = false;
            jQuery('#submitbutton').click(function(e){
                e.preventDefault();
                jQuery('.choice').off('click');
                jQuery(this).off('click');
                nextQuestion(picked);
            })
        };
    })
}



// Personality quiz

function personalityQuizInit() {
    // load title
    if (typeof quiz['title'] !== 'undefined' && jQuery.type(quiz['title']) == 'string') {
        jQuery(document.createElement('p')).addClass('title').text(quiz['title']).appendTo('.quiz-frame');
    } else {
        jQuery(document.createElement('p')).addClass('title').text('Quiz').appendTo('.quiz-frame');
    }

    // add frame elements
    if (typeof quiz['content'] !== 'undefined' && jQuery.type(quiz['content']) == 'array') {

        // pager
        jQuery(document.createElement('p')).addClass('pager').text('Question 1 of '+quiz['content'].length).appendTo('.quiz-frame');

        // first question
        jQuery(document.createElement('p')).addClass('question').text(quiz['content'][0]['question']).appendTo('.quiz-frame');

        // add image if present
        if (quiz['content'][0].hasOwnProperty('image') && quiz['content'][0]['image'] != '') {
            jQuery(document.createElement('img'))
            .addClass('question-image')
            .attr('src', quiz['content'][0]['image'])
            .appendTo('.quiz-frame');
        }

        // choices block
        jQuery(document.createElement('ul'))
            .addClass('choices-block')
            .appendTo('.quiz-frame');

        // choices
        personalityAddChoices(quiz['content'][0]['choices']);

        // submit button
        jQuery(document.createElement('div'))
            .addClass('submit')
            .append('<a href="#" class="submit-button">Submit Answer</a>')
            .appendTo('.quiz-frame');

        // set up choices buttons and submit button
        personalitySetUpButtons();

    }

};

function personalityAddChoices(choices) {
    // get keys from each choice and push into array x (so choices keys can be appended to the page)
    jQuery.each(choices, function(k, v){
        x.push(k);
        y.push(v);
    })

    if (typeof x !== 'undefined' && jQuery.type(x) == 'array') {
        jQuery('.choices-block').empty();
        for (var i=0; i<x.length; i++){
            // append choices with array x and photos with array y
            jQuery(document.createElement('li'))
                .addClass('choice')
                .attr('data-index', i)
                .append('<a href="#" class="choice"><span class="box">&#9744;</span>'+ x[i] +'<img src='+ y[i] +' alt="" class="picture"/></a>')
                .appendTo('.choices-block');
        }
    }
};

function personalitySetUpButtons() {

    jQuery('.choice').click(function(e) {
        e.preventDefault();

        var self = this;
        // set global variable picked to data-index and change styling of picked choice
        picked = jQuery(self).attr('data-index');
        // jQuery('.choice').removeAttr('style').off('mouseover mouseout');

        // add class 'chosen' to picked element to add styling
        jQuery('.choice').removeClass('chosen');
        jQuery('.choice .box').html('&#9744;');
        jQuery(self).addClass('chosen');
        jQuery(self).find('.box').html('&#9745;');

        // Don't set submission here; grab the state of the page when the button is clicked
        if (submission) {
            // set submission as false so multiple clicks won't be counted
            submission = false;
            jQuery('.submit-button').click(function(e) {
                e.preventDefault();
                jQuery('.choice').off('click');
                jQuery(this).off('click');
                personalityNextQuestion(picked);
            })
        };

    })
};

function personalityNextQuestion(picked) {
    // iterate to next question
    currentquestion++

    // place choice score array (in the right bucket)
    personality_score[picked]++

    // reset global variable submission
    submission = true;

    // reset global variable y so it can hold new choices' pictures
    y = [];

    if (quiz['content'][currentquestion] == undefined) {
        // end quiz if there are no more questions
        personalityEndQuiz();
    } else {
        // reset x and then set to new choices
        x = [];

        jQuery('.question').text(quiz['content'][currentquestion]['question']);

        jQuery('.pager').text("Question " + Number(currentquestion+1) + " of " + quiz['content'].length);

        // add new choices
        personalityAddChoices(quiz['content'][currentquestion]['choices']);

        personalitySetUpButtons();
    
        // image stuff
        if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
            if (jQuery('.question-image').length == 0) {
                jQuery(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            } else {
                jQuery('.question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            }
        } else {
            jQuery('.question-image').remove();
        }

    }
};

function personalityEndQuiz() {
    // find array key of largest score
    var key_of_largest_score = personality_score.indexOf(Math.max.apply(Math, personality_score));

    // use key to find corresponding result
    var results = quiz['results'][key_of_largest_score];

    jQuery('.question').empty();
    jQuery('.pager').empty();
    jQuery('.choices-block').empty();
    jQuery('.question-image').remove();
    jQuery('.submit-button').remove();
    jQuery('.question').attr('id', 'results')
        .addClass('results')
        .text("You got " + results + "!");

    jQuery('#results').hide().fadeIn(1000);
};

// Initialize
jQuery(document).ready(function() {
    quiz = jQuery.parseJSON(jQuery('.skift-quiz .skift-quiz-object').text());

    if ( quiz['type'] == 'trivia' ) {
        triviaQuizInit();
    } else if ( quiz['type'] == 'personality' ) {
        // the length of score is dependent upon how many personality types there are
        for (i=0; i<quiz['results'].length; i++) {
            personality_score.push(0);
        }
        personalityQuizInit();
    }
});
