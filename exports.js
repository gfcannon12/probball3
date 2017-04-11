/*
An informative skill for Pro Basketball Fans *testing vscode github*
*/
'use strict';
var aws = require('aws-sdk');
var creds = require('./creds.js');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        console.log("event.request.type = " + event.request.type );

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    creds.appID();
    if (event.session.application.applicationId !== appID) {
        context.fail("Invalid Application ID");
     }

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
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(session, callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
        
        console.log("intentName = " + intentName);


    // dispatch custom intents to handlers here
	if ("PlayerIntent" === intentName) {
        handlePlayerRequest(intent, session, callback);
	} else if ("AMAZON.StopIntent" === intentName) {
        handleEndRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleEndRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else {
        handleFailRequest(intent, session, callback);
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var CARD_TITLE = "Pro Basketball Stats"; // Be sure to change this for your skill.

function getWelcomeResponse(session, callback) {
    var requestType = "Launch";  //Update this to the Request Type of this handler function
        var currUserID = session.user.userId;
        var currSessionID = session.sessionId;
        sendLaunchRequestToAnalyticsDB(currUserID, currSessionID, requestType);
        
    var sessionAttributes = {},
        speechOutput = "Welcome to the Pro Basketball Stats skill. What would you like to know?  Points per game for LeBron James?",
        shouldEndSession = false,
        repromptText = "Ask a question in the format 'stat' for 'player.' For example, Rebounds per Game for Blake Griffin";

    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

function handlePlayerRequest(intent, session, callback) { //handling the users response. it could be the question answer or i dont know or cancel, etc.
	
	var allStatSlots = ["player", "position", "age", "team", "games played", "games started", "minutes per game", "field goals made per game", "field goal attempts per game", "field goal percentage", "3 pointers made per game", "3 point attempts per game", "3 point percentage", "2 pointers made per game", "2 point attempts per game", "2 point percentage", "effective field goal percentage", "free throws made per game", "free throw attempts per game", "free throw percentage", "offensive rebounds per game", "defensive rebounds per game", "rebounds per game", "assists per game", "steals per game", "blocks per game", "turnovers per game", "fouls per game", "points per game", "minutes", "field goals made", "field goal attempts", "3 pointers made", "3 point attempts", "2 pointers made", "2 point attempts", "free throws made", "free throw attempts", "offensive rebounds", "defensive rebounds per game", "rebounds per game", "assists", "steals", "blocks", "turnovers", "fouls", "points"];
	var allPlayerSlots = ["ALEX ABRINES", "QUINCY ACY", "STEVEN ADAMS", "ARRON AFFLALO", "ALEXIS AJINCA", "COLE ALDRICH", "LAMARCUS ALDRIDGE", "LAVOY ALLEN", "TONY ALLEN", "AL-FAROUQ AMINU", "CHRIS ANDERSEN", "ALAN ANDERSON", "JUSTIN ANDERSON", "KYLE ANDERSON", "RYAN ANDERSON", "GIANNIS ANTETOKOUNMPO", "CARMELO ANTHONY", "JOEL ANTHONY", "TREVOR ARIZA", "DARRELL ARTHUR", "OMER ASIK", "D.J. AUGUSTIN", "LUKE BABBITT", "RON BAKER", "WADE BALDWIN", "LEANDRO BARBOSA", "J.J. BAREA", "HARRISON BARNES", "MATT BARNES", "WILL BARTON", "BRANDON BASS", "NICOLAS BATUM", "JERRYD BAYLESS", "ARON BAYNES", "KENT BAZEMORE", "BRADLEY BEAL", "MALIK BEASLEY", "MICHAEL BEASLEY", "MARCO BELINELLI", "DEANDRE' BEMBRY", "DRAGAN BENDER", "ANTHONY BENNETT", "DAVIS BERTANS", "PATRICK BEVERLEY", "BISMACK BIYOMBO", "NEMANJA BJELICA", "TARIK BLACK", "ERIC BLEDSOE", "BOJAN BOGDANOVIC", "ANDREW BOGUT", "JOEL BOLOMBOY", "DEVIN BOOKER", "TREVOR BOOKER", "AVERY BRADLEY", "COREY BREWER", "MALCOLM BROGDON", "AARON BROOKS", "ANTHONY BROWN", "BOBBY BROWN", "JAYLEN BROWN", "NICOLAS BRUSSINO", "REGGIE BULLOCK", "TREY BURKE", "ALEC BURKS", "JIMMY BUTLER", "BRUNO CABOCLO", "JOSE CALDERON", "KENTAVIOUS CALDWELL-POPE", "ISAIAH CANAAN", "CLINT CAPELA", "DEMARRE CARROLL", "VINCE CARTER", "MICHAEL CARTER-WILLIAMS", "OMRI CASSPI", "WILLIE CAULEY-STEIN", "TYSON CHANDLER", "WILSON CHANDLER", "MARQUESE CHRISS", "RAKEEM CHRISTMAS", "SEMAJ CHRISTON", "IAN CLARK", "JORDAN CLARKSON", "DARREN COLLISON", "NICK COLLISON", "MIKE CONLEY", "PAT CONNAUGHTON", "DEMARCUS COUSINS", "ROBERT COVINGTON", "ALLEN CRABBE", "JAMAL CRAWFORD", "JAE CROWDER", "DANTE CUNNINGHAM", "SETH CURRY", "STEPHEN CURRY", "TROY DANIELS", "ANTHONY DAVIS", "DEYONTA DAVIS", "ED DAVIS", "DEWAYNE DEDMON", "SAM DEKKER", "MALCOLM DELANEY", "MATTHEW DELLAVEDOVA", "LUOL DENG", "DEMAR DEROZAN", "CHEICK DIALLO", "BORIS DIAW", "GORGUI DIENG", "SPENCER DINWIDDIE", "TONEY DOUGLAS", "GORAN DRAGIC", "ANDRE DRUMMOND", "JARED DUDLEY", "MIKE DUNLEAVY", "KRIS DUNN", "KEVIN DURANT", "HENRY ELLENSON", "WAYNE ELLINGTON", "MONTA ELLIS", "JOEL EMBIID", "JAMES ENNIS", "TYLER ENNIS", "TYREKE EVANS", "DANTE EXUM", "KENNETH FARIED", "JORDAN FARMAR", "DERRICK FAVORS", "KAY FELDER", "CRISTIANO FELICIO", "RAYMOND FELTON", "YOGI FERRELL", "DORIAN FINNEY-SMITH", "BRYN FORBES", "EVAN FOURNIER", "RANDY FOYE", "TIM FRAZIER", "CHANNING FRYE", "DANILO GALLINARI", "LANGSTON GALLOWAY", "MARC GASOL", "PAU GASOL", "RUDY GAY", "MICHAEL GBINIJE", "ALONZO GEE", "PAUL GEORGE", "JONATHAN GIBSON", "TAJ GIBSON", "MANU GINOBILI", "RUDY GOBERT", "ARCHIE GOODWIN", "AARON GORDON", "ERIC GORDON", "MARCIN GORTAT", "TREVEON GRAHAM", "JERAMI GRANT", "JERIAN GRANT", "DANNY GREEN", "DRAYMOND GREEN", "GERALD GREEN", "JAMYCHAL GREEN", "JEFF GREEN", "BLAKE GRIFFIN", "JUSTIN HAMILTON", "A.J. HAMMONS", "TIM HARDAWAY", "JAMES HARDEN", "MAURICE HARKLESS", "MONTREZL HARRELL", "DEVIN HARRIS", "GARY HARRIS", "JOE HARRIS", "TOBIAS HARRIS", "AARON HARRISON", "ANDREW HARRISON", "UDONIS HASLEM", "SPENCER HAWES", "GORDON HAYWARD", "GERALD HENDERSON", "JOHN HENSON", "JUAN HERNANGOMEZ", "WILLY HERNANGOMEZ", "MARIO HEZONJA", "ROY HIBBERT", "BUDDY HIELD", "NENE HILARIO", "GEORGE HILL", "JORDAN HILL", "SOLOMON HILL", "DARRUN HILLIARD", "JRUE HOLIDAY", "JUSTIN HOLIDAY", "RONDAE HOLLIS-JEFFERSON", "RICHAUN HOLMES", "RODNEY HOOD", "AL HORFORD", "DANUEL HOUSE", "DWIGHT HOWARD", "MARCELO HUERTAS", "KRIS HUMPHRIES", "R.J. HUNTER", "SERGE IBAKA", "ANDRE IGUODALA", "ERSAN ILYASOVA", "JOE INGLES", "BRANDON INGRAM", "KYRIE IRVING", "DEMETRIUS JACKSON", "PIERRE JACKSON", "REGGIE JACKSON", "LEBRON JAMES", "AL JEFFERSON", "RICHARD JEFFERSON", "JOHN JENKINS", "BRANDON JENNINGS", "JONAS JEREBKO", "AMIR JOHNSON", "JAMES JOHNSON", "JOE JOHNSON", "STANLEY JOHNSON", "TYLER JOHNSON", "WESLEY JOHNSON", "NIKOLA JOKIC", "DAMIAN JONES", "DERRICK JONES", "JAMES JONES", "TERRENCE JONES", "TYUS JONES", "DEANDRE JORDAN", "CORY JOSEPH", "FRANK KAMINSKY", "ENES KANTER", "RYAN KELLY", "MICHAEL KIDD-GILCHRIST", "SEAN KILPATRICK", "BRANDON KNIGHT", "KYLE KORVER", "KOSTA KOUFOS", "MINDAUGAS KUZMINSKAS", "SKAL LABISSIERE", "JEREMY LAMB", "NICOLAS LAPROVITTOLA", "JOFFREY LAUVERGNE", "ZACH LAVINE", "TY LAWSON", "JAKE LAYMAN", "COURTNEY LEE", "DAVID LEE", "ALEX LEN", "KAWHI LEONARD", "MEYERS LEONARD", "JON LEUER", "CARIS LEVERT", "DEANDRE LIGGINS", "DAMIAN LILLARD", "JEREMY LIN", "SHAUN LIVINGSTON", "KEVON LOONEY", "BROOK LOPEZ", "ROBIN LOPEZ", "KEVIN LOVE", "KYLE LOWRY", "JOHN LUCAS III", "TIMOTHE LUWAWU-CABARROT", "TREY LYLES", "SHELVIN MACK", "IAN MAHINMI", "THON MAKER", "BOBAN MARJANOVIC", "JARELL MARTIN", "WESLEY MATTHEWS", "LUC MBAH A MOUTE", "JAMES MICHAEL MCADOO", "PATRICK MCCAW", "SHELDON MCCLELLAN", "C.J. MCCOLLUM", "T.J. MCCONNELL", "CHRIS MCCULLOUGH", "K.J. MCDANIELS", "DOUG MCDERMOTT", "JAVALE MCGEE", "RODNEY MCGRUDER", "BEN MCLEMORE", "JORDAN MCRAE", "JOSH MCROBERTS", "JODIE MEEKS", "SALAH MEJRI", "JORDAN MICKEY", "C.J. MILES", "MIKE MILLER", "PATTY MILLS", "PAUL MILLSAP", "NIKOLA MIROTIC", "GREG MONROE", "E'TWAUN MOORE", "MARCUS MORRIS", "MARKIEFF MORRIS", "ANTHONY MORROW", "DONATAS MOTIEJUNAS", "TIMOFEY MOZGOV", "EMMANUEL MUDIAY", "SHABAZZ MUHAMMAD", "DEJOUNTE MURRAY", "JAMAL MURRAY", "MIKE MUSCALA", "LARRY NANCE JR.", "SHABAZZ NAPIER", "MAURICE NDOUR", "GARY NEAL", "JAMEER NELSON", "RAUL NETO", "GEORGES NIANG", "ANDREW NICHOLSON", "JOAKIM NOAH", "NERLENS NOEL", "LUCAS NOGUEIRA", "STEVE NOVAK", "DIRK NOWITZKI", "JUSUF NURKIC", "KYLE O'QUINN", "DANIEL OCHEFU", "JAHLIL OKAFOR", "VICTOR OLADIPO", "KELLY OLYNYK", "ARINZE ONUAKU", "CHINANU ONUAKU", "KELLY OUBRE", "ZAZA PACHULIA", "GEORGIOS PAPAGIANNIS", "JABARI PARKER", "TONY PARKER", "CHANDLER PARSONS", "PATRICK PATTERSON", "CHRIS PAUL", "ADREIAN PAYNE", "CAMERON PAYNE", "ELFRID PAYTON", "PAUL PIERCE", "MARSHALL PLUMLEE", "MASON PLUMLEE", "MILES PLUMLEE", "JAKOB POELTL", "OTTO PORTER", "BOBBY PORTIS", "KRISTAPS PORZINGIS", "DWIGHT POWELL", "NORMAN POWELL", "TIM QUARTERMAN", "CHASSON RANDLE", "JULIUS RANDLE", "ZACH RANDOLPH", "J.J. REDICK", "WILLIE REED", "JOSH RICHARDSON", "MALACHI RICHARDSON", "AUSTIN RIVERS", "ANDRE ROBERSON", "BRIAN ROBERTS", "GLENN ROBINSON", "THOMAS ROBINSON", "SERGIO RODRIGUEZ", "RAJON RONDO", "DERRICK ROSE", "TERRENCE ROSS", "TERRY ROZIER", "RICKY RUBIO", "DAMJAN RUDEZ", "BRANDON RUSH", "D'ANGELO RUSSELL", "DOMANTAS SABONIS", "DARIO SARIC", "TOMAS SATORANSKY", "DENNIS SCHRODER", "LUIS SCOLA", "MIKE SCOTT", "THABO SEFOLOSHA", "KEVIN SERAPHIN", "RAMON SESSIONS", "IMAN SHUMPERT", "PASCAL SIAKAM", "JONATHON SIMMONS", "KYLE SINGLER", "MARCUS SMART", "ISH SMITH", "J.R. SMITH", "JASON SMITH", "TONY SNELL", "MARREESE SPEIGHTS", "NIK STAUSKAS", "LANCE STEPHENSON", "JARNELL STOKES", "DIAMOND STONE", "RODNEY STUCKEY", "JARED SULLINGER", "WALTER TAVARES", "JEFF TEAGUE", "MIRZA TELETOVIC", "GARRETT TEMPLE", "JASON TERRY", "ISAIAH THOMAS", "LANCE THOMAS", "HOLLIS THOMPSON", "KLAY THOMPSON", "TRISTAN THOMPSON", "MARCUS THORNTON", "ANTHONY TOLLIVER", "KARL-ANTHONY TOWNS", "P.J. TUCKER", "EVAN TURNER", "MYLES TURNER", "BENO UDRIH", "TYLER ULIS", "JONAS VALANCIUNAS", "DENZEL VALENTINE", "FRED VANVLEET", "ANDERSON VAREJAO", "GREIVIS VASQUEZ", "RASHAD VAUGHN", "NOAH VONLEH", "NIKOLA VUCEVIC", "SASHA VUJACIC", "DWYANE WADE", "DION WAITERS", "KEMBA WALKER", "JOHN WALL", "TAUREAN WALLER-PRINCE", "T.J. WARREN", "C.J. WATSON", "DAVID WEST", "RUSSELL WESTBROOK", "OKARO WHITE", "ISAIAH WHITEHEAD", "HASSAN WHITESIDE", "ANDREW WIGGINS", "C.J. WILCOX", "ALAN WILLIAMS", "DERON WILLIAMS", "DERRICK WILLIAMS", "LOU WILLIAMS", "MARVIN WILLIAMS", "REGGIE WILLIAMS", "TROY WILLIAMS", "KYLE WILTJER", "JUSTISE WINSLOW", "JEFF WITHEY", "CHRISTIAN WOOD", "METTA WORLD PEACE", "JAMES YOUNG", "JOE YOUNG", "NICK YOUNG", "THADDEUS YOUNG", "CODY ZELLER", "TYLER ZELLER", "STEPHEN ZIMMERMAN", "PAUL ZIPSER", "IVICA ZUBAC"];	
		
	//Send the user's request type and slot input to dynamoDB for analytics
    var PlayerSlot = intent.slots.Player.value;  //Update this to the slot name for this handler function
    var StatSlot = intent.slots.Stat.value;  //Update this to the slot name for this handler function
    var requestType = "Player Stats Request";  //Update this to the Request Type of this handler function
    var currUserID = session.user.userId;
    var currSessionID = session.sessionId;
    sendPlayerRequestToAnalyticsDB(PlayerSlot, StatSlot, currUserID, currSessionID, requestType);
	
	if (intent.slots.Stat.value === undefined || intent.slots.Player.value === undefined) {
		console.log("Slot value is undefined");
		var speechOutput = "I'm sorry. I did not understand your request.  Please try again.  Refer to your Alexa app for a list of supported stats.";
		var sessionAttributes = {};
		var repromptText = "Try a request such as, give me points per game for LeBron James";
		sendPlayerRequestToAnalyticsDB(PlayerSlot, StatSlot, currUserID, currSessionID, requestType);
		callback(sessionAttributes,
			buildSpeechletResponse2(CARD_TITLE, speechOutput, repromptText, false));
	} else {
		var stat = intent.slots.Stat.value;
		var stat2 = '\"'+ stat + '\"'; //'"points per game"'
		var player = intent.slots.Player.value;   
		var player2 = "\'"+ intent.slots.Player.value + "\'"; //"'Stephen curry'"
		var player3 = player.toUpperCase();
		var player4 = player2.toUpperCase();
	
		console.log(stat);
		console.log(player3);
		//console.log(allStatSlots.indexOf(stat));
		//console.log(allPlayerSlots.indexOf(player3));

		if (allStatSlots.indexOf(stat) == -1) {
			var speechOutput = "I'm sorry. I did not understand the stat you requested.  Please try again.  Refer to your Alexa app for a list of supported stats.";
			var sessionAttributes = {};
			var repromptText = "Try a request such as, give me points per game for LeBron James";
			callback(sessionAttributes,
				buildSpeechletResponse2(CARD_TITLE, speechOutput, repromptText, false));
		} else if (allPlayerSlots.indexOf(player3) == -1 ) {
			var speechOutput = "I'm sorry. I did not understand the player name you requested.  Please try again.  Unfortunately, some player names are difficult to understand";
			var sessionAttributes = {};
			var repromptText = "Try a request such as, give me rebounds per game for Blake Griffin";
			callback(sessionAttributes,
				buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));	
		} else {
			
			// This is for the people who forgot to say "per game" I'm adding "per game" so the table can be read
			var statColumns = ["player", "position", "age", "team", "games played", "games started", "minutes per game", "field goals made per game", "field goal attempts per game", "field goal percentage", "3 pointers made per game", "3 point attempts per game", "3 point percentage", "2 pointers made per game", "2 point attempts per game", "2 point percentage", "effective field goal percentage", "free throws made per game", "free throw attempts per game", "free throw percentage", "offensive rebounds per game", "defensive rebounds per game", "rebounds per game", "assists per game", "steals per game", "blocks per game", "turnovers per game", "fouls per game", "points per game"];
			if (statColumns.indexOf(stat) = -1) {
				stat = stat + " per game";
				stat2 = '\"'+ stat + '\"'; //'"points per game"'
			}
		
			//Query DB   
			var pg = require("pg");
            creds.rds();
			var conn = rds;
			var client = new pg.Client(conn);

			// connect to our database 
			client.connect(function (err) {
			  if (err) throw err;
	
			  // execute a query on our database
			  client.query('SELECT ' + stat2 + ' FROM nbastats WHERE "player" = ' + player4, function (err, result) {
				if (err) throw err;

				// just print the result to the console 
				console.log(result.rows[0]); // outputs: { 'rebounds per game': '4.5' }
				var stat3 = result.rows[0];

				var thenum = stat3[stat];
				//console.log(thenum);
				var speechOutput = player3 + " averages " + thenum + " " + stat;
				var sessionAttributes = {};
				var repromptText = "";
					callback(sessionAttributes,
						buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, true));

				// disconnect the client 
				client.end(function (err) {
				  if (err) throw err;
				});
			  });
			});
		}
	}
}

function handleEndRequest(intent, session, callback) { //handling the users response. it could be the question answer or i dont know or cancel, etc.
    var speechOutput = "Goodbye";
    var sessionAttributes = {};
    var repromptText = "";
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, true));
    
}

// I don't think this ever gets called
function handleFailRequest(intent, session, callback) { //handling the users response. it could be the question answer or i dont know or cancel, etc.
    var speechOutput = "I did not understand your request.  Ask for a stat in the format 'stat' for 'player.' For example, Steals per Game for Russell Westbrook";
    var sessionAttributes = {};
    var repromptText = "Go ahead. Tell me what you want to know";
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
    
}

function handleGetHelpRequest(intent, session, callback) {
    
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "Ask for a stat in the format 'stat' for 'player.' For example, Assists per Game for John Wall",
        repromptText = "Go ahead. Tell me what you want to know";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}


// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
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

function buildSpeechletResponse2(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: "points per game\nrebounds per game\nassists per game\nturnovers per game\nsteals per game\nblocks per game\nfree throw percentage\nfield goal percentage\n3 point percentage\neffective field goal percentage\nminutes per game\nfield goals made per game\nfield goal attempts per game\n3 pointers made per game\n3 point attempts per game\n2 pointers made per game\n2 point attempts per game\n2 point percentage\nfree throws made per game\nfree throw attempts per game\noffensive rebounds per game\ndefensive rebounds per game\nfouls per game"
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

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
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

function sendLaunchRequestToAnalyticsDB(currUserID, currSessionID, requestType) {
    // create a ddb instance, and determine the current timestamp + convert to string
    var db = new aws.DynamoDB();
    var d = new Date().toString();
    // this is what the DynamoDB call needs and will change based on table
    var params = {
         TableName: 'probballAnalytics',
         Item: { // this is a map for the noSQL data to be stored
             timestamp: { S: d },
             userId: { S: currUserID }, //session.user.userId
             sessionId: { S: currSessionID }, //session.sessionId
             request: { S: requestType }  //"Definition Request"
         }
    };
    // this is the actual call to DDB and done ahead of the callback
    db.putItem(params, function(err, data) {
        if (err) {
            console.log('ERROR. THE VALUE OF ERR.STACK is: ', err.stack); //error occured
        }else {
            console.log("DATA SUCCESSFULLY LOADED TO DATABASE. THE REQUEST TYPE WAS: " + requestType); // successful response
        }
    });
}

function sendPlayerRequestToAnalyticsDB(PlayerSlot, StatSlot, currUserID, currSessionID, requestType) {
    // create a ddb instance, and determine the current timestamp + convert to string
    var db = new aws.DynamoDB();
    var d = new Date().toString();
    // this is what the DynamoDB call needs and will change based on table
    var params = {
         TableName: 'probballAnalytics',
         Item: { // this is a map for the noSQL data to be stored
             timestamp: { S: d },
             PlayerSlot: {  S: PlayerSlot },  //intent.slots.gameName.value
             StatSlot: {  S: StatSlot },  //intent.slots.gameName.value
             userId: { S: currUserID }, //session.user.userId
             sessionId: { S: currSessionID }, //session.sessionId
             request: { S: requestType }  //"Definition Request"
         }
    };
    // this is the actual call to DDB and done ahead of the callback
    db.putItem(params, function(err, data) {
        if (err) {
            console.log('ERROR. THE VALUE OF ERR.STACK is: ', err.stack); //error occured
        }else {
            console.log("DATA SUCCESSFULLY LOADED TO DATABASE. THE REQUEST TYPE WAS: " + requestType); // successful response
        }
    });
}