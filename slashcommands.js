const fs = require("fs")//node slashcommands.js
const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { clientId, guild } = require("./config.json")
const commands = []
const slashcommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith("js"))

for(const file of slashcommandsFiles){
    const slash = require("./slashcmd/"+file)
    commands.push(slash.data.toJSON())
}

const rest = new REST({ version: "9"}).setToken("OTk4ODg5NDMwNDQ0MTU0OTEw.GAelaS.zRW4ML6SSkxO44mcMCTXB1hmIHOwfSJPscsS1E")

createSlash()

async function createSlash(){
    console.log(commands)
    try{
        await rest.put(
            Routes.applicationCommands(clientId, guild), {
                body: commands
            }
        )
    } catch(e){
        console.error(e)
    }
}