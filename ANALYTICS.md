# Google Analytics Integration Guide

This project now includes comprehensive Google Analytics tracking for user behavior analysis. Here's what's automatically tracked and how to add custom tracking.

## Automatically Tracked Events

### 1. Page Views & Navigation
- **Page visits**: Every route change is tracked with page path, title, and URL
- **Time spent on pages**: Tracks how long users spend on each page
- **Navigation**: Tracks when users navigate between pages

### 2. User Interactions
- **Button clicks**: All button interactions are tracked
- **Link clicks**: Article card clicks, navigation links, etc.
- **Language toggles**: When users switch between Tamil and English

### 3. Content Engagement
- **Article views**: When users open specific articles
- **Scroll tracking**: Tracks scroll milestones (25%, 50%, 75%, 90%)
- **Reading engagement**: Time spent reading content

## Manual Tracking Usage

### Environment Variables Setup

First, configure your Google Analytics tracking ID:

```bash
# In .env, .env.local, or .env.production
VITE_GA_TRACKING_ID=G-XXXXXXXXXX  # Your GA4 Measurement ID
VITE_DISABLE_GA=false             # Enable/disable tracking
```

### Using the useEasyTracking Hook

```tsx
import { useEasyTracking } from '../utils/trackingUtils';

const MyComponent = () => {
  const { trackButton, trackEngagement, trackDownload } = useEasyTracking();

  return (
    <div>
      {/* Track button clicks */}
      <button onClick={() => trackButton('subscribe-button')}>
        Subscribe
      </button>

      {/* Track downloads */}
      <a href="/file.pdf" onClick={() => trackDownload('guide.pdf', 'pdf')}>
        Download Guide
      </a>

      {/* Track engagement milestones */}
      <button onClick={() => trackEngagement('completed_reading', { article_id: 'article-1' })}>
        Mark as Read
      </button>
    </div>
  );
};
```

### Using the useGoogleAnalytics Hook

```tsx
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

const MyComponent = () => {
  const { trackEvent, trackButtonClick, trackArticleView } = useGoogleAnalytics();

  // Custom event tracking
  const handleCustomAction = () => {
    trackEvent('custom_action', {
      action_type: 'special_button',
      user_segment: 'premium'
    });
  };

  return (
    <button onClick={handleCustomAction}>Custom Action</button>
  );
};
```

### Adding Data Attributes for Global Tracking

You can add `data-track` attributes to any element for automatic tracking:

```tsx
<button 
  data-track="newsletter-signup"
  data-track-data='{"source": "homepage", "campaign": "winter2024"}'
>
  Sign Up
</button>
```

## Available Tracking Functions

### Basic Tracking
- `trackEvent(eventName, parameters)` - Track any custom event
- `trackButtonClick(buttonName, additionalData)` - Track button interactions

### Specialized Tracking
- `trackLanguageChange(fromLang, toLang)` - Track language switches
- `trackArticleView(articleId, articleTitle)` - Track article reads
- `trackSearchQuery(query, resultsCount)` - Track search usage

### Easy Tracking Utilities
- `trackButton(buttonName, additionalData)` - Simple button tracking
- `trackForm(formName, additionalData)` - Track form submissions
- `trackDownload(fileName, fileType)` - Track file downloads
- `trackMedia(mediaName, action)` - Track video/audio interactions
- `trackEngagement(milestone, additionalData)` - Track user engagement

## Event Categories

Events are organized into these categories:
- **navigation**: Page views, route changes
- **button_interaction**: Button clicks, UI interactions
- **engagement**: Time spent, scroll depth, reading completion
- **language**: Language switching
- **content**: Article views, content interactions
- **search**: Search queries and results
- **form**: Form submissions
- **download**: File downloads
- **media**: Video/audio interactions

## Data Structure

Each event includes:
- `event_category`: Type of interaction
- `event_label`: Specific identifier
- `page_path`: Current page when event occurred
- Custom parameters specific to the event type

## Production Usage

The tracking automatically:
- Only runs when gtag is available
- Includes error handling for missing data
- Provides fallback values for undefined parameters
- Works in both development and production

## Privacy Considerations

The tracking:
- Uses Google Analytics 4 (GA4)
- Respects user privacy settings
- Doesn't collect personally identifiable information
- Can be disabled by users with ad blockers

## Viewing Analytics Data

In Google Analytics 4:
1. Go to **Events** in the left sidebar
2. View **All events** to see custom events
3. Use **Engagement** reports for time-based metrics
4. Check **Pages and screens** for page view data

## Example Events You'll See

- `page_view`: User visits a page
- `button_click`: User clicks any button
- `article_view`: User opens an article
- `language_change`: User switches language
- `page_time_spent`: Time spent on each page
- `scroll_milestone`: User scrolls to 25%, 50%, 75%, 90%
- `article_card_click`: User clicks on article cards

# 🔧 Disabling Google Analytics

You can disable Google Analytics tracking in several ways:

## 1. Environment Variables

### Development Mode (Automatic)
```bash
# Automatically disabled in development
npm run dev
```

### Environment Variable
```bash
# In .env file or .env.local
VITE_GA_TRACKING_ID=G-XXXXXXXXXX  # Your tracking ID
VITE_DISABLE_GA=true              # Disable tracking
```

### Production Build with Different Tracking ID
```bash
VITE_GA_TRACKING_ID=G-PROD123 VITE_DISABLE_GA=false npm run build
```

## 2. Runtime Control

### Disable Globally at Runtime
```typescript
import { disableGoogleAnalytics, enableGoogleAnalytics } from '../utils/analyticsControl';

// Disable tracking
disableGoogleAnalytics();

// Enable tracking
enableGoogleAnalytics();
```

### Using the Control Hook
```tsx
import { useGoogleAnalyticsControl } from '../utils/analyticsControl';

const SettingsComponent = () => {
  const { isEnabled, toggle, status } = useGoogleAnalyticsControl();

  return (
    <div>
      <p>Analytics: {isEnabled ? 'Enabled' : 'Disabled'}</p>
      <button onClick={toggle}>
        {isEnabled ? 'Disable' : 'Enable'} Analytics
      </button>
      
      {/* Debug info */}
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
};
```

### Browser Console Control
```javascript
// Disable from browser console
window.GA_TRACKING_DISABLED = true;

// Enable from browser console  
window.GA_TRACKING_DISABLED = false;
```

## 3. Check Tracking Status

```typescript
import { getTrackingStatus, isGoogleAnalyticsEnabled } from '../utils/analyticsControl';

// Simple check
const enabled = isGoogleAnalyticsEnabled();

// Detailed status
const status = getTrackingStatus();
console.log(status);
// {
//   enabled: false,
//   gtagAvailable: true,
//   environmentDisabled: true,
//   developmentMode: true,
//   manuallyDisabled: false
// }
```

## 4. Priority Order

Tracking is disabled if **any** of these conditions are true:
1. `import.meta.env.MODE === 'development'` (Development mode)
2. `import.meta.env.VITE_DISABLE_GA === 'true'` (Environment variable)
3. `window.GA_TRACKING_DISABLED === true` (Runtime flag)
4. `window.gtag` is not available (Script not loaded)

## 5. User Privacy Control

You can add a privacy toggle to your UI:

```tsx
import { useGoogleAnalyticsControl } from '../utils/analyticsControl';

const PrivacySettings = () => {
  const { isEnabled, toggle } = useGoogleAnalyticsControl();

  return (
    <label>
      <input 
        type="checkbox" 
        checked={isEnabled} 
        onChange={toggle}
      />
      Allow Analytics Tracking
    </label>
  );
};
```

This respects user privacy and gives them control over their data.

## 📋 Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_GA_TRACKING_ID` | Google Analytics 4 Measurement ID | `G-CVRLXZ6V3C` | `G-XXXXXXXXXX` |
| `VITE_DISABLE_GA` | Disable all tracking | `false` | `true` |

### Environment Files

- **`.env.development`** - Development settings (GA disabled by default)
- **`.env.production`** - Production settings (GA enabled with your tracking ID)
- **`.env.local`** - Local overrides (not committed to git)

### Netlify/Deployment Setup

```toml
# netlify.toml
[build.environment]
  VITE_GA_TRACKING_ID = "G-XXXXXXXXXX"
  VITE_DISABLE_GA = "false"
```
