const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.on('ready', () => {
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`)
});

client.on("error", (e) => {
  fs.writeFile("claims.json", '{}', err => {

  })
});

client.on('message', msg => {
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
  let args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let claims = JSON.parse(fs.readFileSync('./claims.json', 'utf8'));


  // parse commands
  if (command === 'claim') {
    if (!claims.hasOwnProperty(args.join(' ').toUpperCase())) {
      msg.channel.send({
        embed: {
          color: 0xCF000E,
          description: 'There is no such team to claim'
        }
      });
      return;
    } else if (claims[args.join(' ').toUpperCase()].length > 0) {
      msg.channel.send({
        embed: {
          color: 0xCF000E,
          description: 'This team has already been claimed'
        }
      });
      return;
    }

    // if the team hasn't been claimed you will be here
    claims[args.join(' ').toUpperCase()] = '<@' + msg.author.id + '>';

    fs.writeFile('./claims.json', JSON.stringify(claims), err => {
      if (err) console.error(err)
    });

    let message = '';

    for (let team in claims) {
      message += team + ": " + claims[team] + '\n' + (team === 'WPG' ? "\n" : "");
    }

    msg.guild.channels.get('462405509685837824').fetchMessages({
      limit: 1
    }).then(messages => {
      let lastMessage = messages.first();

      lastMessage.edit(message);
    })
    msg.channel.send({
      embed: {
        color: Math.floor(Math.random() * 0xFFFFFF),
        description: 'Team successfully claimed'
      }
    });
  } else if (command === 'start') {
    //edit to
    if (msg.member.roles.some((i) => i.id === '450222629857787904') || msg.author.id === '188350850530410497') {
      let channel = msg.guild.channels.get('462405509685837824');
      channel.send(`Claim Option 1: You may start claims at 12pm EST on Saturday. You may only claim one team at a time and must finish that team before claiming another. You can only claim a max of 3 teams on this day. You will be allowed to claim more teams starting at 12pm EST on Sunday with the same claiming format but without a limit on the number of teams you can claim.\n\nClaim Option 2: You may start claiming teams at 1pm EST on Saturday and you must claim 2 teams at once. You will not be allowed to claim anymore teams until 1pm EST on Sunday and you must finish ypur first pair of teams before you can. Claims done on Sunday will be claim 1 do 1 just like Claim Option1.\n${new Date().toJSON().slice(0, 10).replace(/-/g, '/'))}`;
      channel.send("BUF:\nCGY:\nCHI:\nEDM:\nHAM:\nLAP:\nMAN:\nMIN:\nNEW:\nNOLA:\nSFP:\nTBB:\nTEX:\nTOR:\nWKP:\nWPG:\n\nANA:\nANC:\nCAR:\nCOL:\nDET:\nHFX:\nKEL:\nLBL::\nSTL:\nVAN:");
      fs.writeFile('./claims.json', "{\"BUF\" : \"\",\"CGY\" : \"\",\"CHI\" : \"\",\"EDM\" : \"\",\"HAM\" : \"\",\"LAP\" : \"\",\"MAN\" : \"\",\"MIN\" : \"\",\"NEW\" : \"\",\"NOLA\" : \"\",\"SFP\" : \"\",\"TBB\" : \"\",\"TEX\" : \"\",\"TOR\" : \"\",\"WKP\" : \"\",\"WPG\" : \"\",\"ANA\" : \"\",\"ANC\" : \"\",\"CAR\" : \"\",\"COL\" : \"\",\"DET\" : \"\",\"HFX\" : \"\",\"KEL\" : \"\",\"LBL\" : \"\",\"STL\" : \"\",\"VAN\" : \"\"}", err => {
        if (err) console.error(err)
      });
    }
  } else if (command === 'add') {
    if (msg.member.roles.some((i) => i.id === '450222629857787904') || msg.author.id === '188350850530410497') {
      let channel = msg.guild.channels.get('462405509685837824');
      if (!claims.hasOwnProperty(args[0].toUpperCase())) {
        msg.channel.send({
          embed: {
            color: 0xCF000E,
            description: 'There is no such team to claim'
          }
        });
        return;
      } else if (claims[args[0].toUpperCase()].length > 0) {
        msg.channel.send({
          embed: {
            color: 0xCF000E,
            description: 'This team has already been claimed'
          }
        });
        return;
      }

      claims[args[0].toUpperCase()] = args[1].replace("!","");

      fs.writeFile('./claims.json', JSON.stringify(claims), err => {
        if (err) console.error(err)
      });

      let message = '';

      for (let team in claims) {
        message += team + ": " + claims[team] + '\n' + (team === 'WPG' ? "\n" : "");
      }

      msg.guild.channels.get('462405509685837824').fetchMessages({
        limit: 1
      }).then(messages => {
        let lastMessage = messages.first();

        lastMessage.edit(message);
      })
      msg.channel.send({
        embed: {
          color: Math.floor(Math.random() * 0xFFFFFF),
          description: 'Updater Successfully added'
        }
      });
    }
  } else if (command === 'done') {
    if (!claims.hasOwnProperty(args.join(' ').toUpperCase())) {
      msg.channel.send({
        embed: {
          color: 0xCF000E,
          description: 'There is no such team to mark as done'
        }
      });
      return;
    } else if (claims[args.join(' ').toUpperCase()].length === 0) {
      msg.channel.send({
        embed: {
          color: 0xCF000E,
          description: 'Nobody has claimed this team'
        }
      });
      return;
    } else if (claims[args.join(' ').toUpperCase()] !== '<@' + msg.author.id + '>') {
      msg.channel.send({
        embed: {
          color: 0xCF000E,
          description: 'This isn\'t your team to mark as done'
        }
      });
      return;
    }
    claims[args.join(' ').toUpperCase()] += ' ✅';

    fs.writeFile('./claims.json', JSON.stringify(claims), err => {
      if (err) console.error(err)
    });

    let message = '';

    for (let team in claims) {
      message += team + ": " + claims[team] + '\n' + (team === 'WPG' ? "\n" : "");
    }

    msg.guild.channels.get('462405509685837824').fetchMessages({
      limit: 1
    }).then(messages => {
      let lastMessage = messages.first();

      lastMessage.edit(message);
    })

    msg.channel.send({
      embed: {
        color: Math.floor(Math.random() * 0xFFFFFF),
        description: 'Got you marked as done'
      }
    });
  } else if (command === 'remove') {
    if (msg.member.roles.some((i) => i.id === '450222629857787904') || msg.author.id === '188350850530410497') {
      if (!claims.hasOwnProperty(args.join(' ').toUpperCase())) {
        msg.channel.send({
          embed: {
            color: 0xCF000E,
            description: 'There is no such team to remove a user from'
          }
        });
        return;
      } else if (claims[args.join(' ').toUpperCase()].length === 0) {
        msg.channel.send({
          embed: {
            color: 0xCF000E,
            description: 'Nobody has claimed this team'
          }
        });
        return;
      }
      claims[args.join(' ').toUpperCase()] = '';

      fs.writeFile('./claims.json', JSON.stringify(claims), err => {
        if (err) console.error(err)
      });

      let message = '';

      for (let team in claims) {
        message += team + ": " + claims[team] + '\n' + (team === 'WPG' ? "\n" : "");
      }

      msg.guild.channels.get('462405509685837824').fetchMessages({
        limit: 1
      }).then(messages => {
        let lastMessage = messages.first();

        lastMessage.edit(message);
      })
      msg.channel.send({
        embed: {
          color: Math.floor(Math.random() * 0xFFFFFF),
          description: 'User successfully removed from team'
        }
      });
    }
  } else if (command === 'help') {
    msg.channel.send({
      "embed": {
        "title": " Commands",
        "description": "Hey Updaters this is the list of bot commands. Have at it.",
        "color": Math.floor(Math.random() * 0xFFFFFF),
        "footer": {
          "text": "© esilverm"
        },
        "fields": [
          {
            "name": "Normie Commands",
            "value": "`!claim [team]` — This command lets you claim a team on the list\n`!done [team]` — This command checkmarks any teams you have completed."
          },
          {
            "name": "Head Updater Commands",
            "value": "`!start` — This command posts the main weekly message in #available-teams and prepares the bot for the current week's updates\n`!remove [team]` — Lets you remove an updater from a team if they accidentally claim it or if they are unable to finish it."
          }
        ]
      }
    })
  }
});

client.login(config.token);
