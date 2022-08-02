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

        for(var i = 0; i < listaJugadores.length; i++){
            // Last i elements are already in place 
            for(var j = 0; j < ( listaJugadores.length - i -1 ); j++){
               
              // Checking if the item at present iteration
              // is greater than the next iteration
              if(listaJugadores[j][0] > listaJugadores[j+1][0]){
                 
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
        setTimeout(async () => {
            const embed = new Discord.EmbedBuilder()
            .setColor("#fca2ad")
            .setTitle("MVPs de "+interaction.options.getString("posicion"))
            .setDescription("De toda la comp")
            
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
            interaction.reply({embeds: [embed], components: []})
        }, 3000);
        
    }
}