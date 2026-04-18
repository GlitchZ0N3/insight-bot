const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!insight') {

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('stats')
                .setLabel('📊 View Server Stats')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('rules')
                .setLabel('📜 View Server Rules')
                .setStyle(ButtonStyle.Secondary)
        );

        message.channel.send({
            content: '@everyone 🚨 New Info dropped!!',
            components: [row]
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    if (interaction.customId === 'stats') {
        const total = guild.memberCount;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const online = guild.members.cache.filter(m => m.presence && m.presence.status !== 'offline').size;

        const embed = new EmbedBuilder()
            .setTitle('📊 Server Stats')
            .setColor(0x00AEFF)
            .addFields(
                { name: 'Members', value: `${total}`, inline: true },
                { name: 'Online', value: `${online}`, inline: true },
                { name: 'Bots', value: `${bots}`, inline: true }
            );

        interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'rules') {
        const embed = new EmbedBuilder()
            .setTitle('📜 Server Rules')
            .setColor(0xFFAA00)
            .setDescription(`
1. Be respectful
2. No spam
3. No NSFW
4. Follow Discord TOS
5. Listen to staff
            `);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(process.env.TOKEN);
