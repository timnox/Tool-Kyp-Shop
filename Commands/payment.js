const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('Affiche les options de paiements.'),
    async execute(interaction, config) {

        const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Options de paiements')
            .setDescription('> *PayPal :* [Lien Paypal](https://discord.gg/ffgdqP9KTc)\n> *Ltc :* \`ltc1q9w6zc4xskjrteezaxda044e7chws0dm4gxhlad\`')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};