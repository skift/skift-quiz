function addChoices(e){if("undefined"!=typeof e&&"array"===jQuery.type(e)){jQuery(".choices-block").empty();for(var t=0;t<e.length;t++)jQuery(document.createElement("li")).attr("data-index",t).append('<a href="#" class="choice"><span class="box">&#9745;</span>'+e[t]+"</a>").appendTo(".choices-block")}}function endQuiz(){jQuery(".question").empty(),jQuery(".pager").empty(),jQuery(".choices-block").empty(),jQuery(".question-image").remove(),jQuery("#submitbutton").remove(),jQuery(".question").text("You got "+score+" out of "+quiz.content.length+" correct."),jQuery(document.createElement("h2")).addClass("score").css({"text-align":"center","font-size":"7em"}).text(Math.round(score/quiz.content.length*100)+"%").insertAfter(".question"),jQuery(".score").hide().fadeIn(1e3)}function htmlEncode(e){return jQuery(document.createElement("div")).text(e).html()}function setUpButtons(){jQuery(".choice").click(function(e){e.preventDefault();var t=jQuery(this).attr("data-index");jQuery(".choice").removeAttr("style").off("mouseover mouseout"),jQuery(this).css({"border-color":"#222","font-weight":700,"background-color":"rgb(250, 174, 0)"}),submission&&(submission=!1,jQuery(".submit-button").click(function(e){e.preventDefault(),jQuery(".choice").off("click"),jQuery(this).off("click"),nextQuestion(t)}))})}function triviaQuizInit(){"undefined"!=typeof quiz.title&&"string"===jQuery.type(quiz.title)?jQuery(document.createElement("h1")).text(quiz.title).appendTo(".quiz-frame"):jQuery(document.createElement("h1")).text("Quiz").appendTo(".quiz-frame"),"undefined"!=typeof quiz&&"object"===jQuery.type(quiz)&&(jQuery(document.createElement("p")).addClass("pager").text("Question 1 of "+quiz.content.length).appendTo(".quiz-frame"),jQuery(document.createElement("p")).addClass("question").text(quiz.content[0].question).appendTo(".quiz-frame"),quiz.content[0].hasOwnProperty("image")&&""!==quiz.content[0].image&&jQuery(document.createElement("img")).addClass("question-image").attr("src",quiz.content[0].image).appendTo(".quiz-frame").fadeIn(),jQuery(document.createElement("ul")).addClass("choices-block").appendTo(".quiz-frame"),addChoices(quiz.content[0].choices),jQuery(document.createElement("div")).addClass("submit").text("Submit Answer").appendTo(".quiz-frame"),jQuery(document.createElement("a")).addClass("submit-button").attr("href","#").appendTo(".submit"),setUpButtons(),jQuery(".quiz-frame").hide().fadeIn(1e3),jQuery(".explanation").hide().fadeIn(1e3))}function nextQuestion(e){jQuery(".explanation").empty(),currentQuestion++,lastQuestion=currentQuestion-1,lastQuestion>=0&&(jQuery(".explanation").append('<h3 style="font-variant: small-caps; text-decoration: underline;">Your Last Answer<h3>').append(quiz.content[lastQuestion].question),quiz.content[lastQuestion].choices[e]===quiz.content[lastQuestion].correct?(jQuery(".explanation").append('<p style="color: green;"><strong>Correct!</strong></p> '+quiz.content[lastQuestion].explanation),score++):jQuery(".explanation").append('<p style="color: red"><strong>Incorrect.</strong></p> '+quiz.content[lastQuestion].explanation),0===lastQuestion?jQuery(".quiz-frame").animate({left:"400px"},1e3):jQuery(".explanation").hide().fadeIn(1e3)),submission=!0,void 0===quiz.content[currentQuestion]?endQuiz():(jQuery(".question").text(quiz.content[currentQuestion].question),jQuery(".pager").text("Question "+Number(currentQuestion+1)+" of "+quiz.content.length),quiz.content[currentQuestion].hasOwnProperty("image")&&""!==quiz.content[currentQuestion].image?0===jQuery(".question-image").length?jQuery(document.createElement("div")).addClass("question-image").css({"background-image":"url("+quiz.content[currentQuestion].image+")"}).attr("alt",htmlEncode(quiz.content[currentQuestion].question)):jQuery(".question-image").css({"background-image":"url("+quiz.content[currentQuestion].image+")"}).attr("alt",htmlEncode(quiz.content[currentQuestion].question)):jQuery(".question-image").remove(),addChoices(quiz.content[currentQuestion].choices),setUpButtons())}function personalityAddChoices(e){if(jQuery.each(e,function(e,t){x.push(e),y.push(t)}),"undefined"!=typeof x&&"array"===jQuery.type(x)){jQuery(".choices-block").empty();for(var t=0;t<x.length;t++)jQuery(document.createElement("li")).addClass("choice").attr("data-index",t).append('<a href="#" class="choice"><span class="box">&#9744;</span>'+x[t]+"<img src="+y[t]+' alt="" class="picture"/></a>').appendTo(".choices-block")}}function personalityNextQuestion(e){currentQuestion++,personality_score[e]++,submission=!0,y=[],void 0===quiz.content[currentQuestion]?personalityEndQuiz():(x=[],jQuery(".question").text(quiz.content[currentQuestion].question),jQuery(".pager").text("Question "+Number(currentQuestion+1)+" of "+quiz.content.length),personalityAddChoices(quiz.content[currentQuestion].choices),personalitySetUpButtons(),quiz.content[currentQuestion].hasOwnProperty("image")&&""!==quiz.content[currentQuestion].image?0===jQuery(".question-image").length?jQuery(document.createElement("div")).addClass("question-image").css({"background-image":"url("+quiz.content[currentQuestion].image+")"}).attr("alt",htmlEncode(quiz.content[currentQuestion].question)):jQuery(".question-image").css({"background-image":"url("+quiz.content[currentQuestion].image+")"}).attr("alt",htmlEncode(quiz.content[currentQuestion].question)):jQuery(".question-image").remove())}function personalitySetUpButtons(){jQuery(".choice").click(function(e){e.preventDefault();var t=this;picked=jQuery(t).attr("data-index"),jQuery(".choice").removeClass("chosen"),jQuery(".choice .box").html("&#9744;"),jQuery(t).addClass("chosen"),jQuery(t).find(".box").html("&#9745;"),submission&&(submission=!1,jQuery(".submit-button").click(function(e){e.preventDefault(),jQuery(".choice").off("click"),jQuery(this).off("click"),personalityNextQuestion(picked)}))})}function personalityQuizInit(){"undefined"!=typeof quiz.title&&"string"===jQuery.type(quiz.title)?jQuery(document.createElement("p")).addClass("title").text(quiz.title).appendTo(".quiz-frame"):jQuery(document.createElement("p")).addClass("title").text("Quiz").appendTo(".quiz-frame"),"undefined"!=typeof quiz.content&&"array"===jQuery.type(quiz.content)&&(jQuery(document.createElement("p")).addClass("pager").text("Question 1 of "+quiz.content.length).appendTo(".quiz-frame"),jQuery(document.createElement("p")).addClass("question").text(quiz.content[0].question).appendTo(".quiz-frame"),quiz.content[0].hasOwnProperty("image")&&""!==quiz.content[0].image&&jQuery(document.createElement("div")).addClass("question-image").css({"background-image":"url("+quiz.content[currentQuestion].image+")"}).attr("alt",htmlEncode(quiz.content[currentQuestion].question)).appendTo(".quiz-frame"),jQuery(document.createElement("ul")).addClass("choices-block").appendTo(".quiz-frame"),personalityAddChoices(quiz.content[0].choices),jQuery(document.createElement("div")).addClass("submit").append('<a href="#" class="submit-button">Submit Answer</a>').appendTo(".quiz-frame"),personalitySetUpButtons())}function personalityEndQuiz(){var e=personality_score.indexOf(Math.max.apply(Math,personality_score)),t=quiz.results[e];jQuery(".question").empty(),jQuery(".pager").empty(),jQuery(".choices-block").empty(),jQuery(".question-image").remove(),jQuery(".submit-button").remove(),jQuery(".question").addClass("results").text("You got "+t+"!"),jQuery(".results").hide().fadeIn(1e3)}var quiz={},currentQuestion=0,score=0,x=[],y=[],personality_score=[],i=0,submission=!0,picked,lastQuestion;jQuery(document).ready(function(){if(quiz=jQuery.parseJSON(jQuery(".skift-quiz .skift-quiz-object").text()),"trivia"===quiz.type)triviaQuizInit();else if("personality"===quiz.type){for(i=0;i<quiz.results.length;i++)personality_score.push(0);personalityQuizInit()}});