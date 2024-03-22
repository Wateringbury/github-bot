import { SapphireClient, container } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import config from "./config.json";
import { GithubController } from "./controllers/GithubController";

// Create the controller object
container.controller = new GithubController(config.gitHubToken);

// Initiate the Sapphire client
const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});

// Login the bot
client.login(config.token);
