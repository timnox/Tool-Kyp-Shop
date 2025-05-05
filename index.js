require('dotenv').config(); // <-- AJOUTÉ
console.log("→ process.env.COLOR =", process.env.COLOR);
const { Client, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const config = require('./config.js');
const fs = require('fs');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Commande (${file}) manque une "data" ou une propriété "name" et n'est donc pas lu.`);
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN); // <-- changé

async function deployCommands() {
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

    try {
        console.log('Lancement des commandes slashs...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Les commandes slashs ont été lancés !');
    } catch (error) {
        console.error('Une erreur est survenue lors du chargement des commandes slashs :', error);
    }
}

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} (${client.user.id})`);

    let activity;
    if(config.activity == "streaming") activity = ActivityType.Streaming;
    if(config.activity == "competing") activity = ActivityType.Competing;
    if(config.activity == "playing") activity = ActivityType.Playing;
    if(config.activity == "watching") activity = ActivityType.Watching;
    if(config.activity == "listening") activity = ActivityType.Listening;

    client.user.setPresence({
        activities: [
          {
            name: config.statut,
            type: activity,
            url: "https://www.twitch.tv/002sans",
          },
        ],
        status: config.status,
    });

    deployCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const publicCommands = ['vouch','invite','help','payement','profile','suggest','verify'];

    if (!config.owner.includes(interaction.user.id) && !publicCommands.includes(interaction.commandName)) {
        const embed = new EmbedBuilder()
            .setDescription('\`🕷️\` 〃*Tu n\'es pas autorisé à faire cette commande!*')
            .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    try {
        await command.execute(interaction, config);
    } catch (error) {
        console.error('Une erreur est survenue lors du lancement de la cmd:', error);
    }
});

client.on('messageCreate', async (message) => {
    if (message.channel.id === process.env.VOUCH_LOGS_ID) { // <-- modifié
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setDescription('\`🕷️\` 〃*Utilisez la commande \`/vouch\` pour donner votre avis !*')
            .setColor(config.color);
        const cc = await message.reply({ content: `${message.author}`, embeds: [embed] });

        setTimeout(() => {
            message.delete().catch();
            cc.delete().catch();
        }, 8000);
    }
});

client.login(process.env.TOKEN); // <-- changé

process.on('unhandledRejection', (reason, promise) => {
    const ignoredCodes = [10008, 50013, 50035, 40060, 10003, 10014, 50001, 10015];
    if (ignoredCodes.includes(reason.code)) return;
    console.error('Une promise unhandled est apparu :', reason);
    console.log("La couleur du bot est :", process.env.COLOR); // Affiche la valeur de la couleur
});
