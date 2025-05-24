const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('Affiche les options de paiements.'),
    async execute(interaction, config) {
    // Validation de la couleur hex
    const isHex = /^#[0-9A-Fa-f]{6}$/.test(config.color);
    const embedColor = isHex ? config.color : "#FF0000";

        const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Options de paiements')
            .setDescription('> *PayPal :* [Lien Paypal](https://paypal.me/EthanWolker?country.x=FR&locale.x=fr_FR) ***__Payement uniquement en proche et sans note.__***\n> *Ltc :* \`LSJopwAwFDxZRxb19xWdcvCk8rL5EcDcmj`')
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};