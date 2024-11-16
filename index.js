/*
# delectory select
cd C:\Users\user\Desktop\DiscordBots\MedaTrainBot_JS-main

# command refresh
npm run deploy

# bot start
npm start

*/

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits,ActivityType } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: Object.values(GatewayIntentBits) });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

//カラーコードめんどいｎ(ry
var red = '\u001b[31m';
var yellow = '\u001b[33m';
var green = '\u001b[32m';
var magenta = '\u001b[35m';
var reset = '\u001b[0m';

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`${red} [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.${reset} `);
		}
	}
}



client.once(Events.ClientReady, readyClient => {
	console.log(`${green}${timeget()} <INFORMATION> ${readyClient.user.tag} が正常に起動しました! ${reset}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`${yellow}${timeget()} <ERROR> コマンドファイル ${interaction.commandName} が見つかりませんでした! ${reset}`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`${red}${timeget()} <ERROR> ${error}${reset}`);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'エラーが発生したようです!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'エラーが発生したようです!', ephemeral: true });
		}
	}
});

client.login();

process.on('uncaughtException', console.error);



//春のfunction祭り
function timeget() {
	//現在時刻取得
	let date = new Date
	return nowtime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}]`
}


