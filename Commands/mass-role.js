const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-role')
        .setDescription('Ajoute/retire un rôle à tous les utilisateurs.')
        .addStringOption(option => option.setName('action').setDescription('Action to perform (add/remove)').setRequired(true)
            .addChoice('Ajoute', 'add')
            .addChoice('Retire', 'remove')
        )
        .addRoleOption(option => option.setName('role').setDescription('Le rôle à ajouter/retirer').setRequired(true)),
    async execute(interaction, config) {
    // Validation de la couleur hex
    const isHex = /^#[0-9A-Fa-f]{6}$/.test(config.color);
    const embedColor = isHex ? config.color : "#FF0000";
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        if (!role.editable) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Veuillez vérifier que le rôle peut être donner par le bot.*`)
            .setColor(config.color || "#FF0000");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const guildMembers = await interaction.guild.members.fetch();
        const totalMembers = guildMembers.size;
        let modifiedMembers = 0;

        if (action === 'add') {
            guildMembers.filter(m => !m.roles.cache.has(role.id)).forEach(member => {
                if (!member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        } else if (action === 'remove') {
            guildMembers.filter(m => m.roles.cache.has(role.id)).forEach(member => {
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        }

        const embed = new Discord.EmbedBuilder()
        .setTitle("\`✅\`〃Massrole terminé")
        .setDescription(`> *Role ${role} (\`${role.id}\`) a été ${action === 'add'? 'ajouté' : 'retiré'} de ${modifiedMembers}/${totalMembers} membres.*`)
        .setColor(config.color || "#FF0000");
    await interaction.reply({ embeds: [embed] });
    return;
    },
};