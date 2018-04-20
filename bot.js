var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var quizz = require('./quizz.json')
var maxQuestion = 9;
var players = new Array();
var playersNb = 0;


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
            case 'quizz':
              quiz(channelID);
            break;
            case 'question':
                var questionNb = Math.round(Math.random()*(maxQuestion-1));
                answer = quizz.quizz[questionNb].A;
                bot.sendMessage({
                    to: channelID,
                    message: quizz.quizz[questionNb].Q
                });

            break;
            // Just add any case commands if you want to..
         }
     }
});

function quiz(channelID)
{
  bot.sendMessage({
      to: channelID,
      message: 'Qui veux jouer ? Veuillez répondre !moi. Vous avez 30" pour vous inscrire'
  });
  setTimeout(bot.on('message', function (user, userID, channelID, message, evt) {
      // Our bot needs to know if it will execute a command
      // It will listen for messages that will start with `!`
      if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        var answer = "";
        switch(cmd) {
          case 'moi' :
            players[playersNb] = user;
          break;
        }
      }
    }), 30000);
    bot.sendMessage({
        to: channelID,
        message: 'Les inscriptions sont terminées. Les joueurs sont : '
    });
    for (i = 0; i < playersNb; i++)
    {
      bot.sendMessage({
          to: channelID,
          message: players[i]
      });
      i++;
      i--;
    }
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
  txt[4] = '= !quizz lance le quizz'
  txt[5] = 'en construction';
  for (i = 0; i < 6; i++)
  {
    bot.sendMessage({
        to: channelID,
        message: txt[i]
    });
    i++;
    i--;
  }
}
