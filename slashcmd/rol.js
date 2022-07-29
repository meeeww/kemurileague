const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Utils } = require("discord.js")
const Discord = require("discord.js")
const express = require("express");
const { google } = require("googleapis");
const app = express();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rol")
    .setDescription("Recibir el rol de tu equipo")
    .addStringOption(option => option.setName("invocador").setDescription("Poner exactamente con mayúsculas y minúsculas").setRequired(true))
    .addStringOption(option => option.setName("equipo").setDescription("Poner exactamente con mayúsculas y minúsculas").setRequired(true)),
    

    async run(client, interaction, dataGotten){
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        //Crear cliente
    
        //Crear google sheets api
        const googleSheets = google.sheets({version: "v4", auth: client});
    
        const spreadsheetId = "1pk8Bp4f6Jni27RipbB-UNBSTuAW4gNKD4DD3rvxrf9E"
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
        
        //
        jugadores = getRows.data
        //console.log(Object.keys(dataGotten).length)
        //console.log(dataGotten)
        const invocador = interaction.options.getString("invocador")
        const equipo = interaction.options.getString("equipo")

        for(var i = 0; i < Object.keys(jugadores).length; i++){
            if(jugadores["values"][i][0] === invocador && jugadores["values"][i][1] === equipo){
                var tag = jugadores["values"][i][6]
                var name = jugadores["values"][i][0]
                setTimeout(async() => {
                    await interaction.guild.members.edit(interaction.user, { roles: [] })
                    var role = interaction.guild.roles.cache.find(role => role.name === equipo);
                    await interaction.member.roles.add(role);
                    await interaction.member.setNickname(`[${tag}] ${name}`)
                }, 1000);
            }
            else
            {
                setTimeout(async () => {
                    //await message.editReply({ content: "Error 02: No estás en la base de datos. Contacta con un administrador para solucionar el fallo, "+ invocador, ephemeral: true})
                }, 1000);
            }
        }
    }
}