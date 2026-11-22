# Skills

[![skills.sh](https://skills.sh/AfshinJalili/Skills)](https://skills.sh/AfshinJalili/Skills)

Four agent skills I actually use. They are small, and each one does one job.

| Skill | What it is for |
| --- | --- |
| [whiteboard-defense](./skills/engineering/whiteboard-defense/SKILL.md) | Customer-facing work is not shipped until you can defend the design, not the diff. |
| [goal](./skills/productivity/goal/SKILL.md) | Keep going until a checkable condition is met. |
| [spoonfeed-walkthrough](./skills/productivity/spoonfeed-walkthrough/SKILL.md) | A walkthrough the reader can run without inventing a step. |
| [walk-me-through](./skills/productivity/walk-me-through/SKILL.md) | Tutor one list, one item per turn. |

## Install

Pick one installer. Installing the same skill twice, from the plugin and from `npx skills`, loads it twice.

### Claude Code

```bash
claude plugin marketplace add AfshinJalili/Skills
claude plugin install afshin-skills@afshin
```

### Any other agent

```bash
npx skills@latest add AfshinJalili/Skills
```

Pass `-a cursor`, `-a opencode`, or another agent name when you do not want the installer to ask. Add `-g` to install for every project.

### Gemini CLI

```bash
gemini skills install https://github.com/AfshinJalili/Skills.git --path skills/engineering
gemini skills install https://github.com/AfshinJalili/Skills.git --path skills/productivity
```

Re-run both commands to update.

### By hand

Copy the skill folder you want into the agent's skills directory. Each folder contains a `SKILL.md`.

```text
skills/engineering/whiteboard-defense
skills/productivity/goal
skills/productivity/spoonfeed-walkthrough
skills/productivity/walk-me-through
```

## Reference

**User-invoked** skills run only when you type them. **Model-invoked** skills can also be picked up when the task fits.

### Engineering

**Model-invoked**

- **[whiteboard-defense](./skills/engineering/whiteboard-defense/SKILL.md)**: Before customer-facing work counts as shipped, draw one board a person could redraw from memory: the path, the alternative that lost, the hostile path, what is stored, and where it breaks. PoCs and spikes are exempt. [Notes](./docs/engineering/whiteboard-defense.md).

### Productivity

**User-invoked**

- **[goal](./skills/productivity/goal/SKILL.md)**: `/goal <condition>` keeps working until the transcript proves the condition, the work is blocked, or the budget is spent. [Notes](./docs/productivity/goal.md).
- **[walk-me-through](./skills/productivity/walk-me-through/SKILL.md)**: Teach an issue, pull request, spec, doc, or topic one part per turn, and check each claim against the source. [Notes](./docs/productivity/walk-me-through.md).

**Model-invoked**

- **[spoonfeed-walkthrough](./skills/productivity/spoonfeed-walkthrough/SKILL.md)**: Prepare the world, then walk the feature as stories with exact requests. The reader does not invent a setup step. [Notes](./docs/productivity/spoonfeed-walkthrough.md).
