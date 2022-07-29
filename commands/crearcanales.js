const Discord = require("discord.js");
const { PermissionsBitField } = require('discord.js');
const express = require("express");
const { google } = require("googleapis");
const app = express();
const { ChannelType } = require("discord.js");

module.exports = {
    name: "crearcanales",
    alias: ["pooong"],

    async execute(client, message, args){
        if (message.member.roles.cache.some(role => role.name === 'Administrador')) {
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
                range: "Equipos",
            })
            dataGotten = getRows.data
            console.log(dataGotten["values"][0][6])
            for(var i = 0; i < dataGotten["values"][0][6]; i++){//numero 2 para crear canales
                message.guild.channels.create({
                    name: "🔱┃"+(dataGotten["values"][0][7+i]),
                    type: 4,
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: "998940088857796700",
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }
                    ],
                });
            }
            const categorias = []
            setTimeout(function(){
                
                for(var i= 0; i < 3; i++){
                    message.guild.channels.cache.forEach(ch => {
                        if(ch.type == ChannelType.GuildCategory){
                            if(ch.name == "🔱┃"+(dataGotten["values"][0][7+i])){
                                categorias.push([ch.id, ch.name])
                            }
                        }
                    })
                }
                console.log(categorias[i][0])
                //crearaqui
            },5000);
            //crearcion de canales
            
            var roleId = []
            var buenosRoles = []
            setTimeout(function(){
                message.guild.roles.cache.find(role => { //tengo que quitar toda la function de .find, arrgarlo
                    roleId.push([role.id, role.name])
                });
                //console.log(roleId)
                for(var i = 0; i < dataGotten["values"][1][6]; i++){
                    for(var j = 0; j < roleId.length; j++){
                        //console.log(j)
                        if(dataGotten["values"][i+1][0] == roleId[j][1]){
                            //console.log(dataGotten["values"][i+1][0]+" = "+roleId[j][1])
                            buenosRoles.push([roleId[j][0], roleId[j][1], "🔱┃"+dataGotten["values"][i+1][1]+" División"]) //roleid, rolename, roledivision
                        }
                    }
                }
                //console.log(roleId[0][1])//segunda (1) = derecha name | (0) = izquierda id
                //console.log(roleId.length)
                console.log(buenosRoles)
            }, 7000);
            
            var buenasCategorias = []
            setTimeout(function(){//me falta cambiar permisos, ya se reciben los roles e ID creados de los equipos c:
                //for(var i = 0; i < buenosRoles.length; i++){
                    message.guild.channels.cache.find(channel => {
                        //console.log(channel)
                        if(channel.name == "🔱┃Primera División" || channel.name == "🔱┃Segunda División" || channel.name == "🔱┃Tercera División"){
                            buenasCategorias.push(channel.name)

                            for(var i = 0; i < buenosRoles.length; i++){
                                //console.log("aka")
                                //console.log(buenosRoles[i][2] + " = " + channel.name)
                                if(buenosRoles[i][2] == channel.name){
                                    //console.log(buenosRoles[i][2] + " = " +channel.name)
                                    channel.permissionOverwrites.create(buenosRoles[i][0],
                                        {
                                            ViewChannel: true
                                        })
                                }
                            }
                        }
                    })
                //}
                //console.log(buenasCategorias)
            }, 8000);
            
            //if(message.member.roles.cache.find(r => r.id === "Champion Selector") - conseguir roles de equipos

        }
        
        

    }
}

