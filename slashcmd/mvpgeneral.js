const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mvpsgeneral")
    .setDescription("Tabla de MVPs de todos los tiempos"),
    

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
            for(var j = 0; j < ( listaJugadores.length - i -1 ); j++){
               
              // Checking if the item at present iteration
              // is greater than the next iteration
              if(listaJugadores[j][0] < listaJugadores[j+1][0]){
                 
                // If the condition is true then swap them
                var temp = listaJugadores[j][0]
                listaJugadores[j][0] = listaJugadores[j + 1][0]
                listaJugadores[j+1][0] = temp

                var temp2 = listaJugadores[j][1]
                listaJugadores[j][1] = listaJugadores[j + 1][1]
                listaJugadores[j+1][1] = temp2
              }
            }
          // Print the sorted array
        }

        
        console.log(listaJugadores);
        console.log(listaJugadores[0][1])
        //console.log(parseInt(jornada) + parseInt(sumar1))
            const embed = new Discord.EmbedBuilder()
            .setColor("#fca2ad")
            .setTitle("Top 5 mayores MVPs de la Kemuri League")
            //.setDescription("De toda la comp")
            .addFields(
                {
                    "name": "🥇 ["+listaJugadores[0][7]+"] "+listaJugadores[0][1] + " | "+listaJugadores[0][2]+
                    "\n"+listaJugadores[0][4]+" División, Grupo "+listaJugadores[0][5],

                    "value": "MVPs de "+listaJugadores[0][6]+": "+listaJugadores[0][0],
                    //inline: true
                },
                {
                    "name": "🥇 ["+listaJugadores[1][7]+"] "+listaJugadores[1][1] + " | "+listaJugadores[1][2]+
                    "\n"+listaJugadores[1][4]+" División, Grupo "+listaJugadores[1][5],

                    "value": "MVPs de "+listaJugadores[1][6]+": "+listaJugadores[1][0],
                    //inline: true
                },
                {
                    "name": "🥇 ["+listaJugadores[2][7]+"] "+listaJugadores[2][1] + " | "+listaJugadores[2][2]+
                    "\n"+listaJugadores[2][4]+" División, Grupo "+listaJugadores[2][5],

                    "value": "MVPs de "+listaJugadores[2][6]+": "+listaJugadores[2][0],
                    //inline: true
                },
                {
                    "name": "🥇 ["+listaJugadores[3][7]+"] "+listaJugadores[3][1] + " | "+listaJugadores[3][2]+
                    "\n"+listaJugadores[3][4]+" División, Grupo "+listaJugadores[3][5],

                    "value": "MVPs de "+listaJugadores[3][6]+": "+listaJugadores[3][0],
                    //inline: true
                },
                {
                    "name": "🥇 ["+listaJugadores[4][7]+"] "+listaJugadores[4][1] + " | "+listaJugadores[4][2]+
                    "\n"+listaJugadores[4][4]+" División, Grupo "+listaJugadores[4][5],

                    "value": "MVPs de "+listaJugadores[4][6]+": "+listaJugadores[4][0],
                    //inline: true
                }
                )
            .setFooter({text: "Kemuri League"})
            //
            
            
            //console.log(divisionn)
            
        interaction.reply({embeds: [embed], components: []})
        
    }
}