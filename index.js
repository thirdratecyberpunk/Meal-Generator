'use strict';
var request = require('request');

function buildSpeechletResponse(output, shouldEndSession){

    return{
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },

        card: {
            type: 'Standard',
        },

        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse){
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function getRecipe(ingredients){
return new Promise((resolve, reject) => {
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body).results;
    var titles = [];
    for (var item in results){
      titles.push(results[item].title);
    }
    resolve(titles[Math.floor(Math.random() * titles.length)]);
    reject(error);
  });
});
}


function getRequestURL(ingredients){
  var url = "http://www.recipepuppy.com/api?i=";
  ingredients.forEach(function(elem) {
    url += elem + ",";
  });
  return url;
}


function help(callback){
    callback({}, buildSpeechletResponse("To get a meal idea say get me a meal. To input ingredients say my ingredients are eggs and cheese. To quit this skill, please say quit.", false));
}

function getMeal(session, callback){

    console.log("this " + session.Attributes);
    if (!session.Attributes == null){
      getRecipe([]).then((output) => {
        callback({}, buildSpeechletResponse("Why don't you try " + output, false));
      });
    }
    else{
        callback({}, buildSpeechletResponse("You need to enter some ingredients first, you can do this by saying my ingredients are eggs and cheese, you may input up to five ingredients", false));
    }
}

function createIngredientsAttributes(ingredients){
    return {
        ingredients,
    };
}

function inputIngredients (intent, session, callback){

    var ingredients = [intent.slots.fooda.value, intent.slots.foodb.value, intent.slots.foodc.value, intent.slots.foodd.value, intent.slots.foodc.value];
    getRecipe(ingredients).then((output) => {
        callback(createIngredientsAttributes(ingredients), buildSpeechletResponse("Based on your ingredients we reccomend you make " + output + ". If this recipe is not to your liking, ask for a new one by saying get me a recipe", false));
    });
}

function welcome(callback){
    callback({}, buildSpeechletResponse("Welcome to our Meal generator, also I love brumhack", false));
}

function sessionEnd(callback){
    callback({}, buildSpeechletResponse("Thankyou for using this skill, goodbye", true));
}

function onSessionStarted(sessionStartedRequest, session) {
    console.log('sessionStartedRequest requestId = ${sessionStartedRequest.requestId}, sessionId = ${session.sessionId}');
}

function onLaunch(launchRequest, session, callback) {
        welcome(callback);
}

function onIntent(intentRequest, session, callback) {

    console.log('intentRequest requestId = ${intentRequest.requestId}, sessionId = ${session.sessionId}');

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

        switch(intentName){

        case 'inputIngredients' :
            break;

        case 'getMeAMeal' :
            getMeal(session, callback);
            break;

        case 'AMAZON.HelpIntent' :
            help(callback);
            break;

        case 'AMAZON.StopIntent' :
        case 'AMAZON.CancelIntent' :
            sessionEnd(callback);
            break;

        default :
            throw new Error('Invalid intent');
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log('onSessionEnded requestId = ${sessionEndedRequest.requestId}, sessionId = ${session.sessionId}');
}


exports.handler = (event, context, callback) => {
    try {

        if (event.session.application.applicationId !==  "amzn1.ask.skill.74d039fe-deb9-471e-914d-d2bc14f899ce") {
            callback('invalid application ID');
        }

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
        }

        else if (event.request.type === 'IntentRequest') {
            onIntent(event.request, event.session, (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
        }
        else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }

    }

    catch (err) {
        callback(err);
    }
};
