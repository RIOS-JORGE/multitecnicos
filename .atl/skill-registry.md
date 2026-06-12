# Skill Registry — profesionales-directorio

> Generated: 2026-06-11 by sdd-init
> Agent: opencode / deepseek-v4-flash-free
> Source: user-level skills at `~/.config/opencode/skills/`

## Convention Files

| File | Source |
|------|--------|
| `~/.config/opencode/AGENTS.md` | User-level agent instructions (persona, engram protocol, rules) |

## User-Level Skills

### work-unit-commits
- **Path**: `~/.config/opencode/skills/work-unit-commits/SKILL.md`
- **Trigger**: implementation, commit splitting, chained PRs, keeping tests/docs with code
- **Compact Rules**:
  - Commit by deliverable work unit (behavior, fix, migration, docs), never by file type
  - Tests and docs belong in the same commit as the behavior they verify
  - Each commit must tell a story — reviewer should understand why it exists from diff + message
  - If SDD tasks forecast >400 lines, group into chained PR slices before implementing
  - Rollback must not revert unrelated work
  - Use Conventional Commits: `type(scope): description`

### comment-writer
- **Path**: `~/.config/opencode/skills/comment-writer/SKILL.md`
- **Trigger**: PR feedback, issue replies, reviews, Slack messages, GitHub comments
- **Compact Rules**:
  - Start with the actionable point, do not recap the whole PR before feedback
  - Be warm and direct — sound like a thoughtful teammate, not a corporate bot
  - Keep to 1-3 paragraphs or a tight bullet list
  - Explain technical _why_ when requesting changes
  - Avoid pile-ons — comment on the highest-value issue only
  - Match thread language (Rioplatense voseo for Spanish: `podés`, `tenés`, `fijate`)
  - No em dashes — use commas, periods, or parentheses instead

### cognitive-doc-design
- **Path**: `~/.config/opencode/skills/cognitive-doc-design/SKILL.md`
- **Trigger**: writing guides, READMEs, RFCs, onboarding, architecture, review-facing docs
- **Compact Rules**:
  - Lead with the answer (decision/action/outcome first, context after)
  - Progressive disclosure: happy path → details → edge cases → references
  - Chunk related info into small sections; keep flat lists short
  - Use signposting (headings, labels, callouts, summaries)
  - Prefer tables/checklists/templates over dense prose (recognition over recall)
  - Design for reviewer empathy — make verification path explicit
  - For PR docs: state what to review first, what's out of scope, link prev/next in chain

### chained-pr
- **Path**: `~/.config/opencode/skills/chained-pr/SKILL.md`
- **Trigger**: PRs >400 lines, stacked PRs, review slices
- **Compact Rules**:
  - Split PRs over 400 changed lines unless maintainer explicitly accepts `size:exception`
  - Keep each PR reviewable in ≤60 minutes
  - One deliverable work unit per PR; keep tests/docs with the unit they verify
  - State start/end, prior deps, follow-up, and out-of-scope in every chained PR body
  - Every child PR must include a dependency diagram marking current PR with 📍
  - For Feature Branch Chain: draft tracker PR → child #1 targets tracker branch → later children target immediate parent
  - Do not mix chain strategies after user chooses one

### issue-creation
- **Path**: `~/.config/opencode/skills/issue-creation/SKILL.md`
- **Trigger**: creating GitHub issues, bug reports, feature requests
- **Compact Rules**:
  - Blank issues disabled — MUST use bug_report.yml or feature_request.yml template
  - Every issue gets `status:needs-review` automatically on creation
  - A maintainer MUST add `status:approved` before any PR can be opened
  - Questions go to Discussions, not issues
  - Pre-flight checks: no duplicate + understands approval workflow
  - Search existing issues for duplicates before creating

### branch-pr
- **Path**: `~/.config/opencode/skills/branch-pr/SKILL.md`
- **Trigger**: creating, opening, or preparing PRs for review
- **Compact Rules**:
  - Every PR MUST link an approved issue (must have `status:approved` label)
  - Every PR MUST have exactly one `type:*` label
  - Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
  - Conventional commits for all messages: `type(scope): description`
  - PR body must include: linked issue, PR type (exactly one), summary, changes table, test plan, contributor checklist
  - Type-to-label mapping: feat→type:feature, fix→type:bug, docs→type:docs, etc.
  - Automated checks must pass: issue reference, issue approval, type label, shellcheck

### skill-creator
- **Path**: `~/.config/opencode/skills/skill-creator/SKILL.md`
- **Trigger**: new skills, agent instructions, documenting AI usage patterns
- **Compact Rules**:
  - Create skills for reusable patterns, not one-off cases
  - Frontmatter required: `name`, `description` (one line, ≤250 chars, trigger-first), `license`, `metadata.author`, `metadata.version`
  - Target 180-450 body tokens, hard max 1000
  - Structure: Activation Contract → Hard Rules → Decision Gates → Execution Steps → Output Contract → References
  - References must point to local files; put examples/schemas in `assets/`, details in `references/`
  - Do not add `Keywords` section; preserve trigger words in `description`

### go-testing
- **Path**: `~/.config/opencode/skills/go-testing/SKILL.md`
- **Trigger**: Go tests, go test coverage, Bubbletea teatest, golden files
- **Compact Rules**:
  - Prefer table-driven tests for multiple cases; use `t.Run(tt.name, ...)`
  - Test behavior and state transitions, not implementation trivia
  - Use `t.TempDir()` for filesystem tests; never rely on real home directory
  - Keep integration tests skippable with `testing.Short()`
  - For Bubbletea: test `Model.Update()` directly for state; use `teatest` only for interactive flows
  - Golden files must be deterministic; update via `-update` flag only
  - Use small mocks/interfaces around system/command execution boundaries

### judgment-day
- **Path**: `~/.config/opencode/skills/judgment-day/SKILL.md`
- **Trigger**: judgment day, dual review, adversarial review, juzgar
- **Compact Rules**:
  - Launch two blind judges in parallel with identical target and criteria; never review code yourself
  - Wait for both judges before synthesis; never accept a partial verdict
  - Classify warnings as `WARNING (real)` only if normal intended use triggers them; otherwise `WARNING (theoretical)`
  - Terminal states: `JUDGMENT: APPROVED` or `JUDGMENT: ESCALATED`
  - After any fix agent runs, immediately re-launch both judges before commit/push/done
  - After 2 fix iterations with remaining issues, ask user whether to continue
  - Resolve project skills before launching agents via skill registry

## Project Skills

None detected — project is empty (no code scaffolded yet).
