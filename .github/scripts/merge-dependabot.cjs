// Runs trusted default-branch code after CI, without executing PR code or artifacts.
module.exports = async function mergeUpdates({ github, context, core }) {
  const run = context.payload.workflow_run;
  const { owner, repo } = context.repo;
  const repository = `${owner}/${repo}`;
  if (
    run?.status !== "completed" ||
    run.conclusion !== "success" ||
    run.name !== "Check starter" ||
    run.path !== ".github/workflows/check.yml" ||
    !["pull_request", "push"].includes(run.event) ||
    run.actor?.login !== "dependabot[bot]" ||
    run.head_repository?.full_name !== repository
  ) {
    core.info("Not an eligible Dependabot CI run.");
    return;
  }

  // workflow_run.pull_requests can be empty; query associations by the tested SHA.
  const pulls = await github.paginate("GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
    owner,
    repo,
    commit_sha: run.head_sha,
    per_page: 100,
  });
  for (const candidate of pulls) {
    const { data: pull } = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: candidate.number,
    });
    // Accept grouped and individual updates, including majors, for our ecosystems.
    const supportedUpdate = /^dependabot\/(?:npm_and_yarn|github_actions)\//.test(pull.head.ref);
    if (
      pull.state !== "open" ||
      pull.draft ||
      pull.user.login !== "dependabot[bot]" ||
      pull.user.type !== "Bot" ||
      pull.head.repo?.full_name !== repository ||
      pull.base.ref !== context.payload.repository.default_branch ||
      pull.head.sha !== run.head_sha ||
      !supportedUpdate
    ) {
      continue;
    }

    const checks = await github.paginate("GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
      owner,
      repo,
      ref: run.head_sha,
      filter: "latest",
      per_page: 100,
    });
    const { data: statuses } = await github.rest.repos.getCombinedStatusForRef({
      owner,
      repo,
      ref: run.head_sha,
    });
    if (
      checks.some(
        (check) =>
          check.status !== "completed" ||
          !["success", "neutral", "skipped"].includes(check.conclusion),
      ) ||
      (statuses.total_count > 0 && statuses.state !== "success")
    ) {
      core.info(`Waiting for all checks on PR #${pull.number}.`);
      continue;
    }

    // GitHub rejects this merge if the head changed after the successful CI run.
    const { data: result } = await github.rest.pulls.merge({
      owner,
      repo,
      pull_number: pull.number,
      sha: run.head_sha,
      merge_method: "squash",
    });
    if (!result.merged) throw new Error(`GitHub did not merge PR #${pull.number}.`);
    core.info(`Merged Dependabot PR #${pull.number} after successful CI.`);
  }
};
