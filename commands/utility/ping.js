const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    //コマンド名前
		.setName('ping')
        //コマンドの説明
		.setDescription('Replies with Pong!')
        .addSubcommand((subcommand) =>
        subcommand
            .setName("test")
            .setDescription("おはよう")
        ),

	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};