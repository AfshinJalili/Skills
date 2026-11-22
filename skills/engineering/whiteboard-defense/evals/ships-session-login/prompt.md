---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

I'm about to merge login for our production app. Customers hit this Monday. I had an agent write most of it and I want to know if I can actually ship it.

What we built: after password check, the server stores a random session id in an httpOnly cookie and a row (session id, user id, expiry, revoked flag) in Postgres. The alternative on the table was a signed JWT in the cookie with no server row, so logout would have been "wait for expiry." I picked the row so logout and password reset kill every live session immediately. A stolen cookie works until that row is revoked or expires. We do not keep a denylist of raw tokens. Request path reads the cookie, looks up the row, rejects if missing, expired, or revoked.

Write whatever I need before this is safe to call shipped. I am not asking for a code review of function names.
