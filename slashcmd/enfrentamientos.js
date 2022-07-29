const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("enfrentamientos")
    .setDescription("Tabla de enfrentamientos")
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
            range: "Calendario",
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
        .setTitle("Enfrentamientos "+dataGotten2["values"][0][12])
        .setDescription("Jornada "+dataGotten2["values"][1][13])
        .addFields(
            {
                "name": dataGotten2["values"][parseInt(jornada) + parseInt(sumar1)][3]+" vs. "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar1)][7],
                "value": dataGotten2["values"][parseInt(jornada) + parseInt(sumar1)][8]+" - "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar1)][9],
                //inline: true
              },
              {
                "name": dataGotten2["values"][parseInt(jornada) + parseInt(sumar2)][3]+" vs. "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar2)][7],
                "value": dataGotten2["values"][parseInt(jornada) + parseInt(sumar2)][8]+" - "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar2)][9],
                //inline: true
              },
              {
                "name": dataGotten2["values"][parseInt(jornada) + parseInt(sumar3)][3]+" vs. "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar3)][7],
                "value": dataGotten2["values"][parseInt(jornada) + parseInt(sumar3)][8]+" - "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar3)][9],
                //inline: true
              },
              {
                "name": dataGotten2["values"][parseInt(jornada) + parseInt(sumar4)][3]+" vs. "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar4)][7],
                "value": dataGotten2["values"][parseInt(jornada) + parseInt(sumar4)][8]+" - "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar4)][9],
                //inline: true
              },
              {
                "name": dataGotten2["values"][parseInt(jornada) + parseInt(sumar5)][3]+" vs. "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar5)][7],
                "value": dataGotten2["values"][parseInt(jornada) + parseInt(sumar5)][8]+" - "+dataGotten2["values"][parseInt(jornada) + parseInt(sumar5)][9],
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