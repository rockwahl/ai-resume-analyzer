# System Guide

This document tracks the components and functionality in the AI Resume Analyzer application.

## Components

### ScoreBadge
- **Location**: `app/components/ScoreBadge.tsx`
- **Purpose**: Displays a colored badge with a label based on a score value
- **Props**: 
  - `score` (number): The score to evaluate
- **Behavior**:
  - Score ≥ 80: Green badge with "Strong" label
  - Score ≥ 50: Yellow badge with "Needs Improvement" label  
  - Score < 50: Red badge with "Needs Work" label
- **Styling**: Uses Tailwind utility classes for dynamic color theming
- **Usage**: Used in the Summary component's Category section to show performance indicators

### Summary
- **Location**: `app/components/Summary.tsx`
- **Purpose**: Displays overall resume score and individual category scores
- **Props**:
  - `feedback` (Feedback): Contains score data for different resume categories
- **Components Used**: ScoreGauge, ScoreBadge
- **Features**: Shows overall score gauge and individual category scores with color-coded badges

### ScoreGauge
- **Location**: `app/components/ScoreGauge.tsx`
- **Purpose**: Displays a circular gauge showing the overall resume score
- **Props**:
  - `score` (number): The overall score to display

### Category (within Summary)
- **Purpose**: Renders individual resume category scores
- **Props**:
  - `title` (string): Category name
  - `score` (number): Category score
- **Features**: Shows category title with ScoreBadge and numerical score

### ATS
- **Location**: `app/components/ATS.tsx`
- **Purpose**: Displays ATS (Applicant Tracking System) score with detailed feedback and suggestions
- **Props**:
  - `score` (number): ATS score from 0-100
  - `suggestions` (Suggestion[]): Array of improvement tips
- **Features**:
  - Dynamic gradient background based on score (green/yellow/red)
  - Score-appropriate icon (ats-good.svg, ats-warning.svg, ats-bad.svg)
  - Explanatory text about ATS systems
  - Interactive suggestions list with check/warning icons
  - Encouraging closing message based on score level
- **Scoring Logic**:
  - Score ≥ 80: Green gradient, good icon, positive message
  - Score > 60: Yellow gradient, warning icon, improvement message
  - Score ≤ 60: Red gradient, bad icon, encouraging improvement message

### Details
- **Location**: `app/components/Details.tsx`
- **Purpose**: Displays detailed feedback for each resume category in an accordion format
- **Props**:
  - `feedback` (Feedback): Complete feedback object with scores and tips for all categories
- **Features**:
  - Accordion interface with 4 main categories (Tone & Style, Content, Structure, Skills)
  - Each section shows category title with ScoreBadge
  - Two-column grid layout for tips overview
  - Detailed explanation boxes for each tip
  - Color-coded styling for good vs improve tips
- **Helper Components**:
  - **ScoreBadge**: Reusable badge component with same scoring logic as other components
  - **CategoryHeader**: Renders category title and score badge side by side
  - **CategoryContent**: Displays tips in grid layout and detailed explanations
- **Accordion Features**:
  - Multiple sections can be open simultaneously
  - Hover effects and smooth transitions
  - Clean, organized layout for easy navigation



## AI Analysis Configuration

### Prompt Engineering
- **Location**: `constants/index.ts`
- **Purpose**: Configure AI instructions for resume analysis
- **Features**:
  - Uses placeholder format instead of literal examples to prevent AI from copying example content
  - Clear instructions to analyze actual resume content
  - Structured JSON format with descriptive placeholders
  - Emphasis on analyzing the uploaded PDF file specifically
- **Format**: Uses `[PLACEHOLDER_TEXT]` format to guide AI without providing literal content to copy

### AI Model Configuration
- **Location**: `app/lib/puter.ts`
- **Purpose**: Configure high-quality AI models for resume analysis
- **Primary Model**: `claude-opus-4` - Highest quality Claude model for complex analysis with vision capabilities
- **Fallback Models**: 
  - `claude-sonnet-4` - Excellent for complex analysis tasks with vision capabilities
  - `gpt-4o` - Strong vision and analysis capabilities as final fallback
- **Features**: Multiple fallback options to ensure analysis completion with highest quality primary model

### Wipe/Manage Page
- **Location**: `app/routes/wipe.tsx`
- **Purpose**: Manage and delete individual resumes or clear all data
- **Features**:
  - **Individual Resume Management**: View and delete specific resumes
  - **Bulk Delete Option**: Delete all resumes at once with confirmation
  - **Resume Information Display**: Shows company name, job title, and resume ID
  - **Navigation Integration**: Includes navbar for easy navigation back to home
  - **Loading States**: Proper loading indicators and error handling
  - **Confirmation Dialogs**: Prevents accidental deletions
  - **View Resume Link**: Quick access to view individual resume analysis
- **Actions**:
  - **View**: Navigate to resume analysis page
  - **Delete Individual**: Remove specific resume with confirmation
  - **Delete All**: Clear all resumes with double confirmation
- **Styling**: Consistent with app design using Tailwind CSS classes

## Technical Notes

### KV Store Implementation
- **Location**: `app/lib/puter.ts`
- **Key Detail**: Puter KV store uses `del()` method, not `delete()` for deletion operations
- **File Cleanup**: Puter automatically cleans up uploaded files, so file deletion errors are normal and expected
- **Error Handling**: File deletion failures are gracefully handled since KV entry deletion is the critical operation 