const express = require("express");
const { google } = require("googleapis");
const app = express();
const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const client = new Discord.Client({
    intents: 65527
})
var dataGotten
const fs = require("fs");
//const client = new Client({ intents: 36659 });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of commandFiles){
    const command = require("./commands/"+file)

    client.commands.set(command.name, command)
}

client.slashcommands = new Discord.Collection();
const slashcommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"))

for(const file of slashcommandsFiles){
    const slash = require("./slashcmd/"+file)
    client.slashcommands.set(slash.data.name, slash)
}

client.on("interactionCreate", async(interaction) => {
    //if(!interaction.isContextMenuCommand()) return;

    const slashcmds = client.slashcommands.get(interaction.commandName)
    
    if(!slashcmds) return;

    try{
        await slashcmds.run(client, interaction)
    } catch(e) {
        console.error(e)
    }
})

client.once("ready", async() =>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    //Crear cliente
    const client =  auth.getClient();

    //Crear google sheets api
    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "1YkY4_6eDN6q2YqvlQxUgN5M9cDTOfnFPENHm01I4Lkw"
    //metadata
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    })

    //leer columnas
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Clasificación",
    })

    //
    dataGotten = getRows.data
})

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    //Crear cliente
    const client = await auth.getClient();

    //Crear google sheets api
    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "1YkY4_6eDN6q2YqvlQxUgN5M9cDTOfnFPENHm01I4Lkw"
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

    //
    dataGotten = getRows.data
    res.send(getRows.data)
});


client.on("messageCreate", async(message) => {
    let prefix = "-";
    if (!message.content.startsWith(prefix)) return;
    
    let usuario = message.mentions.members.first() || message.member;
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));
    if(cmd){
        cmd.execute(client, message, args, dataGotten)
    }
})

client.on('guildMemberAdd', member => {
    const normativaCanal = "998935845899866142"
    const noticiasCanal = "998936445718908978"
    const enlacesCanal = "998936678213369928"
    const rolesCanal = "1000515485068181634"
    const soporteCanal = "998933543512195162"
    const embed = new EmbedBuilder()
	.setColor("#fca2ad")
	.setTitle("¡Bienvenido <@"+member.id+"> a la Kemuri League!")
	.setDescription("Recuerda que puedes ver nuestra normativa en "+member.guild.channels.cache.get(normativaCanal)+", noticias en "+member.guild.channels.cache.get(noticiasCanal)+" y enlaces en "+member.guild.channels.cache.get(enlacesCanal)+"!\n\nSi ya estás registrado y quieres obtener los roles de tu equipo, ¡ve a "+member.guild.channels.cache.get(rolesCanal)+" y sigue las instrucciones!\n\nSi tienes alguna duda sobre la liga, funcionamiento, sanciones y demás, recuerda leer la normativa y no olvides que puedes resolver cualquier duda o problema en "+member.guild.channels.cache.get(soporteCanal)+"!")
	.setImage('https://drive.google.com/uc?export=view&id=1SRwDYq_yEco2h8-SOdQr09pFr7yfx131')
	.setFooter({text: "Kemuri League", iconURL: "https://drive.google.com/uc?export=view&id=1FmLfL1cKMXHw1a13-T1NrNV_OWc-mqwI"})

    member.guild.channels.get('998935555855372338').send("Welcome"); 
    member.roles.add("1005163648089600080")
});

client.on('guildMemberRemove', member => {
    const embed = new EmbedBuilder()
	.setColor("#fca2ad")
	.setTitle("¡Bienvenido <@"+member.id+"> a la Kemuri League!")
	.setDescription("Recue")
	.setFooter({text: "Kemuri League", iconURL: "https://drive.google.com/uc?export=view&id=1FmLfL1cKMXHw1a13-T1NrNV_OWc-mqwI"})

    member.guild.channels.get('998935555855372338').send("Welcome"); 
    member.roles.add("1005163648089600080")
});


client.login("OTk4ODg5NDMwNDQ0MTU0OTEw.GAelaS.zRW4ML6SSkxO44mcMCTXB1hmIHOwfSJPscsS1E");

//app.listen(1338, (req, res) => console.log("running on 1337"));