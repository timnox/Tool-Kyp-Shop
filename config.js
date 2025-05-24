


const rawColor = process.env.COLOR;
const color = rawColor && /^[0-9A-Fa-f]{6}$/.test(rawColor)
  ? `#${rawColor}`
  : "#bb53ff";

module.exports = {
  token: process.env.TOKEN,
  owner: process.env.OWNER_IDS?.split(',') || [],
  color,
  statut: process.env.STATUT || "Mon statut",
  activity: process.env.ACTIVITY || "playing",
  status: process.env.STATUS || "online",
  vouchlogs: process.env.VOUCH_LOGS_ID,
  suggestionlogs: process.env.SUGGESTION_LOGS_ID,
  customer: process.env.CUSTOMER_ROLE_ID,
  bot: process.env.BOT_IDS?.split(',') || [],
  channelId: process.env.CHANNEL_ID
};
