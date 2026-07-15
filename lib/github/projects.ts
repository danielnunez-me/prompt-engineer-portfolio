export interface GithubProject {
  name: string
  description: string
  topics: string[]
  htmlUrl: string
  pushedAt: string
}

interface GithubRepoResponse {
  name: string
  description: string | null
  topics?: string[]
  html_url: string
  fork: boolean
  pushed_at: string
  stargazers_count: number
}

/**
 * Fetch public GitHub repos for Featured Projects.
 * Relevance: non-forks, sorted by pushed_at descending, top 3.
 */
export async function getFeaturedGithubProjects(
  username = process.env.GITHUB_USERNAME ?? 'danielnunez-me',
  limit = 3,
): Promise<GithubProject[]> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'prompt-engineer-portfolio',
  }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=public&sort=pushed&per_page=100`,
    {
      headers,
      next: { revalidate: 3600 },
    },
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const repos = (await res.json()) as GithubRepoResponse[]

  return repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? '',
      topics: repo.topics ?? [],
      htmlUrl: repo.html_url,
      pushedAt: repo.pushed_at,
    }))
}
