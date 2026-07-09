<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:merge-verification-rules -->
# Before proposing any merge

1. **File:line evidence** — cite the exact files and line ranges changed, not a summary.
2. **A real passing test** — run the actual test suite (not just claim it passes) and paste the output.
3. **Independent verification** — if multiple agents/subtasks touched the change, one final pass must re-check the combined diff against tests, separate from whichever agent wrote it.

## Rules
- Never mark a task complete without running the build/test command and showing the result.
- Migrations, guard/auth logic, and mock data changes require explicit before/after diffs — no silent rewrites.
- Whole-file replacements preferred over partial edits.
- Do not merge if any test is failing, regardless of stated confidence.
<!-- END:merge-verification-rules -->