

# Fix: Video Generation Fails with JSON2Video

## Root Cause

The edge function logs reveal the exact error:
```text
Scene 1, element 1: [404] "Not found" when rendering text/style1
```

The `style` property is set to `"style1"` which is invalid. JSON2Video uses numeric style codes (e.g., `"001"`). The video job is created successfully but immediately fails during rendering.

**Secondary issue:** Line 153 in NewProject.tsx still says "Generating video with Kling AI..." — leftover branding.

## Changes

### 1. Fix edge function (`supabase/functions/generate-video/index.ts`)
- Change `style: "style1"` to `style: "001"` (the default static text style)
- Remove the invalid `position: "center"` property (not a valid JSON2Video text element property — centering is the default behavior)
- Use `resolution: "full-hd"` string instead of raw pixel dimensions (JSON2Video supports named resolutions)

### 2. Fix leftover Kling reference (`src/pages/NewProject.tsx`)
- Line 153: Change `'Generating video with Kling AI...'` to `'Generating video...'`

These are two small, targeted fixes. The polling logic and status mapping are already correct.

