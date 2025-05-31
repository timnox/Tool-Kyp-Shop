const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Envoie ton avis sur un service.')
        .addUserOption(option => option.setName('member').setDescription('Le membre concerné').setRequired(true))
        .addStringOption(option => option.setName('service').setDescription('Le service concerné').setRequired(true))
        .addIntegerOption(option => option.setName('note').setDescription('L\'avis entre 1 et 5').setRequired(true))
        .addStringOption(option => option.setName('reviews').setDescription('Ton avis').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false)),
    async execute(interaction, config) {
    // Validation de la couleur hex
    const isHex = /^#[0-9A-Fa-f]{6}$/.test(config.color);
    const embedColor = isHex ? config.color : "#FF0000";
        const member = interaction.options.getUser('member');
        const service = interaction.options.getString('service');
        const note = interaction.options.getInteger('note');
        const reviews = interaction.options.getString('reviews');
        const image = interaction.options.getString('image');

        if (note < 1 || note > 5) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*L'avis doit être entre 1 et 5.*`)
            .setColor(config.color || "#FF0000");
            interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if (interaction.user.id === member.id) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*Tu ne peux pas te vouch toi même.*`)
                .setColor(config.color || "#FF0000");
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (member.bot){
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Tu ne peux pas vouch un bot.*`)
            .setColor(config.color || "#FF0000");
            interaction.reply({ embeds: [embed], ephemeral: true});
            return;
        }

        const vouchData = {
            member: member.id,
            service,
            note,
            reviews,
            image,
            reviewer: interaction.user.id
        };

        db.push('vouches', vouchData);

        const ownersList = config.owner.map(ownerId => {
            const owner = interaction.guild.members.cache.get(ownerId);
            return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
          });

          const membre = interaction.guild.members.cache.get(member.id);
          
          const vouchEmbed = new Discord.EmbedBuilder()
              .setTitle(`\`💰\`〃Note envoyé par ${interaction.user.tag} à ${membre.user.tag}`)
              .setThumbnail(membre.user.displayAvatarURL({ dynamic: true, size: 1024 }))
              .setColor(config.color || "#FF0000")
              .setDescription(`> *Membre :* ${membre.toString()} (\`${membre.id}\`)\n> *Service :* \`${service}\`\n> *Avis :* \`${reviews}\`\n> *Note :* \`${'⭐'.repeat(note)}\``)
              .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
              .setTimestamp();
               

        if (image) {
            vouchEmbed.setImage(image);
        }

        const vouchChannel = interaction.guild.channels.cache.get(config.vouchlogs);
        if (vouchChannel) {
            vouchChannel.send({ embeds: [vouchEmbed] });
            const embed = new Discord.EmbedBuilder()
            .setTitle("\`✅\`〃Noté avec succès")
            .setDescription(`> *Votre avis a été envoyé.*`)
            .setColor(config.color || "#FF0000")
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`> *Le salon des vouchs n'a pas été trouvé. Veuillez contacter un créateur ci dessous.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*Aucun créateur configuré*"}`).setColor(config.color || "#FF0000");
        await interaction.reply({ embeds: [embed], ephemeral: true });        
        }
    },
};