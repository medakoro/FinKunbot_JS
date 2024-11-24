const { SlashCommandBuilder ,EmbedBuilder,Colors} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    //コマンド名前
		.setName('timeout')
        //コマンドの説明
		.setDescription('指定した人物を一定期間発言禁止にします')
        .addUserOption((option) => option
                .setName('target')
                .setDescription('💥TOを送信する人')
                .setRequired(true),
            )
        .addStringOption((option) => option
            .setName('reason')
            .setDescription('💬TOにする理由')
            .setRequired(true),
        )
        .addNumberOption((option) => option
            .setName('time')
            .setDescription('🕐TOする時間[単位:min]')
            .setRequired(true),
        ),
        

	async execute(interaction) {
        try {
		//変数に代入
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason");
        let time = interaction.options.getNumber("time");
        let target_id = await interaction.guild.members.fetch(target.id);
        //四捨五入
        time = Math.round(time)

        let time_hour = 0;
        time_min = time;
        //1分以下は設定不可
        if (time < 1) { 
            await interaction.reply({ content: `✖エラー!: 1分以下のTOは設定できません`});
            return;
        } else if (time > 59) {
            time_hour = Math.trunc(time / 60)
            time_min = time % 60
        }
                //DMにWARN通知
                await target.send({
                    content: "あなたはタイムアウトを受けました。理由は以下の通りです。",
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `モデレーター: ${interaction.user.globalName}` })
                            .setTitle('TYPE: :warning:Time Out!')
                            .setFields([
                                { name: '理由:', value: reason, inline: false },
                                { name: 'タイムアウトの効果時間', value: `${time_hour} 時間 ${time_min} 分`, inline: false },
                                { name: '異議申し立てについて:', value: "ルールを熟読したのち、なぜ異議申し立てをするのかをhttps://discord.com/channels/1288043163059097600/1288043164288155670 に送信願います", inline: false }
                            ])
                            .setColor(Colors.Red)
                    ]
                })
                //タイムアウト処理(*60000は1分に修正用)
                target_id.timeout(time * 60000, reason);
                await interaction.reply({ content: `正常にタイムアウトがされました`});
            //エラー処理
        } catch (error) {
            await interaction.reply({ content: `✖エラー!:${error}`});
            return;
        }
    }
}