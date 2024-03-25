import { container } from "@sapphire/framework";

/**
 * Class to handle all interactions for an issue.
 */
export class Issue {
  private id: number = 0;
  private title: string = "";
  private body: string = "";
  private url: string = "";

  /**
   * Get the title of this issue.
   * @returns The issue title
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Create a new issue.
   * @param owner Owner of the repository
   * @param repo Name of the repository
   * @param title Summary of the issue
   * @param body Full description of the issue
   * @param tag Label for the issue
   * @returns The issue if it was created successfully
   */
  public static async create(owner: string, repo: string, title: string, body?: string, tag?: string): Promise<Issue | undefined> {
    const labels: Array<string> = Array<string>();
    if (tag) {
      labels.push(tag);
    }
    try {
      // Create the issue
      const response: any = await container.controller.octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
        labels,
      });
      // Cast to Issue class object
      const newIssue: Issue = Object.assign(new Issue(), response.data);
      return newIssue;
    } catch (error: any) {
      // Log error
      console.log(error.response?.data.message);
      return undefined;
    }
  }
}
