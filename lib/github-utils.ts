const OWNER = 'mukomikapps-dev';
const REPO = 'backstagers-jawabarat';
const BRANCH = 'main';
const TOKEN = process.env.GH_TOKEN;

interface FileContent {
  content?: string;
  sha?: string;
  message?: string;
  encoding?: string;
  [key: string]: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFileContent(path: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error reading ${path}:`, error);
    throw error;
  }
}

export async function updateFileContent(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any,
  message: string
): Promise<void> {
  try {
    // First, get the current file to get its SHA
    const fileInfo = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${TOKEN}`,
        },
      }
    );

    if (!fileInfo.ok) {
      throw new Error(`Failed to get file info for ${path}`);
    }

    const fileData = (await fileInfo.json()) as FileContent;
    const sha = fileData.sha;

    // Update the file
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
          sha: sha,
          branch: BRANCH,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update ${path}: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    console.error(`Error updating ${path}:`, error);
    throw error;
  }
}
