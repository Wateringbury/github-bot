import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command, container } from "@sapphire/framework";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Raise a new feature request.",
  preconditions: ["HasServer"],
})
export class FeatureCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option //
            .setName("title")
            .setDescription("Enter a short summary of the feature")
            .setRequired(true)
            .setMaxLength(255)
        )
        .addStringOption((option) =>
          option //
            .setName("description")
            .setDescription("Enter the full details of the feature and any requirements")
        )
    );
  }

  /**
   * Get the title and description of the feature.
   * @param interaction The slash command interaction
   */
  public async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<Message<boolean>> {
    await interaction.deferReply();
    // @ts-ignore: HasServer precondition checks if guild is null
    const serverId: string = interaction.guild.id;
    // @ts-ignore: title input is a required field
    const title: string = interaction.options.getString("title").trim();
    const description: string | undefined = interaction.options.getString("description")?.trim();
    // Create a new feature on this server's repository
    const message: string = await container.controller.createFeature(serverId, title, description);
    return interaction.editReply(message);
  }
}
