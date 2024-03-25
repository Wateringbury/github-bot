import { Repository } from "./Repository";

/**
 * Class to handle all interactions on each server.
 */
export class Server {
  private owner?: string = undefined;
  private repo?: string = undefined;

  /**
   * Set the repository for this server to interact with.
   * @param owner The Github user/organisation that owns the repository
   * @param repo The name of the repository
   */
  public async setRepository(owner: string, repo: string): Promise<void> {
    if (!owner || !repo) throw new Error("Owner and repo must be defined");
    // Check the repository exists
    const repository: Repository | undefined = await Repository.find(owner, repo);
    if (repository) {
      // Save the repo details on this server
      this.owner = owner;
      this.repo = repo;
    }
  }
}
