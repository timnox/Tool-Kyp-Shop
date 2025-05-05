const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-customer')
        .setDescription('Definie le rôle des acheteurs.')
        .addRoleOption(option => option.setName('role').setDescription('Le rôle des acheeeeteurs').setRequired(true)),
    async execute(interaction, config) {
        const customerRole = interaction.options.getRole('role');

        try {
          const embed = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Le rôle des acheteurs été defini')
          .setDescription(`> *Le rôle des acheteurs a bien été configuré sur ${customerRole} (\`${customerRole.id}\`)*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed], ephemeral: true });

          config.customer = customerRole.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Une erreur c'est produite.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};