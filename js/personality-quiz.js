var currentquestion = 0;

// the length of score is dependent upon how many personality types there are
// in this case there are four.  in this case each integer corresponds to:
// beach, mountains, country, city
// when a choice is picked we want to write score[picked]++
var score = [0, 0, 0, 0];

var submission = true, picked;

//array to hold choices keys.  use to append keys to the page
var x = [];

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
        }
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
            // if (quiz['content'][currentquestion].hasOwnProperty('image') && quiz['content'][currentquestion]['image'] != '') {
            //     if ($('#question-image').length == 0) {
            //         $(document.createElement('img')).attr('id', 'question-image').addClass('question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            //     } else {
            //         $('#question-image').attr('src', quiz['content'][currentquestion]['image']).attr('alt', htmlEncode(quiz['content'][currentquestion]['question']));
            //     }
            // } else {
            //     $('#question-image').remove();
            // }

        }
    },

    endTheQuiz : function(){
        // find array key of largest score
        var key_of_largest_score = score.indexOf(Math.max.apply(window, score));

        var results = quiz['results'][key_of_largest_score];

        $('#question').empty();
        $('#pager').empty();
        $('#choices-block').empty();
        $('#question-image').remove();
        $('#submitbutton').remove();
        $('#question').attr('id', 'results').css({'text-align':'center', 'font-size':'7em'}).text("You got " + results + "!");
        // $(document.createElement('h2')).attr('id', 'score').css({'text-align':'center', 'font-size':'7em'}).text(results);
        // .insertAfter('#question');

        $('#results').hide().fadeIn(1000);
    }

};

















