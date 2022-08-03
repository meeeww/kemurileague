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
    .setName("equipo")
    .setDescription("Información de un equipo")
    .addStringOption(option =>
		option.setName('team')
			.setDescription('Nombre del equipo')
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
            range: "Equipos",
        })
        dataGotten2 = getRows.data
        var listaEquipos = []
        for(var i = 0; i < dataGotten2["values"][1][14]; i++){
            listaEquipos.push([
                dataGotten2["values"][i + 1][0], //nombre 0
                dataGotten2["values"][i + 1][1], //tag 1
                dataGotten2["values"][i + 1][2], //division 2
                dataGotten2["values"][i + 1][3], //grupo 3
                dataGotten2["values"][i + 1][4], //hastag 4
                dataGotten2["values"][i + 1][5], //twitter 5
                dataGotten2["values"][i + 1][6], //twitch 6
                dataGotten2["values"][i + 1][7], //instagram 7
                dataGotten2["values"][i + 1][8], //youtube 8
                dataGotten2["values"][i + 1][9], //tiktok 9
                dataGotten2["values"][i + 1][10], //web 10
                dataGotten2["values"][i + 1][11], //logo 11
                dataGotten2["values"][i + 1][12], //color 12

            ])
        }
        var equipo1
        var equipo2
        for(var i = 0; i < listaEquipos.length; i++){//no se por que no pilla eso
            // Last i elements are already in place
            var equipo1 = listaEquipos[i][0]
            var equipo2 = interaction.options.getString("team")
            if(equipo1 == equipo2){
                
                var general = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+equipo1)
                .addFields(
                    {
                        "name": "🛂 | General\n",
                        "value": "**\nNombre: **"+listaEquipos[i][0]+"\n"+
                        "**Tag: **"+listaEquipos[i][1]+"\n"+
                        "**División: **"+listaEquipos[i][2]+"\n"+
                        "**Grupo: **"+listaEquipos[i][3]+"\n"+
                        "**Hashtag: **"+listaEquipos[i][4]+"\n"+
                        "**Logo: **"+listaEquipos[i][11]+"\n"+
                        "**Color: **"+listaEquipos[i][12]+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})
                var redes = new Discord.EmbedBuilder().setColor("#fca2ad").setTitle("Información de "+equipo1)
                .addFields(
                    {
                        "name": "📲 | Redes\n",
                        "value": "**\Twitter: **"+listaEquipos[i][5]+"\n"+
                        "**Twitch: **"+listaEquipos[i][6]+"\n"+
                        "**Instagram: **"+listaEquipos[i][7]+"\n"+
                        "**YouTube: **"+listaEquipos[i][8]+"\n"+
                        "**TikTok: **"+listaEquipos[i][9]+"\n"+
                        "**Web: **"+listaEquipos[i][10]+"\n"
                        ,
                        //inline: true
                    }
                    )
                .setFooter({text: "Kemuri League"})

                var embeds2 = [general, redes]

                
                break
            }else if(equipo1 != equipo2){
                var embedfail = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("No hay suficientes datos")
                .setDescription("Error: No se ha encontrado el equipo\n¡Recuerda escribir el nombre exacto!")
                .setFooter({text: "Kemuri League"})
                var embeds2 = [embedfail]
                
            }else{
                var embederror = new Discord.EmbedBuilder()
                .setColor("#fca2ad")
                .setTitle("Error")
                .setDescription("Consulta a un administrador")
                .setFooter({text: "Kemuri League"})
                var embeds2 = [embederror]
                
            }
          // Print the sorted array
        }
        console.log(embeds2)
        
        //console.log(parseInt(jornada) + parseInt(sumar1))
            
            //
            
            await pagination({
                embeds: embeds2, // Array of embeds objects
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