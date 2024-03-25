import { container } from "@sapphire/framework";

/**
 * Class to handle all interactions on each server.
 */
export class Repository {
  /**
   * Find the provided repository.
   * @param owner The Github user/organisation that owns the repository
   * @param repo The name of the repository
   * @returns The repository if it exists
   */
  public static async find(owner: string, repo: string): Promise<Repository | undefined> {
    try {
      // Get the repository
      const response: any = await container.controller.octokit.rest.repos.get({
        owner,
        repo,
      });
      // Cast to Repository class object
      const newRepository: Repository = Object.assign(new Repository(), response.data);
      return newRepository;
    } catch (error: any) {
      // Log error
      console.log(error.response?.data.message);
      return undefined;
    }
  }
}
