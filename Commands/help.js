const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche les commandes du bot.'),
    execute(interaction, config) {

        const embed = new Discord.EmbedBuilder()
        .setTitle('\`🕷️\`〃Help')
        .setDescription(`\`/help\`\n*-Affiche les commandes du bot*\n\`/profile\`\n*-Affiche le profile d'un membre*\n\`/payment\`\n*-Affiche les options de paiements*\n\`/invite\`\n*-Créé une invitation de serveur*\n\`/vouch\`\n*-Donne un avis sur le service*\n\`/suggest\`\n*-Envoie une suggestion*\n\`/verify\`\n*-Vérifie vous même*\n\`/setup-verify\`\n*-Setup la vérification*\n\`/setup-suggestion\`\n*-Setup le système de suggestion*\n\`/setup-vouch\`\n*-Setup le système d'avis*\n\`/setup-customer\`\n*-Setup le système d'acheteurs*\n\`/renew\`\n*-Recréé un salon*\n\`/customer\`\n*-Donne le rôle acheteurs*\n\`/mass-role\`\n*-Ajoute/retire un rôle à tous les membres*`)
        .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp()
        .setColor(config.color);
        interaction.reply({ embeds: [embed]});
    },
};