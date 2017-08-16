const Discord = require('discord.js');
const axios = require('axios');
const urban = require('urban');
const trollface = urban('trollface');

const botSettings = require('./botsettings.json');
const prefix = botSettings.prefix;
const clientOptions = {
  disableEveryone: true
};

let urbandict = botSettings.apis.urban;

const bot = new Discord.Client(clientOptions);

bot.on('ready', async () => {
  console.log(`bot is ready! ${bot.user.username}`);

  //bot.generateInvite(["ADMINISTRATOR"])
    //.then(link => {
      //console.log(link);
    //}).catch(err => {
      //console.log('err', err.stack);
    //});
  //console.log('hello 2');

  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch(e) {
    console.log(e.stack);
  }
});

bot.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;

  if (command === `${prefix}userinfo`) {
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription('This is the users info')
        .setThumbnail(message.author.avatarURL)
        .setColor('#9b59b6')
        .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
        .addField('ID', message.author.id)
        .addField('Created At', message.author.createdAt);

    message.channel.sendEmbed(embed);

    return;
  }

  // urban dictionary
  // TODO: make one that takes a word
  if (command === `${prefix}urban`) {
    if (!args.length) {
      let embed = new Discord.RichEmbed();
      axios
        .get(urbandict, {
          params: {
            term: 'thot'
          }
        })
        .then(function(response) {
          let term = response.data.list[0];
          embed
            .setAuthor(term.word)
            .setDescription(term.definition)
            .setURL(term.permalink)
            .setColor('#1D2439');

          message.channel.send({ embed: embed });
        });
    } else {
      let joinArgs = args.join(' ');
      let embed = new Discord.RichEmbed();
      axios
        .get(urbandict, {
          params: {
            term: joinArgs
          }
        })
        .then(function(response) {
          let term = response.data.list[0];
          embed
            .setAuthor(term.word)
            .setDescription(term.definition)
            .setURL(term.permalink)
            .setColor('#1D2439');

        message.channel.send({ embed: embed });
        });
    }

    return;
  }
});

bot.login(botSettings.token);
