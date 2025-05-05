const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Setup le système de vérification.')
        .addChannelOption(option => option.setName('channel').setDescription('Le salon de vérification').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Le rôle à donner aprèsla vérification').setRequired(true)),
    async execute(interaction, config) {

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
try{
        const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Système de vérification')
            .setDescription(`> *Ce serveur vous demande de vous vérifier en écrivant \`/verify\` et avoir le rôle* ${role} (\`${role.id}\`).`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await channel.send({ embeds: [embed] })

          db.set('verificationChannel', channel.id);
          db.set('verificationRole', role.id);

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Une erreur c'est produite.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('\`✅\`〃Système de vérification en place')
            .setDescription(`> *Système de vérification configuré dans le salon ${channel} (\`${channel.id}\`) avec le rôle ${role} (\`${role.id}\`)*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};