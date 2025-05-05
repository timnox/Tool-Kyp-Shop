module.exports = {
  token: process.env.TOKEN,
  owner: process.env.OWNER_IDS?.split(',') || [],
  color: "#" + (process.env.COLOR || "FF0000"), // <-- ajout du # ici
  statut: process.env.STATUT || "Mon statut",
  activity: process.env.ACTIVITY || "playing",
  status: process.env.STATUS || "online",
  vouchlogs: process.env.VOUCH_LOGS_ID,
  suggestionlogs: process.env.SUGGESTION_LOGS_ID,
  customer: process.env.CUSTOMER_ROLE_ID,
  bot: process.env.BOT_IDS?.split(',') || [],
  channelId: process.env.CHANNEL_ID
};
