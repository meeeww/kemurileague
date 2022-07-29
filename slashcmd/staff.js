const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Recibir el rol de tu equipo")
    .addStringOption(option => option.setName("invocador").setDescription("Poner exactamente con mayúsculas y minúsculas").setRequired(true))
    .addStringOption(option => option.setName("equipo").setDescription("Poner exactamente con mayúsculas y minúsculas").setRequired(true)),
    

    async run(client, interaction, dataGotten){
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
            range: "Jugadores",
        })
        
        //
        dataGotten = getRows.data
        //console.log(Object.keys(dataGotten).length)
        //console.log(dataGotten)
        const invocador = interaction.options.getString("invocador")
        const equipo = interaction.options.getString("equipo")

        for(var i = 0; i < Object.keys(dataGotten).length; i++){
            if(dataGotten["values"][i][1] === equipo){
                await interaction.guild.members.edit(interaction.user, { roles: [] })
                var role = interaction.guild.roles.cache.find(role => role.name === equipo);
                var tag = dataGotten["values"][i][6]
                var name = invocador
                interaction.member.setNickname(`[${tag}] [STAFF] ${name}`)
                interaction.member.roles.add(role);
                return;
            }

        }
    }
}