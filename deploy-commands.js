const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();

const { DISCORD_TOKEN, clientId, guildId } = process.env;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

//カラーコードをいちいち打つのめんどいので宣言
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var reset = '\u001b[0m';

// and deploy your commands!
(async () => {
	try {

		console.log(`${yellow}${timeget()} <INFORMATION> ${commands.length} つのコマンドを読み込み中です...${reset}`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(`${green}${timeget()} <INFORMATION> 成功:${data.length} つのコマンドファイルが正常に読み込まれました! ${reset}`);
	
	} catch (error) {
		
		// And of course, make sure you catch and log any errors!
		console.error(`${red}${timeget()} <ERROR> 失敗:${error} ${reset}`);
	
	};

})();
function timeget() {
	//現在時刻取得
	let date = new Date
	return nowtime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}]`
}

//ALL DELETED COMMAND
// for guild-based commands
/*
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
	*/