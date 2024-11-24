const { SlashCommandBuilder ,EmbedBuilder,Colors} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
    //コマンド名前
		.setName('warn')
        //コマンドの説明
		.setDescription('指定した人物に警告を送信します')
        .addUserOption((option) => option
                .setName('target')
                .setDescription('💥WARNを送信する人')
                .setRequired(true),
            )
        .addStringOption((option) => option
            .setName('reason')
            .setDescription('💬WARNを送信する理由')
            .setRequired(true),
        ),

	async execute(interaction) {
		//変数に代入
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason");
        const target_id = target.id

        // ファイルのパスを設定
        const filePath = path.join('points', 'data.json');
        try {
            // ファイルが存在するかチェック
            if (!fs.existsSync(filePath)) {

              // 初期データを設定
            const initialData = {
                points: {
                    "medakoro0321":0
                }
            };
            
              // ファイルを作成し、初期データを書き込む
            fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
            console.log('JSONファイルが削除されているもしくは見つからなかったため新しくJSONファイルを作成しました');
            //jsonファイルがあるなら
            } else {
                //ファイル読み込み
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                //もし見つからないなら
                if (!data.points[target_id]) {
                    //データを変更
                    data.points[target_id] = 1;
                    //ファイル保存
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                } else {
                    //あるなら加点
                    data.points[target_id] += 1;
                    //ファイル保存
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                }
                //DMにWARN通知
                await target.send({
                    content: "あなたは警告を受けました。理由は以下の通りです。",
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `モデレーター: ${interaction.user.globalName}` })
                            .setTitle('TYPE: :warning:WARNING!')
                            .setFields([
                                { name: '理由:', value: reason, inline: false },
                                { name: '現在の違反ポイント:', value: `${data.points[target_id]} 点`, inline: false },
                                { name: '異議申し立てについて:', value: "ルールを熟読したのち、なぜ異議申し立てをするのかをhttps://discord.com/channels/1288043163059097600/1288043164288155670 に送信願います", inline: false }
                            ])
                            .setColor(Colors.Red)
                    ]
                });
                await interaction.reply({ content: `正常にWARNが送信されました`});
            }
            //エラー処理
        } catch (error) {
            await interaction.reply({ content: `✖エラー!:${error}`});
            return;
        }
	},
};

