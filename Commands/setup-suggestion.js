const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-suggestion')
        .setDescription('Défini le salon des suggestions.')
        .addChannelOption(option =>
            option.setName('channel').setDescription('Le salon des suggestions.').setRequired(true)),
    async execute(interaction, config) {
    // Validation de la couleur hex
    const isHex = /^#[0-9A-Fa-f]{6}$/.test(config.color);
    const embedColor = isHex ? config.color : "#FF0000";
        const suggestionChannel = interaction.options.getChannel('channel');

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`👀\`〃Système de suggestion')
            .setDescription(`> *Le système de suggestions sera dans ce salon.*`)
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await suggestionChannel.send({ embeds: [embed] })

          const embed2 = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Système de suggestions')
          .setDescription(`> *Le système de suggestions sera dans le salon ${suggestionChannel} (\`${suggestionChannel.id}\`)*`)
          .setColor(config.color || "#FF0000")
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });

          config.suggestionlogs = suggestionChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
          
        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Une erreur c'est produite.*`)
            .setColor(config.color || "#FF0000")
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};