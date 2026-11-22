---
name: spoonfeed-walkthrough
description: >-
  Writes a story-by-story walkthrough of a code or module flow and prepares the
  world so the reader only runs the feature. Use when the user asks to be
  onboarded on a flow, wants a runnable walkthrough, exact payloads, clickable
  code per step, spoonfeeding, or says not to assume they know something /
  have a brittle focus span. Do not use for whole-repo maps, CodeTour-only
  artifacts, or implementation work.
---

# Spoonfeed walkthrough

Produce a document the reader can execute without inventing a step. **Prepare** the world. Walk **stories**, not files. Every request is **exact**. Every story ends on **You should see**.

This is not `/codebase-onboarding` (repo map) and not `/code-tour` (editor click-path only). A tour may accompany the code links. It does not replace prepare or exact requests.

## Reader

Treat the reader as having a **brittle focus span**. One unfinished prerequisite and they leave. The agent does catalog setup, identity, seed data, server start checks, and id capture. The reader only runs the stories that are the feature they asked about.

## Workflow

Do these in order. Do not write the doc until prepare has real values.

1. **Name the stories.** List user-facing flows in the order a person hits them. Not a file inventory. First story = first customer-facing action of this feature.
2. **Trace each story in code.** Resolver/handler → service → persistence → side effects. Verify line numbers by reading the file. Do not guess.
3. **Prepare.** Create whatever the stories need (users, rows, tokens, a running local process, unique ids). Run the seed/setup yourself. Capture real ids into the doc.
4. **Write one markdown file** next to the code (`docs/` or the module folder). Sit-down block, then one heading per story.
5. **Self-check** against [Guardrails](#guardrails). If a story's curl fails in a fresh shell, fix the doc.

**Done when:** a new terminal, after only the sit-down block, can complete every story by pasting, and every **You should see** matches what the running system returns.

## Document shape

```markdown
# Onboard: <feature>

One sentence: what they will do. One sentence: what you already prepared.

## Sit down (once)
Commands you ran or that they run unchanged. Table of emails/passwords/ids
that already exist. How to start the process if it is not up. Login request
with literals filled in.

## Story 1 — <user-facing action>
Numbered code path with clickable links.
Exact request.
**You should see:** <literal fields / status / error key>
```

Sit-down is not a story. Stories start at the first feature action.

## Prepare

Prepare is work, not a paragraph of homework.

- Prefer the **simplest auth the app already has** that yields a session (email/password, a seed token). Do extra identity ceremony only if the feature under test requires it.
- Insert or seed domain rows the feature needs. Do not send the reader into another module's create-flow to unlock this one.
- Idempotent seed (stable emails/slugs) so reruns do not duplicate.
- Run the seed. Paste **real** ids into every request. A table in sit-down is not enough if stories still contain empty `$VARS`.
- If live HTTP needs a server, start or detect it. Point at the real URL.

If prepare cannot finish (no DB, no collection to hang a row on), stop and say what blocked. Do not publish a walkthrough that says "skip live requests."

## Stories, not files

Each story is one user action. Inside it, the code path is a short numbered list of links, in call order.

Link form (paths relative to the doc):

`[FooService.open](../src/foo/foo.service.ts#L12)`

Verify the line is the function or block, not the imports. Optional: a CodeTour that mirrors the same story order. The markdown still owns sit-down and exact requests.

## Exact requests

Every runnable block is paste-complete.

- Fill ids, emails, passwords, path params, JSON bodies.
- Sit-down may set `SHOP` and `TOKEN` **once**. Every later block still contains the full URL, headers, and a **literal** resource id. Tokens may stay as `$BUYER_TOKEN` only if sit-down `echo`s them non-empty and one sentence says "same terminal as sit-down."
- Resource ids created in story 1 appear as **text** in story 2 (`"id": "a1b2c3d4-..."`), not `$THREAD_ID`. A fresh shell must not send `""` into a uuid column.
- Also include the raw JSON body with literals so a non-bash HTTP client can paste it.
- Each story: **You should see** with concrete strings (`"sequence": 1`, `ENTITY_NOT_FOUND`, HTTP 401).

## Guardrails

A walkthrough fails this skill when any of these is true:

- A story requires a row or user the agent did not create.
- A request contains a placeholder (`paste-here`, `$UNSET_ID`, `YOUR_TOKEN`).
- Architecture is a file table instead of stories.
- A step is "see the other module's docs" for a prerequisite of *this* feature.
- Line links were not opened and checked.
- **You should see** is missing or vague (`it should work`).

## Good and bad

Copy the good shape. Treat the bad as a failed self-check.

### Prepare

Bad:

```markdown
You need two customers and a published item. Creating an item is a large
flow; if the list is empty, stop here and use tests instead.
```

Good:

```markdown
Seed already inserted buyer, seller, and one published item.

| | |
| --- | --- |
| Buyer | `buyer@local.test` / `Walkthrough1` |
| Item id | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

Ran: `npm run seed:walkthrough` (idempotent).
```

### First story

Bad:

```markdown
## Architecture
Read `foo.service.ts`, then `foo.resolver.ts`, then the entity.
```

Good:

```markdown
## Story 1 — Reader opens a thread on the item

1. HTTP hits [`openThread`](../src/foo/foo.resolver.ts#L40).
2. [`FooService.open`](../src/foo/foo.service.ts#L12) inserts the row.

curl ... openThread(itemId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890") ...

**You should see:** `"itemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"`, `"lastSequence": 0`.
```

### Exact id after create

Bad (fresh shell → `invalid input syntax for type uuid`):

```bash
curl ... --data "{\"query\":\"mutation { send(id: \\\"$THREAD_ID\\\") }\""
```

Good (id is in the snippet):

```bash
curl -sS "$SHOP" \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  --data '{"query":"mutation { send(id: \"a1b2c3d4-e5f6-7890-abcd-ef1234567890\", text: \"Hi\") { sequence } }"}'
```

### Auth

Bad: walk the reader through a second product flow only to obtain a session.

Good: seed a verified user; sit-down is one `login` with that email and password filled in.

## Additional resources

- Full document (good vs bad side by side): [examples.md](examples.md)
