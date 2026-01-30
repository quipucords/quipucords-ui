# Vendored React Table Batteries - Custom Changes

This directory contains vendored code from external packages that are no longer maintained upstream.

## Changes Made

### react-table-batteries
- **Fixed ToolbarBulkSelector "Select none" functionality** - See PR #668
  - File: `tackle2-ui-legacy/components/ToolbarBulkSelector.tsx`

- **PatternFly v5 to v6 Upgrade Changes** - See PR #664
  - **Component API updates**: Updated to use new PatternFly v6 component APIs
    - Files: Multiple component files in `vendor/react-table-batteries/` directory
  - **Import pattern changes**: Updated component imports to match v6 patterns
  - **CSS class migrations**: Changed CSS class prefixes from `pf-v5-` to `pf-v6-`
  - **Console statement line shifts**: Updated positions due to code changes
    - `hooks/selection/useSelectionDerivedState.ts` (console.warn at line 154)
    - `hooks/storage/useStorage.ts` (console.error at lines 14 and 40)

- **Ported isShiftKeyHeld from State to Ref** - See PR #676
  - File: `hooks/selection/useSelectionPropHelpers.ts`

- **Reset table page back to 1 on sort or filter change** - See PR #678
  - File: `src/vendor/react-table-batteries/hooks/useTableState.ts`

- **Respect `sort.initialSort` definition in tables** - See PR #834
  - File: `src/vendor/react-table-batteries/hooks/sorting/useSortState.ts`
