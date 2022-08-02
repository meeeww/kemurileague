const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mpvsjornada")
    .setDescription("Tabla de MVPs por Jornadas")
    .addStringOption(option => option.setName("division").setDescription("División y grupo: ").setRequired(true).addChoices(
        { name: 'Primera División - Grupo 1', value: "pu"},
        { name: 'Primera División - Grupo 2', value: "pd"},
        { name: 'Segunda División - Grupo 1', value: "su"},
        { name: 'Segunda División - Grupo 2', value: "sd"},
        { name: 'Tercera División - Grupo 1', value: "tu"},
        { name: 'Tercera División - Grupo 2', value: "td"},
    ))
    .addStringOption(option => option.setName("jornada").setDescription("Jornada: ").setRequired(true).addChoices(
        { name: 'Uno', value: "1"},
        { name: 'Dos', value: "2"},
        { name: 'Tres', value: "3"},
        { name: 'Cuatro', value: "4"},
        { name: 'Cinco', value: "5"},
        { name: 'Seis', value: "6"},
        { name: 'Siete', value: "7"},
        { name: 'Ocho', value: "8"},
        { name: 'Nueve', value: "9"},
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
            range: "Calendario",
        })
        dataGotten2 = getRows.data
        var jornada = interaction.options.getString("jornada")
        
        var toplane = dataGotten2["values"][(parseInt(jornada)) + 3][20]
        var jungle = dataGotten2["values"][(parseInt(jornada)) + 3][21]
        var mid = dataGotten2["values"][(parseInt(jornada)) + 3][22]
        var adc = dataGotten2["values"][(parseInt(jornada)) + 3][23]
        var supp = dataGotten2["values"][(parseInt(jornada)) + 3][24]
        //console.log(parseInt(jornada) + parseInt(sumar1))
        const embed = new Discord.EmbedBuilder()
        .setColor("#fca2ad")
        .setTitle("MVPs de "+dataGotten2["values"][0][12])
        .setDescription("Jornada "+jornada)
        .addFields(
            {
                "name": "Toplane",
                "value": "**"+toplane+"**",
                //inline: true
              },
              {
                "name": "Jungla",
                "value": "**"+jungle+"**",
                //inline: true
              },
              {
                "name": "Mid",
                "value": "**"+mid+"**",
                //inline: true
              },
              {
                "name": "ADC",
                "value": "**"+adc+"**",
                //inline: true
              },
              {
                "name": "Support",
                "value": "**"+supp+"**",
                //inline: true
              }
            )
            .setFooter({text: "Kemuri League"})
        //
        
        //console.log(Object.keys(dataGotten).length)
        //console.log(dataGotten)
        const divisionn = interaction.options.getString("division")
        
        //console.log(divisionn)
        
        interaction.channel.send({embeds: [embed], components: []}).then(msg => {
            msg.edit({embeds: [embed], components: []});
        });
    }
}