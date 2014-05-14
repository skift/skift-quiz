$(document).ready(function(){

    if ( quiz['type'] == 'trivia' ) {
        // trivia quiz initialize
        initialize();
    // } else if ( quiz['type'] == 'personality' ) {
        // personality quiz initialize
        // PersonalityQuiz.init();
    } else {
        console.log("Something went wrong here.");
    }

});