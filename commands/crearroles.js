const Discord = require("discord.js");
const { PermissionsBitField } = require('discord.js');
const express = require("express");
const { google } = require("googleapis");
const app = express();

module.exports = {
    name: "crearroles",
    alias: ["pooong"],

    async execute(client, message, args){
        if (message.member.roles.cache.some(role => role.name === 'Administrador')) {
            const auth = new google.auth.GoogleAuth({
                keyFile: "credentials.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets",
            });
            //Crear cliente
            
            //Crear google sheets api
            const googleSheets = google.sheets({version: "v4", auth: client});
        
            const spreadsheetId = "1pk8Bp4f6Jni27RipbB-UNBSTuAW4gNKD4DD3rvxrf9E"
            //metadata
            const metaData = await googleSheets.spreadsheets.get({
                auth,
                spreadsheetId,
            })
        
            //leer columnas
            const getRows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: "Equipos",
            })
            dataGotten = getRows.data
            //console.log(dataGotten)
            if(message.member.roles.cache.has("998940088857796700")){
                message.channel.send("Pong! En "+client.ws.ping+ "ms")
                for(var i = 0; i < dataGotten["values"][1][6]; i++)
                //console.log("hecho "+(i+1))
                //console.log(dataGotten["values"][i+1][0])
                message.guild.roles.create({ 
                    name: dataGotten["values"][i+1][0],
                    color: dataGotten["values"][i+1][4],
                    hoist: true,
                    permissions: [],
                    mentionable: true
                });
                
            }
        }
        // GuildChannelManager#create returns the channel you created
        

    }
}

