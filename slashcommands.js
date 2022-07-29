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

const rest = new REST({ version: "9"}).setToken("OTk4ODg5NDMwNDQ0MTU0OTEw.GJaFPa.i0llFD1QhS8iLt0dwk3C8RHJHCn6fiTnAHK_gY")

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