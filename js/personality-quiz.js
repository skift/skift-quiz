var currentquestion = 0;

var submission = true, picked;

//array to hold choices keys.  use to append keys to the page
var x = [];

//array to hold choices values (images).
var y = [];

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