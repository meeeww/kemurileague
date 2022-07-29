const Discord = require("discord.js");
const { PermissionsBitField } = require('discord.js');
const express = require("express");
const { google } = require("googleapis");
const app = express();

module.exports = {
    name: "ping",
    alias: ["pooong"],

    async execute(client, message, args){
        message.channel.send("Pong! En "+client.ws.ping+ "ms")
        // GuildChannelManager#create returns the channel you created
        

    }
}

