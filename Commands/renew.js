const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('renew')
        .setDescription('Recréé un salon.')
        .addChannelOption(option => option.setName('channel').setDescription('Salon à recréé').setRequired(false)),
    async execute(interaction, config) {
        let channelToRenew = interaction.options.getChannel('channel');

        if (!channelToRenew) {
            channelToRenew = interaction.channel;
        }

        try {
            const position = channelToRenew.position;
            const channelData = {
                name: channelToRenew.name,
                type: channelToRenew.type,
                topic: channelToRenew.topic,
                nsfw: channelToRenew.nsfw,
                rateLimitPerUser: channelToRenew.rateLimitPerUser,
                parent: channelToRenew.parentId,
                permissionOverwrites: channelToRenew.permissionOverwrites.cache.map(overwrite => ({
                    id: overwrite.id,
                    type: overwrite.type,
                    allow: overwrite.allow.toArray(),
                    deny: overwrite.deny.toArray()
                }))
            };

            const newChannel = await channelToRenew.clone();
            await channelToRenew.delete();
            await newChannel.edit(channelData);
            await newChannel.setPosition(position);

            const embed2 = new Discord.EmbedBuilder()
                .setDescription(`\`✅\`〃*Recréé par* **\`${interaction.user.tag} | ${interaction.user.id}\`** ${newChannel}`)
                .setColor(config.color);
            await newChannel.send({ embeds: [embed2] });
            return;
        } catch (e) {
            console
            const embed = new Discord.EmbedBuilder()
                .setDescription('\`❌\`〃*Une erreur c\'est produite.*')
                .setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
    },
};