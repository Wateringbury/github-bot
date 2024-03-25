import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command, container } from "@sapphire/framework";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Set the repository for this server.",
  preconditions: ["HasServer"],
})
export class SetRepoCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName("owner")
            .setDescription("Enter the owner of the repository")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option //
            .setName("repo")
            .setDescription("Enter the name of the repository")
            .setRequired(true)
        )
    );
  }

  /**
   * Get the repository and set it as this server's repository.
   * @param interaction The slash command interaction
   */
  public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<Message<boolean>> {
    await interaction.deferReply();
    // @ts-ignore: HasServer precondition checks if guild is null
    const serverId: string = interaction.guild.id;
    // @ts-ignore: owner input is a required field
    const owner: string = interaction.options.getString("owner").trim();
    // @ts-ignore: repo input is a required field
    const repo: string = interaction.options.getString("repo").trim();
    // Set the server repository
    const message: string = await container.controller.setRepository(serverId, owner, repo);
    return interaction.editReply(message);
  }
}
