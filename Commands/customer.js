const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customer')
    .setDescription('Défini le rôle des acheteurs.')
    .addUserOption(option => option.setName('user').setDescription('Utilisateur à donner un rôle').setRequired(true)),
  async execute(interaction, config) {
    const user = interaction.options.getUser('user');
    const customerRole = interaction.guild.roles.cache.get(config.customer);

    const ownersList = config.owner.map(ownerId => {
      const owner = interaction.guild.members.cache.get(ownerId);
      return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
    });

    if (!customerRole) {
      const embed = new Discord.EmbedBuilder()
        .setDescription(`\`🕷️\`〃*Le rôle des acheteurs n'est pas défini, veuillez contacter un créateur ci dessous.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*Aucun créateur défini*"}`)
        .setColor(config.color);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    } 

    try {
        await interaction.guild.members.cache.get(user.id).roles.add(customerRole);
      
        const embed = new Discord.EmbedBuilder()
          .setTitle("\`✅\`〃Le rôle a été donné")
          .setDescription(`> *Le rôle ${customerRole} a bien été donné à ${user} (\`${user.id}\`).*`)
          .setColor(config.color);
        await interaction.reply({ embeds: [embed] });
      } catch (e) {
        const embed = new Discord.EmbedBuilder()
          .setDescription(`\`❌\`〃*Une erreur c'est produite, veuillez vérifier que le bot a les permissions de donner ce rôle.*`)
          .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }      
  },
};