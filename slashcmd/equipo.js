const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("equipo")
    .setDescription("Información del jugador")
    .addStringOption(option =>
		option.setName('player')
			.setDescription('Nombre del jugador')
			.setRequired(true))
    ,
    

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
            listaJugadores.push([
                dataGotten2["values"][i + 1][4], //mpvs general 0
                dataGotten2["values"][i + 1][0], //nombre 1 /
                dataGotten2["values"][i + 1][1], //equipo 2
                dataGotten2["values"][i + 1][3], //mvps por rol 3
                dataGotten2["values"][i + 1][5], //division 4
                dataGotten2["values"][i + 1][6], //grupo 5
                dataGotten2["values"][i + 1][7], //posicion 6 /
                dataGotten2["values"][i + 1][8], //tag 7 /
            ])
        }

        for(var i = 0; i < listaJugadores.length; i++){
            // Last i elements are already in place 
            if(listaJugadores[i][1] == interaction.options.getString("player")){
                const embed = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("Top 5 MVPs de "+interaction.options.getString("posicion"))
                //.setDescription("De toda la comp")
                .addFields(
                    {
                        "name": "asd",
                        "value": "asd",
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
            }else{
                const embed = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("No hay suficientes datos")
                .setDescription("Error: No se ha jugado la jornada")
                .setFooter({text: "Kemuri League"})
            }
          // Print the sorted array
        }

        
        console.log(listaJugadores);
        console.log(listaJugadores[0][1])
        //console.log(parseInt(jornada) + parseInt(sumar1))
            
            //
            
            
            //console.log(divisionn)
            
        interaction.reply({embeds: [embed], components: []})
        
    }
}