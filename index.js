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
    console.log(getRequestURL(ingredients));
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body).results;
    var object = [];
    for (var item in results){
      object.push(results[item]);
    }
    resolve(object[Math.floor(Math.random() * object.length)]);
    reject(error);
  });
});
}


function getRequestURL(ingredients){
  var url = "http://www.recipepuppy.com/api/";
  if (ingredients.length){
    url += "?i=";
    ingredients.forEach(function(elem) {
      if (elem != null){
        url += elem + ",";
        }
    });
  }
  return url;
  }


function help(session, callback){
    callback(session.attributes, buildSpeechletResponse("To get a meal idea say get me a meal. To input ingredients say my ingredients are eggs and cheese. To quit this skill, please say quit.", false));
}

function getMeal(session, callback){

    if (session.attributes){

        var ingredients;

        if(session.attributes.B == null){
            ingredients = [session.attributes.A];
        }
        else if(session.attributes.C == null){
            ingredients = [session.attributes.A,session.attributes.B];
        }
        else if(session.attributes.D == null){
            ingredients = [session.attributes.A,session.attributes.B,session.attributes.C];
        }
        else if(session.attributes.E == null){
            ingredients = [session.attributes.A,session.attributes.B,session.attributes.C, session.attributes.D];
        }
        else{
            ingredients = [session.attributes.A,session.attributes.B,session.attributes.C, session.attributes.D, session.attributes.E];
        }

        getRecipe(ingredients).then((output) => {
        callback(session.attributes, buildSpeechletResponse("Why don't you try " + output.title + ". This uses " + output.ingredients, false));
      });
    }
    else{
        callback({}, buildSpeechletResponse("You need to enter some ingredients first, you can do this by saying my ingredients are eggs and cheese, you may input up to five ingredients", false));
    }
}

function createIngredientsAttributes(A,B,C,D,E){
    return {
        A,
        B,
        C,
        D,
        E,
    };
}

function inputIngredients (intent, session, callback){

    var A = intent.slots.fooda.value;
    var B = intent.slots.foodb.value;
    var C = intent.slots.foodc.value;
    var D = intent.slots.foodd.value;
    var E = intent.slots.foode.value;

    getRecipe([A,B,C,D,E]).then((output) => {
        callback(createIngredientsAttributes(A,B,C,D,E), buildSpeechletResponse("Based on your ingredients we reccomend you make " + output.title + ". This uses " + output.ingredients + ". If this recipe is not to your liking, ask for a new one by saying get me a recipe", false));
    });
}

function invalidIntent(session, callback){
    callback(session.attributes, buildSpeechletResponse("Sorry I do not understand what you are trying to say, ask for help if you want to know what this skill can do", false));
}

function welcome(session, callback){
    callback({}, buildSpeechletResponse("Welcome to our Meal generator, also I love brumhack", false));
}

function sessionEnd(callback){
    callback({}, buildSpeechletResponse("Thankyou for using this skill, goodbye", true));
}

function onSessionStarted(sessionStartedRequest, session) {
}

function onLaunch(launchRequest, session, callback) {
        welcome(session, callback);
}

function onIntent(intentRequest, session, callback) {

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

        switch(intentName){

        case 'InputIngredients' :
            inputIngredients(intent, session, callback);
            break;

        case 'getMeAMeal' :
            getMeal(session, callback);
            break;

        case 'AMAZON.HelpIntent' :
            help(session, callback);
            break;

        case 'invalidIntent' :
            invalidIntent(session, callback);
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
