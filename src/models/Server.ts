import { Issue } from "./Issue";
import { Repository } from "./Repository";

/**
 * Class to handle all interactions on each server.
 */
export class Server {
  constructor(
    //
    private id: string,
    private owner?: string,
    private repo?: string
  ) {}

  /**
   * Set the repository for this server to interact with.
   * @param owner The Github user/organisation that owns the repository
   * @param repo The name of the repository
   */
  public async setRepository(owner: string, repo: string): Promise<string> {
    if (!owner || !repo) throw new Error("Owner and repo must be defined");
    // Check the repository exists
    const repository: Repository | undefined = await Repository.find(owner, repo);
    if (!repository) {
      return "Repository not found";
    }
    // Save the repo details on this server
    this.owner = owner;
    this.repo = repo;
    return `Repository set to ${repository.getFullName()}`;
  }

  /**
   * Create a new issue on this server's repository.
   * @param title Summary of the issue
   * @param description Full description of the issue
   * @param tag Issue label to add
   * @returns Message with outcome
   */
  public async createIssue(title: string, description?: string, tag?: string): Promise<string> {
    if (!this.owner || !this.repo) throw new Error("Server repository must be defined");
    // Create the new issue
    const issue: Issue | undefined = await Issue.create(this.owner, this.repo, title, description, tag);
    if (!issue) {
      // If issue creation fails
      return "Issue not created";
    }
    return `New ${tag ?? "issue"} raised: ${issue.getTitle()}`;
  }
}
