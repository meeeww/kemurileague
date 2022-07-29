const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clasificacion")
    .setDescription("Tabla de clasificacion")
    .addStringOption(option => option.setName("division").setDescription("División y grupo: ").setRequired(true).addChoices(
        { name: 'Primera División - Grupo 1', value: "pu"},
        { name: 'Primera División - Grupo 2', value: "pd"},
        { name: 'Segunda División - Grupo 1', value: "su"},
        { name: 'Segunda División - Grupo 2', value: "sd"},
        { name: 'Tercera División - Grupo 1', value: "tu"},
        { name: 'Tercera División - Grupo 2', value: "td"},
    )),
    

    async run(client, interaction, dataGotten){
        
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        //Crear cliente
        
        //Crear google sheets api
        const googleSheets = google.sheets({version: "v4", auth: client});
    
        const { spreadsheetId } = require("../hojaspartidos/"+interaction.options.getString("division")+".json")
        //metadata
        const metaData = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId,
        })
    
        //leer columnas
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Clasificación",
        })
        dataGotten2 = getRows.data
        var jornada = dataGotten2["values"][1][13]
        var sumar1 = dataGotten2["values"][1][14]
        var sumar2 = dataGotten2["values"][1][15]
        var sumar3 = dataGotten2["values"][1][16]
        var sumar4 = dataGotten2["values"][1][17]
        var sumar5 = dataGotten2["values"][1][18]
        //console.log(parseInt(jornada) + parseInt(sumar1))
        const embed = new Discord.EmbedBuilder()
        .setColor("#fca2ad")
        .setTitle("Tabla de Clasificación")
        .setDescription("Jornada "+dataGotten2["values"][0][4])
        .addFields(
          {
              "name": "🥇 "+dataGotten2["values"][1][1],
              "value": "Victorias: "+dataGotten2["values"][1][2]+"\nDerrotas: "+dataGotten2["values"][1][3],
              inline: true
            },
            {
              "name": "🥈 "+dataGotten2["values"][2][1],
              "value": "Victorias: "+dataGotten2["values"][2][2]+"\nDerrotas: "+dataGotten2["values"][2][3],
              inline: true
            },
            {
              "name": "🥉 "+dataGotten2["values"][3][1],
              "value": "Victorias: "+dataGotten2["values"][3][2]+"\nDerrotas: "+dataGotten2["values"][3][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][4][1],
              "value": "Victorias: "+dataGotten2["values"][4][2]+"\nDerrotas: "+dataGotten2["values"][4][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][5][1],
              "value": "Victorias: "+dataGotten2["values"][5][2]+"\nDerrotas: "+dataGotten2["values"][5][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][6][1],
              "value": "Victorias: "+dataGotten2["values"][6][2]+"\nDerrotas: "+dataGotten2["values"][6][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][7][1],
              "value": "Victorias: "+dataGotten2["values"][7][2]+"\nDerrotas: "+dataGotten2["values"][7][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][8][1],
              "value": "Victorias: "+dataGotten2["values"][8][2]+"\nDerrotas: "+dataGotten2["values"][8][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][9][1],
              "value": "Victorias: "+dataGotten2["values"][9][2]+"\nDerrotas: "+dataGotten2["values"][9][3],
              inline: true
            },
            {
              "name": dataGotten2["values"][10][1],
              "value": "Victorias: "+dataGotten2["values"][10][2]+"\nDerrotas: "+dataGotten2["values"][10][3],
              inline: true
            }
          )
          .setFooter({text: "Kemuri League"})
        //
        
        //console.log(Object.keys(dataGotten2).length)
        //console.log(dataGotten2)
        const divisionn = interaction.options.getString("division")
        
        //console.log(divisionn)
        
        interaction.channel.send({embeds: [embed], components: []}).then(msg => {
            msg.edit({embeds: [embed], components: []});
        });
    }
}