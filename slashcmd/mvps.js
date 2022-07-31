const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mvps")
    .setDescription("Tabla de MVPs"),

    async run(client, interaction, dataGotten){
        
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        //Crear cliente
        
        //Crear google sheets api
        const googleSheets = google.sheets({version: "v4", auth: client});
    
        ///////arreglarxd const { spreadsheetId } = require("../hojaspartidos/"+interaction.options.getString("division")+".json")
        const { spreadsheetId } = require("../hojaspartidos/pu.json")
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

        var toplane = dataGotten2["values"][parseInt(jornada + 3)[20]]
        var jungle = dataGotten2["values"][parseInt(jornada + 3)[21]]
        var mid = dataGotten2["values"][parseInt(jornada + 3)[22]]
        var adc = dataGotten2["values"][parseInt(jornada + 3)[23]]
        var supp = dataGotten2["values"][parseInt(jornada + 3)[24]]
        //console.log(parseInt(jornada) + parseInt(sumar1))
        const row = new Discord.ActionRowBuilder()
        .addComponents(
          [
            new Discord.ButtonBuilder()
            .setCustomId("mvpjornada")
            .setLabel("MVP de la Jornada")
            .setStyle("PRIMARY")
            .setEmoji("😤")
          ],
          [
            new Discord.ButtonBuilder()
            .setCustomId("mvpposicion")
            .setLabel("MVP de Posición por Jornadas")
            .setStyle("PRIMARY")
            .setEmoji("😤")
          ],
          [
            new Discord.ButtonBuilder()
            .setCustomId("mvpkl")
            .setLabel("MVP de la KL")
            .setStyle("PRIMARY")
            .setEmoji("😤")
          ],
          [
            new Discord.ButtonBuilder()
            .setCustomId("mvpklroles")
            .setLabel("MVP de la KL por roles")
            .setStyle("PRIMARY")
            .setEmoji("😤")
          ]

        )

        const embed = new Discord.EmbedBuilder()
        .setColor("#fca2ad")
        .setTitle("MVPs de Kemuri League")
        .setDescription("Desde la Kemuri League creemos y reforzamos el esfuerzo que hacen los jugadores dentro de la grieta, por lo que hemos diseñado un algoritmo que recoge las estadísticas de todos los jugadores que hayan jugado en la jornada y los guarda, para que más tarde, todo el mundo pueda ver quién tuvo un mejor desempeño a lo largo de toda su estancia en la liga.\n\nPara ver la tabla de clasificación de los MVPs, selecciona el botón para el tipo de tabla que te interese.\n0️⃣ | Tabla general por Jornada\n1️⃣ | Tabla por roles por Jornadas\n2️⃣ | Top 5 jugadores  con más MVPs de la KL\n3️⃣ | Top 5 jugadores con más MVPs de la KL por rol")
        .setFooter({text: "Kemuri League"})
        //
        
        //console.log(Object.keys(dataGotten).length)
        //console.log(dataGotten)
        const divisionn = interaction.options.getString("division")
        
        //console.log(divisionn)
        
        interaction.channel.send({embeds: [embed], components: []}).then(msg => {
            msg.edit({embeds: [embed], components: [row]});
        });
    }
}