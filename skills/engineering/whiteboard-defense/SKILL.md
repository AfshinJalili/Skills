---
name: whiteboard-defense
description: >-
  Apply Mitchell Hashimoto's whiteboard defense before customer-facing work
  counts as shipped. The human must be able to explain how the system works
  and defend the decisions, without line-level familiarity with the code.
  Draw that explanation as a whiteboard diagram and show the drawing. Use
  when shipping, merging, releasing, or reviewing a system other people
  depend on. Use when the user asks why this instead of that, what a
  malicious actor can do, which data structure and why, where it fails, or
  for a whiteboard drawing of a feature. Use when the work is a PoC, demo,
  spike, or experiment, where this bar does not apply and speed wins.
---

# Whiteboard defense

Mitchell Hashimoto's benchmark for responsible AI use: someone should be able to pull you aside and have you explain any customer-facing system you have shipped. You defend the decisions. Reciting the code does not count.

Source: https://x.com/mitchellh/status/2100249348345057389

The reply under that post asks for a whiteboard drawing of the feature just shipped, easy to understand and simple to explain. The drawing is the defense. A paragraph that describes a drawing is not one.

The bar is the design, said out loud and redrawable from memory. Forgetting a function name is fine. You may not know it. If other people depend on the system, you still owe a confident answer to why this design, what a hostile actor can do, what the core representation is, and where it breaks. A working system that nobody in the room can defend has missed the bar.

## Classify first

Say which class this work is in, in one line, before anything else.

**Customer-facing** means someone other than the author depends on it once it lands. A product feature, an API another team calls, a migration on real data, an internal tool in production. Coworkers count. A script only the author runs does not.

**Experiment** means a PoC, demo, spike, or throwaway. Its job is speed. Generating all of it and understanding none of it is the correct outcome.

Getting this line wrong is the skill failing. A defense on a spike wastes the spike. Waiving the bar on a ship is what the benchmark exists to stop.

## Experiment

Stop after that line. Build. Leave the design unexplained, skip the quiz, skip the drawing, and leave the work shaped for speed rather than for a later explanation.

If they explicitly ask for a defense or a drawing of a spike, give them the board. Gaps on that board are notes. They are not a reason to stop building.

## Customer-facing

The work is not done until two things exist: a board the human could redraw from memory, and a caption they could say in a few minutes with no laptop.

One board for the system being shipped, not one per file. Stay at behavior and decisions. If a label only works when you remember a function name, a file path, or a diff hunk, climb until it stands without the repo.

You have to be able to draw it before you hand it over. If you cannot, you do not yet understand the design well enough to ship it. Read until you can, or simplify until the picture is sayable. A gap is one sentence naming what is still undefended and what would close it. A confident box that hides a gap is a miss.

Work that is not shipped yet stays unshipped while a gap is open. Work already in production gets the same gap as a finding. Looking backward does not turn the finding into a merge gate.

When a load-bearing choice is the alternative you rejected, the trust boundary, the representation, or the failure mode, it is on the board. Prefer a design they can defend over a clever one they cannot.

## Draw the board

Write one self-contained HTML file. Inline CSS and inline SVG. No network, no CDN, no diagram server.

The board has at most these marks. Leave a mark off when this system does not have it, and name that absence in Gaps.

- The path someone or something takes, as a few boxes and arrows
- The alternative that was actually available, set to the side so it is obvious what lost
- The hostile path
- What is stored
- The break, sitting on the path at the step where it actually fails

Labels are words you would write with a marker. Short enough to say while pointing.

Show the file. The picture has to land in front of them.

1. If this session has `html_preview` and `html_render`, that is the way to show it. Read their schemas first. Preview the file, then render it with the preview's content height and a short title. Follow the layout rules those tools state, including theme variables and no page chrome. A screenshot of the HTML is not a substitute.
2. If this session has a different tool whose job is to put HTML or a diagram in front of the user, use that tool the way its schema says.
3. Otherwise open the same HTML file in the browser. Do not start a server to serve it.

Use the theme variables when the preview tool provides them, with a plain color fallback in each `var()` so the same file still reads as a board in a browser. Boxes that need their own fill get padding and the tool's radius. Let the content set the height.

The board carries the path. If it needs a paragraph beside it to be understood, redraw it with fewer boxes.

## Caption

The caption carries what the picture cannot: why the alternative lost, and any gap. Do not restate each box in prose.

```markdown
## Whiteboard defense

**System:** <one sentence: what this is, and for whom>

**Why this, not that:** <the alternative on the board, and why it lost>

**Gaps:** <none, or each undefended question in one sentence>
```

How it works, the hostile path, the representation, and the break are on the board. Repeat one of them in the caption only when the board cannot hold it.

Done when someone who did not write the code could redraw the board from memory and answer from it. "The model wrote it" is not an answer.
