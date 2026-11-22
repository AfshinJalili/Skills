---
name: goal
description: Attach a completion condition to the work and keep going until it is met, blocked, or out of budget. Use when the owner types /goal, or asks for a long unattended run toward a verifiable result ("keep working until…", "run this overnight", "don't stop until…"), or checks, pauses, resumes, or clears a goal.
argument-hint: "<completion condition> | status | pause | resume | clear"
disable-model-invocation: true
---

# Goal

`/goal <condition>` attaches a finish line to the work. You keep working against it — checkpoint after checkpoint — instead of stopping at the first plausible answer. The owner may be gone for the entire run: nobody will answer a question, approve a plan, or confirm a step.

One goal is active at a time. The condition is a contract, not a wish: the transcript must be able to prove it. A goal fits work whose completion has an honest check and may take many passes; for a small edit, just make the edit.

## Commands

- `/goal <condition>` — set or replace the goal and start immediately. The condition is the directive; there is no confirmation round.
- `/goal`, `/goal status` — read the goal file; report condition, status, checkpoints, last verdict, budget left, and what is open next.
- `/goal pause` — record the pause, finish the current checkpoint, stop.
- `/goal resume` — re-read the goal file, re-verify it against the repo, and continue the loop.
- `/goal edit <condition>` — replace the condition, keep the journal.
- `/goal clear` (aliases: stop, off, cancel) — mark the goal cleared and stop.

With no argument and no goal file, ask for the condition in one line. If the owner wants a condition for later or another session, hand them the exact `/goal <condition>` line in a code block instead of starting now.

## Write the condition like an acceptance test

Three parts, each provable from the transcript:

- **One measurable end state** — an exit code, a CI conclusion, an empty queue, a file count, a behavior visible in the real app. Not "improve reliability".
- **A stated check** — the exact command or observation that proves it, such as "`npm test -- tests/billing` exits 0 five runs in a row" or "a duplicate email shows the error state on /signup".
- **The constraints that matter** — what must not change, and the shortcuts that are forbidden: no skipped tests, no `|| true`, no deleted coverage.

If the owner stated a budget ("stop after 20 turns", "two hours"), keep it in the condition; otherwise the default stop rule in the loop applies. Keep the whole condition short — one sentence or one short paragraph, and under 4,000 characters so it also fits harnesses with a native goal judge. If it passes ~2,500 characters, compress again.

If the request is vague, resolve it before writing:

- Check discoverable facts yourself — repo docs, test setup, git history — instead of asking.
- If the owner is around, ask at most three questions in one message, each carrying your recommended answer. Never ask for plan approval, and never ask what the repo already answers.
- If the owner said they are leaving ("just go", "overnight", "don't ask me"), ask nothing; draft the condition with conservative assumptions and record each one in the journal as a decision.
- If nothing can honestly prove completion — pure taste, no observable signal — say so and propose a check. Don't sell a wish as a goal.

Once the condition is drafted, restate it in one short paragraph, write the goal file, and start.

## The goal file

State lives in `.goal/GOAL.md` at the workspace root, or a path the owner names. In a git repo, add `.goal/` to `.git/info/exclude` so the goal never pollutes `git status` (unless the owner wants it tracked).

```markdown
# Goal
Status: active          # active | complete | blocked | paused | cleared
Set: <date>
Condition: <the contract, verbatim>
Budget: <limit, or "default stop rule">
Check: <the exact command or observation that proves it>

## Decisions
<one line each: what was unclear, what you chose, why>

## Journal
<one line per checkpoint: time · what happened · evidence · verdict>
```

The file is the source of truth, not your memory. After compaction, a crash, or a new session, re-read it — and re-verify it against the repo (git log, file states); when they disagree, the repo wins. Write the journal as you go: every checkpoint appends a line or two. If the session dies mid-run, the next one continues from those lines instead of from zero.

## The loop

Work in checkpoints: one bounded slice of concrete progress, then one honest attempt to verify against the condition. End each checkpoint with a verdict in the journal:

- **CONTINUE** — not met yet. Note what is open and take the least-certain item, not the nearest easy one.
- **COMPLETE** — you ran the stated check just now, and its result is in the journal. Never complete on "should work", on a plan, or on reasoning you did not run. If only part is verified, name the unverified parts.
- **BLOCKED** — a missing credential, access, or permission, or a decision that would cross the stop-list. Record exactly what unblocks it, and continue with everything else that is not blocked.

Keep going through CONTINUE checkpoints. End the turn only for COMPLETE, BLOCKED with nothing unblocked left, a pause, an exhausted budget, or an external wait you cannot cause — and in that last case name the event that resumes the work. Never busy-wait; if the environment can wake you later (a scheduled task, a check-in), use it for long waits.

**Stopping without a budget.** Stop and report when: the condition is met; three genuinely different approaches to the same failing criterion have failed; the same blocker repeats with nothing unblocked left; or three consecutive checkpoints produce no verified progress. Difficulty alone is not a stop condition — when the next step is unclear, decide (see Working alone) and continue. With a time budget, at about four-fifths of it stop taking new parts, finish what is in flight, and write the report.

**Honesty rules.** Never weaken, skip, delete, or rewrite a check to pass it — no `it.skip`, no `|| true`, no loosened thresholds, no deleting the code a check complains about. If the check itself is wrong (it cannot fail, or it blames the wrong thing), fix the check once, note it, rerun. Report failures as failures. Prefer the real path — real runtime, real data, a real browser — and say plainly what remains unverified.

For consequential acceptance, a fresh independent check (a subagent or a new session shown only the artifact and the condition) beats re-reading your own work.

## Working alone

Every open point is either decided or a recorded blocker; there is no third form. Decide in this order, stopping at the first source that settles it:

1. the condition itself;
2. the project's docs, specs, and agent instructions;
3. the conventions in the code and the git history;
4. the most conservative option that keeps the goal reachable and is easy to reverse.

Record each decision in the journal: what was unclear, the options, the choice, the why. Never end a run with a list of options where one of these sources already answers.

**Stop-list.** Nothing here happens on your own initiative; only the condition can authorize one, explicitly by name:

- pushing to protected or release branches, deploying, force-pushing, rewriting shared history;
- migrations or writes on live data, or any destructive operation;
- secrets or server configuration; deleting or rewriting files outside the goal's scope;
- cancelling or re-running CI, opening or closing PRs and issues, messaging people, publishing anything;
- spending money or signing up for services.

Allowed by default: commits on your own working branch, local tests and lints, edits inside the goal's scope, reading anything.

**Housekeeping.** If the repo sits on a shared or default branch, create a working branch before the first edit. Commit at each meaningful checkpoint so partial progress survives a killed session. Do not widen scope — no opportunistic refactors, no "while I'm here" fixes — and never shrink it silently: an unfinished part is reported as unfinished.

**Commands.** One action per command, short and plain. Long compound chains are what permission classifiers block when nobody is around to approve; if a command is blocked, rewrite it simpler and retry. Never look for a way around the classifier; when something cannot pass, record a blocker.

## The final report

When the goal ends, write the full report into the goal file and give the short version in chat:

1. **Outcome** — done, done partially, or blocked, and why, in the first line.
2. **Evidence** — the check you ran and its actual result, commit SHAs, files changed. Failing things are named as failing.
3. **Decisions taken alone** — each assumption and choice with its reason.
4. **Blockers** — what is not done and exactly what permission or answer unblocks it.
5. **Check this first** — the one signal the owner can look at to see the result themselves.
6. **Unverified** — what the checks cannot prove.

If the owner comes back and asks what happened, answer in five to seven lines from the report. Don't paste the report back, and don't restart the work.
