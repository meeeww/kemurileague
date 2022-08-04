const express = require("express");
const { google } = require("googleapis");
const app = express();
const Discord = require("discord.js");
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



client.login("OTk4ODg5NDMwNDQ0MTU0OTEw.GJaFPa.i0llFD1QhS8iLt0dwk3C8RHJHCn6fiTnAHK_gY");

//app.listen(1338, (req, res) => console.log("running on 1337"));