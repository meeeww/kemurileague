const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mvpsposición")
    .setDescription("Tabla de MVPs por Rol")
    .addStringOption(option => option.setName("posicion").setDescription("Rol: ").setRequired(true).addChoices(
        { name: 'Toplaners', value: "Toplaners"},
        { name: 'Junglas', value: "Junglas"},
        { name: 'Midlaners', value: "Midlaners"},
        { name: 'ADCs', value: "ADCs"},
        { name: 'Supports', value: "Supports"},
    )),
    

    async run(client, interaction, dataGotten){
        
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        //Crear cliente
        
        //Crear google sheets api
        const googleSheets = google.sheets({version: "v4", auth: client});
    
        const { spreadsheetId } = require("../hojaspartidos/bbdd.json")
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
        dataGotten2 = getRows.data
        var listaJugadores = []
        for(var i = 0; i < dataGotten2["values"][0][11]; i++){
            if(dataGotten2["values"][i + 1][7] == interaction.options.getString("posicion")){
                listaJugadores.push([dataGotten2["values"][i + 1][3], dataGotten2["values"][i + 1][0]])
            }
        }
        var listJugadoresSorted = listaJugadores.sort()
        console.log(listJugadoresSorted)
        //console.log(parseInt(jornada) + parseInt(sumar1))
        setTimeout(async () => {
            const embed = new Discord.EmbedBuilder()
            .setColor("#fca2ad")
            .setTitle("MVPs de "+interaction.options.getString("posicion"))
            //.setDescription("**Jornada "+jornada+"**")
            .addFields(
                {
                    "name": listJugadoresSorted[0][1],
                    "value": "MVPs: "+listJugadoresSorted[0][0],
                    inline: true
                },
                {
                    "name": listJugadoresSorted[1][1],
                    "value": "MVPs: "+listJugadoresSorted[1][0],
                    inline: true
                },
                {
                    "name": listJugadoresSorted[2][1],
                    "value": "MVPs: "+listJugadoresSorted[2][0],
                    inline: true
                },
                {
                    "name": listJugadoresSorted[3][1],
                    "value": "MVPs: "+listJugadoresSorted[3][0],
                    inline: true
                },
                {
                    "name": listJugadoresSorted[4][1],
                    "value": "MVPs: "+listJugadoresSorted[4][0],
                    inline: true
                },
                {
                    "name": listJugadoresSorted[5][1],
                    "value": "MVPs: "+listJugadoresSorted[5][0],
                    inline: true
                }
                )
                .setFooter({text: "Kemuri League"})
            //
            const fail = new Discord.EmbedBuilder()
            .setColor("#fca2ad")
            .setTitle("No hay suficientes datos")
            .setDescription("Error: No se ha jugado la jornada")
            .setFooter({text: "Kemuri League"})
            
            //console.log(Object.keys(dataGotten).length)
            //console.log(dataGotten)
            const divisionn = interaction.options.getString("division")
            
            //console.log(divisionn)
            if(toplane == "nadie" && jungle == "nadie" && mid == "nadie" && adc == "nadie" && supp == "nadie"){
                interaction.reply({embeds: [fail], components: []})
            }else{
                interaction.reply({embeds: [embed], components: []})
            }
        }, 1000);
        
    }
}