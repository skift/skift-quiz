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
            $(document.createElement('h1')).text(quiz['title']).appendTo('#personality-frame');
        } else {
            $(document.createElement('h1')).text('Quiz').appendTo('#personality-frame');
        }

        // add frame elements
        if (typeof quiz['content'] !== 'undefined' && $.type(quiz['content']) == 'array') {

            // pager
            $(document.createElement('p')).attr('id','pager').addClass('pager').text('Question 1 of '+quiz['content'].length).appendTo('#personality-frame');

            // first question
            $(document.createElement('h2')).attr('id', 'question').addClass('question').text(quiz['content'][0]['question']).appendTo('#personality-frame');

            // add image if present
            if (quiz['content'][0].hasOwnProperty('image') && quiz['content'][0]['image'] != '') {
                $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][0]['image']).appendTo('#personality-frame');
            }

            // choices block
            $(document.createElement('ul')).attr('id', 'choices-block').appendTo('#personality-frame');

            // choices
            PersonalityQuiz.addChoices(quiz['content'][0]['choices']);

            // submit button
            $(document.createElement('div')).attr('id', 'submitbutton').text('Submit Answer').appendTo('#personality-frame');

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
            $('#choices-block').empty();
            for (var i=0; i<x.length; i++){
                $(document.createElement('li'))
                    .addClass('choice choice-box')
                    .attr('data-index', i)
                    .text(x[i])
                    .appendTo('#choices-block');
            }

            // for (var k in quiz['content'][currentquestion]['choices']) {
            //     $(document.createElement('img'))
            //         .addClass('choice choice-box')
            //         .attr('src', quiz['content'][currentquestion]['choices'][k])
            //         .appendTo('.choice-box');
            // }
        }

        // if (typeof y !== 'undefined' && $.type(y) == 'array') {
        //     $('.picture').empty();
        //     for (var i=0; i<1; i++) {
        //         $(document.createElement('img'))
        //             .addClass('picture')
        //             .attr('src', y[i])
        //             .css('width', '200px')
        //             .appendTo('.choice-box');

        //     }
        // }
    },

    setUpButtons : function() {

        // add highlight to choices on mouseover and remove on mouseout
        $('.choice').mouseover(function(){ $(this).css({'background-color' : 'rgb(202, 202, 202)'}); })
        $('.choice').mouseout(function(){ $(this).css({'background-color' : '#FFE099;'}); })

        $('.choice').click(function(){

            // set global variable picked to data-index and change styling of picked choice
            picked = $(this).attr('data-index');
            $('.choice').removeAttr('style').off('mouseover mouseout');
            $(this).css({'border-color':'#222','font-weight':700,'background-color':'rgb(250, 174, 0)'});

            if (submission) {
                // set submission as false so multiple clicks won't be counted
                submission = false;
                $('#submitbutton').click(function(){
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

        if (quiz['content'][currentquestion] == undefined) {
            // end quiz if there are no more questions
            PersonalityQuiz.endTheQuiz();
        } else {
            // reset x and then set to new choices
            x = [];

            $('#question').text(quiz['content'][currentquestion]['question']);

            $('#pager').text("Question " + Number(currentquestion+1) + " of " + quiz['content'].length);

            // add new choices
            PersonalityQuiz.addChoices(quiz['content'][currentquestion]['choices']);

            PersonalityQuiz.setUpButtons();
        
            // image stuff
            if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
                if ($('#question-image').length == 0) {
                    $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
                } else {
                    $('#question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
                }
            } else {
                $('#question-image').remove();
            }

        }
    },

    endTheQuiz : function(){
        // find array key of largest score
        var key_of_largest_score = score.indexOf(Math.max.apply(Math, score));

        // use key to find corresponding result
        var results = quiz['results'][key_of_largest_score];

        $('#question').empty();
        $('#pager').empty();
        $('#choices-block').empty();
        $('#question-image').remove();
        $('#submitbutton').remove();
        $('#question').attr('id', 'results').css({'text-align':'center', 'font-size':'7em'}).text("You got " + results + "!");

        $('#results').hide().fadeIn(1000);
    }

};