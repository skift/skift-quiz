var quiz = {};

$(document).ready(function() {

    quiz = jQuery.parseJSON(jQuery('.skift-quiz .skift-quiz-object').text());

    if ( quiz['type'] == 'trivia' ) {
        // trivia quiz initialize
        // initialize();
    } else if ( quiz['type'] == 'personality' ) {
        // set up global variable score
        score = [];

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