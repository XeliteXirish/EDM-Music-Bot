const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');

const client = exports.client = new Discord.Client();

const config = require('../config.json');

client.on('ready', () => {
    console.log(`Connected to ${client.guilds.size} servers!`);

    client.user.setGame(`${config.playingUrl}`).catch(err => {console.error(`Unable to set playing status, Error: ${err.stack}`)});

});

client.on('message', msg => {

    const args = msg.content.split(' ').splice(2);
    let command = msg.content.split(' ')[1];


    if (command === 'join'){
        let userVoiceChannel = msg.member.voiceChannel;
        if (!userVoiceChannel) return msg.reply(`You must be in a voice channel!`);

        userVoiceChannel.join().then(connection => {
            const stream = ytdl(config.playingUrl, {filter: 'audioonly'});
            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => {userVoiceChannel.leave()});
        })

    }else if (command === 'volume') {

        if (!dispatcher) return msg.reply(`Sorry but the bot has to be playing something for you to change its volume!`);
        if (!args.length > 0) return msg.reply(`Sorry but you didn't supply a volume for it to be changed to!`);

        // Check perms
        if (!msg.member.hasPermission(config.moderatorPerm)) return msg.reply(`Sorry but you need the permission **${config.moderatorPerm}** to use this command!`);

        let volume = args[0] / 100; // Think this should work

        msg.reply(`The volume has been successfully changed to ${volume}`);
    }
});

client.login(config.token).catch(err => {console.error(`Unable to login with the supplied token, make sure its correct and try again!`)});