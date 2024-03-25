import { Command, CommandStore } from "@sapphire/framework";
import { Server } from "../models/Server";
import { EmbedBuilder, InteractionReplyOptions } from "discord.js";
import { Octokit } from "octokit";

export class GithubController {
  private servers: Map<string, Server> = new Map<string, Server>();
  private octokit: Octokit;

  /**
   * Initialise a new controller instance with a new octokit
   * object.
   * @param gitHubToken GitHub API token
   */
  public constructor(gitHubToken: string) {
    this.octokit = new Octokit({
      auth: gitHubToken,
    });
  }

  /**
   * Create a new server mapping.
   * @param serverId The guild id
   */
  public addServer(serverId: string): void {
    this.servers.set(serverId, new Server());
  }

  /**
   * Print out the application commands.
   * @param commands All bot commands
   * @returns Message embed
   */
  public help(commands: CommandStore): InteractionReplyOptions {
    const embed = new EmbedBuilder().setColor(0x274437).setTitle("All commands");
    let commandsString: string = "";
    commands.each((command: Command) => {
      commandsString += `/${command.name} - ${command.description}`;
      if (!Object.is(commands.last(), command)) {
        commandsString += "\n";
      }
    });
    embed.setDescription(commandsString);
    return { embeds: [embed] };
  }

  /**
   * Set the server repository.
   * @param serverId Id for the server the command was used in
   * @param owner The Github user/organisation that owns the repository
   * @param repo The name of the repository
   */
  public async setRepository(serverId: string, owner: string, repo: string): Promise<string> {
    // Get available workspaces
    // @ts-ignore: HasServer precondition confirms server exists
    const server: Server = this.servers.get(serverId);
    // Set repository
    const message: string = await server.setRepository(owner, repo);
    return message;
  }

  /**
   * Create a new issue on the server's repository with the label 'bug'.
   * @param serverId Id for the server the command was used in
   * @param title The Github user/organisation that owns the repository
   * @param description The full issue description
   */
  public async createBug(serverId: string, title: string, description?: string): Promise<string> {
    // Get available workspaces
    // @ts-ignore: HasServer precondition confirms server exists
    const server: Server = this.servers.get(serverId);
    let message: string;
    try {
      // Create the issue
      message = await server.createIssue(title, description, "bug");
    } catch (error: any) {
      // Return error details
      message = error.message;
    }
    return message;
  }

  /**
   * Create a new issue on the server's repository with the label 'enhancement'.
   * @param serverId Id for the server the command was used in
   * @param title The Github user/organisation that owns the repository
   * @param description The full issue description
   */
  public async createFeature(serverId: string, title: string, description?: string): Promise<string> {
    // Get available workspaces
    // @ts-ignore: HasServer precondition confirms server exists
    const server: Server = this.servers.get(serverId);
    let message: string;
    try {
      // Create the issue
      message = await server.createIssue(title, description, "enhancement");
    } catch (error: any) {
      // Return error details
      message = error.message;
    }
    return message;
  }
}
