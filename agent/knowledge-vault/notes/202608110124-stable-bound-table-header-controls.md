---
title: "Keep bound table header controls stable"
type: approach
scope: project
created: 2026-08-11
source: "Table column Properties control"
---

# Keep bound table header controls stable

## Trigger

When a Table header creator receives a component that binds live Table state, and that component owns a dropdown or other local UI state.

## Approach

1. Keep the complete ordered column array as the canonical state. Store visibility on each column and derive the rendered columns with a filter.
2. Merge header drag results back into the complete array so hidden columns are not lost.
3. Give the injected component a stable React component identity. Store its current bound props in a ref, and let the stable component read that ref.
4. Persist the complete array, including visibility, and restore current column definitions in the saved order. Append new definitions and discard removed ones.
5. Test dropdown continuity, pointer visibility changes, keyboard ordering, accessibility, and saved-state migration.

## Why it worked

A component function created during each header render has a new React type. React then remounts it and closes its dropdown after each state update. A stable component type with ref-backed props preserves local UI state while it still reads current columns and setters. Keeping hidden columns in canonical state also prevents reorder and persistence operations from deleting information.

## Reuse checklist

- [ ] Keep full state separate from the rendered subset
- [ ] Preserve injected component identity across parent renders
- [ ] Merge subset reorder operations into canonical state
- [ ] Persist enough information to restore hidden items
- [ ] Verify pointer and keyboard workflows
