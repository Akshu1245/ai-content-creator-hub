# VORAX AI Video Editor - Technical Specification

## Overview
The VORAX AI Video Editor is an automated video editing system that uses AI to handle 90% of the editing work, while allowing users to manually fine-tune the final 10%. This feature alone makes VORAX the most powerful video creation tool in the market.

---

## Features

### 1. Auto Scene Detection
- **API**: Scene recognition using AI
- **How it works**: Analyzes video frames, detects scene changes
- **Output**: Array of timestamps with scene boundaries

### 2. AI Smart Transitions
- **Transitions Available**:
  - Fade In/Out
  - Cross Dissolve
  - Zoom In/Out
  - Slide Left/Right
  - Wipe
  - Blur
  - Glitch
- **Auto-selection**: AI selects best transition based on video mood

### 3. Auto Caption Generation
- **API**: Whisper (OpenAI) or AssemblyAI
- **Languages**: 100+ languages
- **Features**:
  - Auto-timestamps
  - Speaker identification
  - Caption styling (font, color, position)
  - 80+ caption templates
  - Emoji support

### 4. AI Face Tracking
- **API**: MediaPipe or AWS Rekognition
- **Features**:
  - Keep subject centered
  - Auto-zoom on speaker
  - Face blur for privacy
  - Face swap

### 5. Background Removal
- **API**: remove.bg API or RiveScript
- **Features**:
  - Remove background
  - Replace with images
  - Replace with videos
  - Solid color backgrounds

### 6. Auto Color Correction
- **Features**:
  - Auto white balance
  - Exposure correction
  - Contrast enhancement
  - Saturation adjustment
  - Preset filters (Cinematic, Vintage, B&W, etc.)

### 7. AI Audio Ducking
- **Features**:
  - Lower background music when voice is detected
  - Auto-detect speech segments
  - Smooth fade in/out
  - Volume balancing

### 8. Voice Enhancement
- **API**: Auphonic or Krisp
- **Features**:
  - Noise reduction
  - Echo removal
  - Volume normalization
  - EQ adjustment

---

## Edge Functions to Create

### 1. ai-video-editor
Main video editing orchestration

```typescript
// supabase/functions/ai-video-editor/index.ts
// Actions:
// - analyze: Returns scene list, audio segments, suggested edits
// - auto-edit: Applies all AI edits automatically
// - apply-effect: Apply single effect (transition, caption, etc.)
// - export: Render final video
```

### 2. detect-scenes
Scene detection using AI

```typescript
// supabase/functions/detect-scenes/index.ts
// Input: video_url
// Output: [{ start: 0, end: 5.2, type: "intro" }, ...]
```

### 3. generate-captions
Advanced caption generation

```typescript
// supabase/functions/generate-captions/index.ts
// Already exists - enhance with more features
```

### 4. remove-background
Background removal

```typescript
// supabase/functions/remove-background/index.ts
// Uses remove.bg or custom ML model
```

### 5. apply-transitions
Add transitions between clips

```typescript
// supabase/functions/apply-transitions/index.ts
// Input: clips[], transitions[]
// Output: video with transitions
```

### 6. color-correct
Auto color correction

```typescript
// supabase/functions/color-correct/index.ts
// Input: video_url, preset
// Output: color-corrected video
```

### 7. audio-ducking
Auto audio ducking

```typescript
// supabase/functions/audio-ducking/index.ts
// Input: video_url, voice_track
// Output: video with ducked audio
```

---

## Frontend Components

### 1. VideoEditor.tsx (Already exists)
Enhance with:
- Timeline with clips
- Preview player
- Effect controls

### 2. Timeline Component
- Visual clip representation
- Drag to reorder
- Trim handles
- Transition markers
- Caption track
- Audio waveform

### 3. Effects Panel
- Transition selector
- Caption style picker
- Filter presets
- Text overlays

### 4. Export Panel
- Quality options (720p, 1080p, 4K)
- Format options (MP4, WebM, MOV)
- Platform presets (YouTube, Instagram, TikTok)

---

## Data Model

```typescript
interface VideoProject {
  id: string
  user_id: string
  source_videos: VideoClip[]
  edits: Edit[]
  timeline: Timeline
  export_settings: ExportSettings
  status: 'editing' | 'processing' | 'completed' | 'exported'
}

interface VideoClip {
  id: string
  url: string
  start_time: number
  end_time: number
  duration: number
  scenes: Scene[]
  audio_segments: AudioSegment[]
}

interface Scene {
  start: number
  end: number
  type: 'intro' | 'main' | 'transition' | 'outro'
}

interface Timeline {
  tracks: Track[]
}

interface Track {
  id: string
  type: 'video' | 'audio' | 'caption'
  clips: TrackClip[]
}

interface Edit {
  id: string
  type: 'transition' | 'caption' | 'effect' | 'text' | 'filter'
  params: Record<string, any>
  timestamp: number
}

interface ExportSettings {
  resolution: '720p' | '1080p' | '4k'
  format: 'mp4' | 'webm' | 'mov'
  quality: 'low' | 'medium' | 'high'
  platform: 'youtube' | 'instagram' | 'tiktok' | 'linkedin'
}
```

---

## Manual Override Features

Users can manually edit after AI does 90%:

1. **Trim Clips**: Drag handles to adjust start/end
2. **Reorder Clips**: Drag to change order
3. **Add Transitions**: Manual transition selection
4. **Edit Captions**: Click to edit text/timing
5. **Add Text**: Custom text overlays
6. **Adjust Audio**: Manual volume control
7. **Apply Filters**: Override AI color correction
8. **Remove/Add Clips**: Full manual control

---

## Pricing Impact

Since students will use this:
- Free tier: 3 AI edits/month (watermark)
- Student ($9.99/mo): Unlimited AI edits, no watermark
- Pro ($24.99/mo): All + team features

The AI editor is our KEY DIFFERENTIATOR - no competitor has this level of automation!

---

## Next Implementation Steps

1. Create ai-video-editor edge function
2. Enhance VideoEditor.tsx with timeline
3. Add effect panels
4. Implement manual override UI
5. Connect to rendering pipeline
