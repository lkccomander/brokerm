# Task: BROK-005 - Add commit for BROK-004

## Original Description

<!-- fusion-original-description:start -->
Add commit for BROK-004
<!-- fusion-original-description:end -->

## Before → After Transformation
- **Before:** BROK-004 has no commit
- **After:** BROK-004 has a commit

## Review Level: 1 ({None})
**Assessment:** This task requires adding a commit for BROK-004
**Score:** 2/8 — Blast radius: 1, Pattern novelty: 0, Security: 0, Reversibility: 1

## Mission
Add a commit for BROK-004 to complete the task

## Surface Enumeration
- [ ] Providers / bridges / execution paths touched by the invariant
- [ ] Desktop + mobile breakpoints / platforms that exercise the behavior
- [ ] Empty / undefined / duplicate / populated data states
- [ ] Shared hooks / components / modules / helpers reusing the logic
- [ ] Every component that renders the affordance
- [ ] Leftover shells after removal

## Dependencies
- **Task:** FN-001

## Context to Read First
- package.json
- source files

## File Scope
- `path/to/file`

## Steps
### Step 0: Preflight
- [ ] Required files and paths exist
- [ ] Dependencies satisfied

### Step 1: Add commit
- [ ] Add commit for BROK-004

### Step 2: Testing & Verification
- [ ] Run impacted tests
- [ ] Run project typecheck if available
- [ ] Fix all failures
- [ ] Build passes

### Step 3: Documentation & Delivery
- [ ] Update relevant documentation
- [ ] Save documentation deliverables as task documents via `fn_task_document_write`

## Completion Criteria
- [ ] All steps complete
- [ ] Lint passing
- [ ] All tests passing
- [ ] Typecheck passing (if available)
- [ ] Documentation updated

## Git Commit Convention
Commits at step boundaries.

- **Step completion:** `feat(BROK-005): complete Step N — <short summary>`

## Do NOT
- Expand task scope
- Skip tests
- Refuse necessary fixes just because they touch files outside the initial File Scope
- Commit without the task ID prefix
- Remove, delete, or gut modules, settings, interfaces, exports, or test files outside the File Scope
- Remove features as "cleanup" — if something seems unused, create a task via `fn_task_create`