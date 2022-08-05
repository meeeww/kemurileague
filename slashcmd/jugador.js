const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { spreadsheetsEnfrentamientos } = require("../hojaspartidos/pu.json")
const { pagination, TypesButtons, StylesButton } = require('@devraelfreeze/discordjs-pagination');

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
            var KDA = ((parseInt(listaJugadores[i][12]) + parseInt(listaJugadores[i][14]))/parseInt(listaJugadores[i][13]))
            if(jugador1 == jugador2){
                
                var general = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                .addFields(
                    {
                        "name": "🛡️ | General\n",
                        "value": "**\nPartidos Jugados: **"+listaJugadores[i][8]+"\n"+
                        "**Victorias: **"+listaJugadores[i][9]+"\n"+
                        "**Derrotas: **"+listaJugadores[i][10]+"\n"+
                        "**Kills: **"+listaJugadores[i][12]+"\n"+
                        "**Muertes: **"+listaJugadores[i][13]+"\n"+
                        "**Asistencias: **"+listaJugadores[i][14]+"\n"+
                        "**Splits Jugados: **"+listaJugadores[i][35]+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var ataque = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                .addFields(
                    {
                        "name": "⚔️ | Ataque\n",
                        "value": "**\nKills: **"+listaJugadores[i][12]+"\n"+
                        "**Muertes: **"+listaJugadores[i][13]+"\n"+
                        "**Asistencias: **"+listaJugadores[i][14]+"\n"+
                        "**KDA: **"+Math.floor(KDA)+"\n"+
                        "**KP Promedio: **"+Math.floor(listaJugadores[i][15])+"\n"+
                        "**Daño/min: **"+Math.floor(listaJugadores[i][16])+"\n"+
                        "**Doublekills: **"+listaJugadores[i][17]+"\n"+
                        "**Triplekills: **"+listaJugadores[i][18]+"\n"+
                        "**Quadrakills: **"+listaJugadores[i][19]+"\n"+
                        "**Pentakills: **"+listaJugadores[i][20]+"\n"+
                        "**Solokills: **"+listaJugadores[i][21]+"\n"+
                        "**Firstblood: **"+listaJugadores[i][22]+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var objetivos = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                .addFields(
                    {
                        "name": "🎯 | Objetivos\n",
                        "value": "**\nObjetivos robados: **"+listaJugadores[i][23]+"\n"+
                        "**Torretas destruidas: **"+listaJugadores[i][24]+"\n"+
                        "**Inhibidores destruidos: **"+listaJugadores[i][25]+"\n"+
                        "**Primeras torres: **"+listaJugadores[i][29]+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var economia = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                .addFields(
                    {
                        "name": "💸 | Economía\n",
                        "value": "**\nOro/partida: **"+listaJugadores[i][26]+"\n"+
                        "**Oro/min: **"+Math.floor(listaJugadores[i][27])+"\n"+
                        "**Minions/min: **"+Math.floor(listaJugadores[i][28])+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var vision = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+jugador1)
                .addFields(
                    {
                        "name": "👀 | Visión\n",
                        "value": "**\nVisión/min: **"+Math.floor(listaJugadores[i][30])+"\n"+
                        "**Wards por partida: **"+Math.floor(listaJugadores[i][31])+"\n"+
                        "**Wards/min: **"+Math.floor(listaJugadores[i][32])+"\n"+
                        "**Pinks/minuto: **"+Math.floor(listaJugadores[i][33])+"\n"+
                        "**Wards destruidos/min: **"+Math.floor(listaJugadores[i][34])+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})

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
            
            await pagination({
                embeds: embeds, // Array of embeds objects
                ephemeral: true,
                author: interaction.member.user,
                interaction: interaction,
                time: 40000, // 40 seconds
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        value: TypesButtons.previous,
                        label: 'Anterior',
                        style: StylesButton.Primary
                    },
                    {
                        value: TypesButtons.next,
                        label: 'Siguiente',
                        style: StylesButton.Success
                    }
                ]
            });
            //console.log(divisionn)
        
        //interaction.reply({embeds: [embed], components: [], ephemeral: true})
        
    }
}