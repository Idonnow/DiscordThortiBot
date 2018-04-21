var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var quizz = require('./quizz.json');
var timer = require('timers');
var maxQuestion = 9;
var players = new Array();
var playersScore = new Array();
var playersNb = 0;
var bugpasstp = '';
var flagQ = false;


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bo[]
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        var answer = "";
        switch(cmd) {
          case 'test' :
            bot.sendMessage({
                to: channelID,
                message: user
            });
            break;
            case 'ping' :
              pong(channelID);
            break;
            case 'help' :
              help(channelID);
            break;
            case 'moi':
              participe(channelID,user);
            break;
            case 'score':
              score(channelID);
            break;
            case 'run':
              run(channelID);
            break;

            // Just add any case commands if you want to..
         }
     }
     else answerVerif(channelID,user,message);

});

function run (channelID)
{
  if (playersNb<2)
  {
    bot.sendMessage({
        to: channelID,
        message: 'Pas assez de joueurs (min 2)'
    });
  }
  else
    {
      var questionNb = Math.round(Math.random()*(maxQuestion-1));
      bugpasstp = quizz.quizz[questionNb].A;
      bot.sendMessage({
          to: channelID,
          message: 'Question : ' + quizz.quizz[questionNb].Q
      });
      logger.info ('Q: ' + quizz.quizz[questionNb].Q + '\nR: '+quizz.quizz[questionNb].A);
      flagQ = true;
    }
}

function answerVerif (channelID,user,message)
{
  //logger.info('message : '+ message, ' , answer ! ' + bugpasstp);
  //if (strcmp(message,bugpasstp) == true)
  if (message == bugpasstp)
  {
    if (flagQ == true)
    {
      var index = players.indexOf(user);
      if (index  != -1)
      {
        bot.sendMessage({
            to: channelID,
            message: 'Bravo @' + user + '! la réponses était ' + bugpasstp
        });
        playersScore[index]++;
        flagQ = false;
      }
    }
  }
}

function score(channelID)
{
  var msg = 'Tableau des scores :\n';
  for (var i=0; i<playersNb; i++)
  {
    msg = msg + players[i] + ' : '  + playersScore[i] + '\n';
  }
  bot.sendMessage({
      to: channelID,
      message: msg
  });
}

function participe(channelID,user)
{
  players.push(user);
  playersScore.push(0);
  playersNb++;
  bot.sendMessage({
      to: channelID,
      message: user + ' participe au tournois'
  });
}

function pong(channelID)
{
  bot.sendMessage({
      to: channelID,
      message: 'pong'
  });
}

function help(channelID)
{
  var txt = [];
  txt[0] = 'ThortiQuizz à votre service';
  txt[1] = 'Ci dessous la liste des commandes utilisable';
  txt[2] = '- !ping : répond pong';
  txt[3] = '- !help : ce que tu viens de taper';
  txt[4] = '- !moi : t ajoute à la liste des joueurs'
  txt[5] = '- !score : donne les scores'
  txt[6] = '- !run : pose une question';
  var msg = '';
  for (i = 0; i < 7; i++)
  {
    msg = msg +  txt[i] + '\n';
  }
  bot.sendMessage({
      to: channelID,
      message: msg
  });
}

function strcmp(a, b)
{
    return (a<b?-1:(a>b?1:0));
}
