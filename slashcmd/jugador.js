const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")
const { pagination } = require("reconlx")
module.exports = {
    data: new SlashCommandBuilder()
    .setName("jugador")
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
        for(var i = 0; i < dataGotten2["values"][0][39]; i++){
            listaJugadores.push([
                dataGotten2["values"][i + 1][4], //mpvs general 0
                dataGotten2["values"][i + 1][0], //nombre 1 /
                dataGotten2["values"][i + 1][1], //equipo 2
                dataGotten2["values"][i + 1][3], //mvps por rol 3
                dataGotten2["values"][i + 1][5], //division 4
                dataGotten2["values"][i + 1][6], //grupo 5
                dataGotten2["values"][i + 1][7], //posicion 6 /
                dataGotten2["values"][i + 1][8], //tag 7 /
                ///
                dataGotten2["values"][i + 1][10], //partidos jugados 8
                dataGotten2["values"][i + 1][11], //victorias 9
                dataGotten2["values"][i + 1][12], //derrotas 10
                dataGotten2["values"][i + 1][13], //horas jugadas 11
                dataGotten2["values"][i + 1][14], //kills 12
                dataGotten2["values"][i + 1][15], //muertes 13
                dataGotten2["values"][i + 1][16], //asistencias 14
                dataGotten2["values"][i + 1][17], //kp 15
                dataGotten2["values"][i + 1][18], //daño/min 16
                dataGotten2["values"][i + 1][19], //double kills 17
                dataGotten2["values"][i + 1][20], //triple kills 18
                dataGotten2["values"][i + 1][21], //quadra kills 19
                dataGotten2["values"][i + 1][22], //penta kills 20
                dataGotten2["values"][i + 1][23], //solokills 21
                dataGotten2["values"][i + 1][24], //first blood 22
                dataGotten2["values"][i + 1][25], //Objetivos robados 23
                dataGotten2["values"][i + 1][26], //Torretas destruidas 24
                dataGotten2["values"][i + 1][27], //Inhibidores destruidos 25
                dataGotten2["values"][i + 1][28], //Oro/partida 26
                dataGotten2["values"][i + 1][29], //Oro/min 27
                dataGotten2["values"][i + 1][30], //Minions/min 28
                dataGotten2["values"][i + 1][31], //Primera torre 29
                dataGotten2["values"][i + 1][32], //Visión/min 30
                dataGotten2["values"][i + 1][33], //Wars por partida 31
                dataGotten2["values"][i + 1][34], //Wards/min 32
                dataGotten2["values"][i + 1][35], //Pinks/minuto 33
                dataGotten2["values"][i + 1][36], //Wards destruidos/min 34
                dataGotten2["values"][i + 1][37], //splits 35
            ])
        }
        var jugador1
        var jugador2
        for(var i = 0; i < listaJugadores.length; i++){//no se por que no pilla eso
            // Last i elements are already in place
            var jugador1 = listaJugadores[i][1]
            var jugador2 = interaction.options.getString("player")
            
            if(jugador1 == jugador2){
                
                var general = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                //.setDescription("De toda la comp")
                .addFields(
                    {
                        "name": "asd",
                        "value": "asd",
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var ataque = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                var objetivos = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                var economia = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                var vision = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)

                var embeds = [general, ataque, objetivos, economia, vision]

                
                break
            }else if(jugador1 != jugador2){
                var embed = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("No hay suficientes datos")
                .setDescription("Error: No se ha encontrado el jugador\n¡Recuerda escribir el nombre de invocador exacto!")
                .setFooter({text: "Kemuri League"})
                var embeds = [embed]
            }else{
                var embed = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("Error")
                .setDescription("Consulta a un administrador")
                .setFooter({text: "Kemuri League"})
                var embeds = [embed]
            }
          // Print the sorted array
        }

        
        //console.log(parseInt(jornada) + parseInt(sumar1))
            
            //
            
            
            //console.log(divisionn)
            pagination({
                author: interaction.member.user,
                embeds: embeds,
                channel: interaction.channel,
                time: 10000
            })
        interaction.reply({embeds: [embed], components: [], ephemeral: true})
        
    }
}