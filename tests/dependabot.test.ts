import { createRequire } from "node:module";
import { describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const mergeUpdates = require("../.github/scripts/merge-dependabot.cjs");

function fixture() {
  const pull = {
    number: 7,
    state: "open",
    draft: false,
    user: { login: "dependabot[bot]", type: "Bot" },
    head: {
      sha: "tested-sha",
      ref: "dependabot/npm_and_yarn/react-20.0.0",
      repo: { full_name: "ejlu/tailwind-design-setup" },
    },
    base: { ref: "main" },
  };
  const run = {
    status: "completed",
    conclusion: "success",
    name: "Check starter",
    path: ".github/workflows/check.yml",
    event: "pull_request",
    head_sha: "tested-sha",
    actor: { login: "dependabot[bot]" },
    head_repository: { full_name: "ejlu/tailwind-design-setup" },
  };
  const checks = [{ status: "completed", conclusion: "success" }];
  const statuses = { total_count: 0, state: "pending" };
  const merge = vi.fn().mockResolvedValue({ data: { merged: true } });
  const github = {
    paginate: vi.fn(async (route: string) => (route.endsWith("/pulls") ? [pull] : checks)),
    rest: {
      pulls: { get: vi.fn(async () => ({ data: pull })), merge },
      repos: { getCombinedStatusForRef: vi.fn(async () => ({ data: statuses })) },
    },
  };
  const context = {
    repo: { owner: "ejlu", repo: "tailwind-design-setup" },
    payload: { workflow_run: run, repository: { default_branch: "main" } },
  };
  return { pull, run, checks, statuses, merge, github, context, core: { info: vi.fn() } };
}

describe("Dependabot auto-merge gate", () => {
  it.each([
    "dependabot/npm_and_yarn/npm-minor-and-patch-1234abcd",
    "dependabot/github_actions/actions-minor-and-patch-1234abcd",
    "dependabot/npm_and_yarn/react-20.0.0",
    "dependabot/github_actions/actions/checkout-7",
    "dependabot/github_actions/actions/setup-node-7",
  ])("merges a checked update with an exact-SHA lease: %s", async (branch) => {
    const f = fixture();
    f.pull.head.ref = branch;
    await mergeUpdates(f);
    expect(f.merge).toHaveBeenCalledWith({
      owner: "ejlu",
      repo: "tailwind-design-setup",
      pull_number: 7,
      sha: "tested-sha",
      merge_method: "squash",
    });
  });

  const rejected: [string, (f: ReturnType<typeof fixture>) => void][] = [
    [
      "failed CI",
      (f) => {
        f.run.conclusion = "failure";
      },
    ],
    [
      "another workflow",
      (f) => {
        f.run.path = ".github/workflows/other.yml";
      },
    ],
    [
      "human-triggered run",
      (f) => {
        f.run.actor.login = "someone";
      },
    ],
    [
      "fork run",
      (f) => {
        f.run.head_repository.full_name = "someone/fork";
      },
    ],
    [
      "human-authored PR",
      (f) => {
        f.pull.user.login = "someone";
      },
    ],
    [
      "unsupported ecosystem",
      (f) => {
        f.pull.head.ref = "dependabot/docker/node-26";
      },
    ],
    [
      "non-Dependabot branch",
      (f) => {
        f.pull.head.ref = "feature/package-update";
      },
    ],
    [
      "new untested head",
      (f) => {
        f.pull.head.sha = "new-sha";
      },
    ],
    [
      "draft PR",
      (f) => {
        f.pull.draft = true;
      },
    ],
    [
      "closed PR",
      (f) => {
        f.pull.state = "closed";
      },
    ],
    [
      "other base",
      (f) => {
        f.pull.base.ref = "release";
      },
    ],
    [
      "fork PR",
      (f) => {
        f.pull.head.repo.full_name = "someone/fork";
      },
    ],
    [
      "pending checks",
      (f) => {
        f.checks[0].status = "in_progress";
      },
    ],
    [
      "failed checks",
      (f) => {
        f.checks[0].conclusion = "failure";
      },
    ],
    [
      "failed legacy status",
      (f) => {
        f.statuses.total_count = 1;
        f.statuses.state = "failure";
      },
    ],
  ];
  it.each(rejected)("does not merge %s", async (_, modify) => {
    const f = fixture();
    modify(f);
    await mergeUpdates(f);
    expect(f.merge).not.toHaveBeenCalled();
  });

  it("handles duplicate push/PR completions without merging a closed PR again", async () => {
    const f = fixture();
    f.run.event = "push";
    await mergeUpdates(f);
    f.pull.state = "closed";
    await mergeUpdates(f);
    expect(f.merge).toHaveBeenCalledTimes(1);
  });
});
