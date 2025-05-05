const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Envoie une suggestion.')
        .addStringOption(option => option.setName('suggestion').setDescription('Ta suggestion').setRequired(true)),
    async execute(interaction, config) {
        const suggestion = interaction.options.getString('suggestion');

        db.push('suggestions', suggestion);

        const ownersList = config.owner.map(ownerId => {
            const owner = interaction.guild.members.cache.get(ownerId);
            return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
          });

        const suggestionEmbed = new Discord.EmbedBuilder()
            .setTitle(`\`🕷️\`〃Suggestion envoyé par ${interaction.user.tag}`)
            .setDescription(`\`\`\`${suggestion}\`\`\``)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            
            const suggestionChannel = interaction.guild.channels.cache.get(config.suggestionlogs);

            if (suggestionChannel) {
                suggestionChannel.send({ embeds: [suggestionEmbed] });
                
                const embed = new Discord.EmbedBuilder()
                .setTitle("\`✅\`Suggestion envoyée")
                .setDescription(`> *Ta suggestion a été envoyée avec succès.*`)
                .setColor(config.color || "#FF0000")
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`> *Le salon de suggestion n'a pas été trouvé. Veuillez contacter un créateur ci dessous.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*Aucun créateur configuré*"}`)
                .setColor(config.color || "#FF0000");
            await interaction.reply({ embeds: [embed], ephemeral: true });        
            }
    },
};