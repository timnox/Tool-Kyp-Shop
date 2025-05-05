const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-vouch')
        .setDescription('Défnie le salon des vouchs.')
        .addChannelOption(option => option.setName('channel').setDescription('Le salon où les vouchs seront envoyés').setRequired(true)),
    async execute(interaction, config) {
        const vouchChannel = interaction.options.getChannel('channel');

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Système de vouchs')
            .setDescription(`> *Les vouchs seront envoyés dans ce salon.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await vouchChannel.send({ embeds: [embed] })

          const embed2 = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Vouch system successfully')
          .setDescription(`> *Les vouchs seront envoyés dans le salon ${vouchChannel} (\`${vouchChannel.id}\`)*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });
          
          config.vouchlogs = vouchChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Une erreur c'est produite.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};