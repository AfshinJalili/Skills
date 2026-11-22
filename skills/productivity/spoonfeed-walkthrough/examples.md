# Spoonfeed walkthrough — full examples

Sibling of [SKILL.md](SKILL.md). Generic "thread on an item" feature. Substitute the real module.

---

## Bad document (fails every guardrail)

```markdown
# Chat notes

You probably already have the stack running. Log in somehow (OTP is fine).
Pick a published item from the list. If there isn't one, go create it —
that's documented in the catalog plugin.

## Files to read
- src/foo/foo.plugin.ts
- src/foo/foo.service.ts
- src/foo/foo.resolver.ts
- src/foo/foo.entity.ts

## Try it
mutation {
  openThread(itemId: $ITEM_ID) { id }
  send(id: $THREAD_ID, text: "hi") { sequence }
}

It should work. Then mark it read. You'll figure out the cursor.
```

Why this fails: expects a session and a catalog row; file list not stories; `$ITEM_ID` / `$THREAD_ID` unbound; no **You should see**; "you'll figure out" is the reader inventing a step.

---

## Good document (minimal complete)

~~~~markdown
# Onboard: item threads

You will open a thread on a published item, send, retry, and mark read.
Users, passwords, and the item already exist.

## Sit down (once)

```bash
cd /path/to/app
docker compose up -d
npm run seed:walkthrough
npm run dev
```

In a **second** terminal (keep it):

```bash
SHOP=http://localhost:3000/shop-api
```

| | |
| --- | --- |
| Buyer | `buyer@local.test` / `Walkthrough1` |
| Seller | `seller@local.test` / `Walkthrough1` |
| Item id | `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee` |

```bash
curl -sS "$SHOP" -D /tmp/buyer.hdrs \
  -H "content-type: application/json" \
  --data '{"query":"mutation { login(username: \"buyer@local.test\", password: \"Walkthrough1\") { ... on CurrentUser { id } ... on ErrorResult { errorCode message } } }"}'
BUYER_TOKEN=$(grep -i '^x-auth-token:' /tmp/buyer.hdrs | awk '{print $2}' | tr -d '\r')
echo "BUYER_TOKEN=$BUYER_TOKEN"
```

**You should see:** a long `BUYER_TOKEN`, not empty.

Raw JSON for a non-bash client:

```json
{"query":"mutation { login(username: \"buyer@local.test\", password: \"Walkthrough1\") { ... on CurrentUser { id } } }"}
```

## Story 1 — Buyer opens a thread on the item

1. [`openThread`](../src/foo/api/foo.resolver.ts#L40) — HTTP in, one service call.
2. [`FooService.open`](../src/foo/services/foo.service.ts#L12) — published item, buyer ≠ seller, insert [`Thread`](../src/foo/entities/thread.entity.ts#L20).

```bash
curl -sS "$SHOP" \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  --data '{"query":"mutation { openThread(itemId: \"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\") { id itemId lastSequence } }"}'
```

**You should see:** `"itemId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"`, `"lastSequence": 0`. Suppose the returned `id` is `11111111-2222-3333-4444-555555555555`.

Run the same curl again. **You should see:** the same `id`.

## Story 2 — Buyer sends

1. [`sendMessage`](../src/foo/api/foo.resolver.ts#L55)
2. [`FooService.send`](../src/foo/services/foo.service.ts#L80)

```bash
curl -sS "$SHOP" \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  --data '{"query":"mutation { sendMessage(input: { threadId: \"11111111-2222-3333-4444-555555555555\", clientMessageId: \"buyer-1\", text: \"Is this still available?\" }) { sequence text } }"}'
```

**You should see:** `"sequence": 1`, `"text": "Is this still available?"`.

Note: `threadId` is a literal. It is not `$THREAD_ID`.
~~~~

After you run story 1 yourself during prepare, replace `11111111-...` with the real id before handing the doc over. Do not leave the hypothetical uuid if you already have a real one.

---

## Snippet-level pairs

| Situation | Bad | Good |
| --- | --- | --- |
| Missing catalog row | "If `items` is empty, creating one is out of scope." | Seed inserts one published row; table lists its id. |
| Auth | Full OTP + phone walkthrough to test comments | Seed native user; one `login` with filled password. |
| Orientation | Numbered file table | Story 1 = first user action; links in call order. |
| Next request | `threadId: \"$THREAD_ID\"` | `threadId: \"11111111-2222-3333-4444-555555555555\"` |
| Success check | "It should work." | **You should see:** `"sequence": 1` |
| Error path | "Try a stranger, you'll see it's forbidden." | Exact curl with stranger token; **You should see:** `ENTITY_NOT_FOUND` |
| Line link | `(../foo.service.ts)` no line | `(../src/foo/services/foo.service.ts#L80)` on `send` |
| Two implementations | One doc that says "same as the other branch" | One complete doc per implementation; no "go read the other file" |

---

## Agent self-check (run on the draft)

1. Open a **new** shell. Run only sit-down. Paste story 2 without re-reading story 1's "set this variable" line. If it 500s on uuid/empty id, fail.
2. Click every `#L` link. If it lands on an import or the wrong function, fail.
3. Search the doc for `paste-`, `YOUR_`, `$` + `ID`. Resource ids must not match. `$SHOP` / `$BUYER_TOKEN` from sit-down only.
4. Confirm you actually ran the seed and the ids in the doc exist in the DB you pointed at.
