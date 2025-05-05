const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Véifie toi.'),
    async execute(interaction, config) {
        const verificationChannelId = db.get('verificationChannel');
        const verificationRoleId = db.get('verificationRole');

        if (!verificationChannelId || !verificationRoleId) {
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('\`🕷️\`〃Vérification déactivée')
                    .setDescription('> *La vérification n\'a pas été activée dans ce serveur.*')
                    .setColor(config.color || "#FF0000")
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
        }

        if (interaction.channelId !== verificationChannelId) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*utilise la commande \`/verify\` dans le salon <#${verificationChannelId}>.*`)
            .setColor(config.color || "#FF0000")
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(verificationRoleId);

        if (!role) {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Le rôle n\'existe pas')
            .setDescription('> *Le rôle de vérification n\'existe pas dans ce serveur.*')
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        if (member.roles.cache.has(verificationRoleId)) {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Déjà vérifié')
            .setDescription('> *Vous êtes déjà vérifiés.*')
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        await member.roles.add(role);

        const dmEmbed = new Discord.EmbedBuilder()
        .setTitle('\`✅\`〃Vérification passée')
        .setDescription('> *Vous avez été vérifié avec succès.*')
        .setColor(config.color || "#FF0000")
        .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp();

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`✅\`〃Vérificattion passée')
            .setDescription('> *Vous avez été vérifié avec succès.*')
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: true });
            return interaction.user.send({ embeds: [dmEmbed] });
        } catch (e) {
            console.error(`Impossible de DM ${interaction.user.tag} :`, e);
        }
    },
};
