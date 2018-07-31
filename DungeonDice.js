/**
* Dungeon Dice - April 2016
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
        
    // Dispatch to your skill's intent handlers
    if ("DiceRollSize" === intentName) {
        getDiceRoll(intent, session, callback);
    } else if ("DiceRoll" === intentName) {
        getRollMsg(callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------
function getDiceRoll(intent, session, callback) {
    var cardTitle = "Roll Dice"
    var diceType = intent.slots.DiceType.value.replace('sided','').replace('dice','').replace('die','').replace('.','').replace(/\s+/g,'').toLowerCase();
    var diceRoll = 1;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var diceSound = "<audio src='[YOURHOSTPATH]/dicesound.mp3'/>";

    console.log("IntentRequest Handled - DiceRollSize Intent - getDiceRoll() - Dice Type: "+ diceType);

    switch(diceType) {
        case "d4":
            diceRoll=randomNumber(1,4);
            break;
        case "d6":
            diceRoll=randomNumber(1,6);
            break;
        case "d8":
            diceRoll=randomNumber(1,8);
            break;
        case "d10":
            diceRoll=randomNumber(1,10);
            break;
        case "d12":
            diceRoll=randomNumber(1,12);
            break;
        case "d20":
            diceRoll=randomNumber(1,20);
            break;
        case "dfour":
            diceRoll=randomNumber(1,4);
            diceType="d4";
            break;
        case "dsix":
            diceRoll=randomNumber(1,6);
            diceType="d6";
            break;
        case "deight":
            diceRoll=randomNumber(1,8);
            diceType="d8";
            break;
        case "dten":
            diceRoll=randomNumber(1,10);
            diceType="d10";
            break;
        case "dtwelve":
            diceRoll=randomNumber(1,12);
            diceType="d12";
            break;
        case "dtwenty":
            diceRoll=randomNumber(1,20);
            diceType="d20";
            break;
        case "4":
            diceRoll=randomNumber(1,4);
            diceType="d4";
            break;
        case "6":
            diceRoll=randomNumber(1,6);
            diceType="d6";
            break;
        case "8":
            diceRoll=randomNumber(1,8);
            diceType="d8";
            break;
        case "10":
            diceRoll=randomNumber(1,10);
            diceType="d10";
            break;
        case "12":
            diceRoll=randomNumber(1,12);
            diceType="d12";
            break;
        case "20":
            diceRoll=randomNumber(1,20);
            diceType="d20";
            break;
        default:
            diceType=0;
            diceRoll=0;
    }
    if (diceType===0)
    {
        speechOutput="<speak>I'm sorry, " + intent.slots.DiceType.value +" isn't a type of dice I can roll. Try saying something like, roll a d20 or roll a 6.</speak>";
        shouldEndSession = false;
        console.log("DiceRollSize Intent - Invalid dice type and asked for different roll.");
    }
    else if (diceType === "d20" && diceRoll === 20)
    {
      speechOutput = "<speak>" + diceSound + "You rolled " + diceRoll + " on a " + diceType + "! Nice, critical hit. Is that a vorpal blade you are using?</speak>"; 
      console.log("DiceRollSize Intent - Critical Hit of 20 on d20!");
    }
    else if (diceType === "d20" && diceRoll === 1)
    {
      speechOutput = "<speak>" + diceSound + "You rolled " + diceRoll + " on a " + diceType + "! Such fail! Time to get some new dice!</speak>";  
      console.log("DiceRollSize Intent - Critical Fail of 1 on d20!");
    }
    else
    {
        speechOutput = "<speak>" + diceSound + "You rolled " + diceRoll + " on a " + diceType + "!</speak>";
    }
    repromptText = "Please tell me what type of dice you would like to use. For example, you can say d20, d10 or d6.";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getRollMsg(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Choose Dice Type";
    var speechOutput = "<speak>I can't roll that type of dice. " + getMsgDiceRoll() + "</speak>";
    var repromptText="Please tell me what type of dice you would like to use. For example, you can say d20, d10 or d6.";
    var shouldEndSession = false;

    console.log("IntentRequest Handled - DiceRoll Intent - getRollMsg()");

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome!";
    var speechOutput = "<speak>Welcome to Dungeon Dice. Currently I can roll for a 4, 6, 8, 10, 12 and 20 sided dice. " + getMsgDiceRoll() + "</speak>"; 
    var repromptText="Please tell me what type of dice you would like to use. For example, you can say d20, d10 or d6.";
    var shouldEndSession = false;
    
    console.log("LaunchRequest Handled - getWelcomeResponse()");

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getMsgDiceRoll() {
    return "Try saying something like, roll a d20 or roll a 6. ";
}

function randomNumber (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "<speak>Thank you for trying the Dungeon Dice! May you have many more adventures!</speak>";
    var shouldEndSession = true;

    console.log("SessionEndedRequest Handled - handleSessionEndRequest()");
    
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    var regex = /(<([^>]+)>)/ig;
    var cardContent = output.replace(regex, "");
    
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        card: {
            type: "Simple",
            title: "Dungeon Dice - " + title,
            content: cardContent
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
