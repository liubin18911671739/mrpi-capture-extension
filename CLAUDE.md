# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mr.π Capture is a Chrome browser extension (Manifest V3) that enables one-click capture of web page information to Mr.π AI Studio. The extension allows users to save URLs with titles, notes, and categorization tags to a backend API.

## Core Architecture

### Extension Components

This is a **Manifest V3 Chrome Extension** with three primary surfaces:

1. **Popup UI** (`popup.html` + `popup.js`)
   - Auto-loads current tab URL and title via `chrome.tabs.query`
   - Captures user input: editable title, notes, and category tags
   - Sends POST requests to backend API with Bearer token authentication
   - Manages form state and user feedback

2. **Options Page** (`options.html` + `options.js`)
   - Manages API Token configuration
   - Uses `chrome.storage.sync` for cross-device token synchronization
   - Includes show/hide password toggle for token visibility

3. **Service Worker** (`background.js`)
   - Currently minimal: handles installation events and message routing
   - Extension point for future features (context menus, notifications, etc.)

### Data Flow

```
User clicks extension icon
  → Popup loads current tab info (chrome.tabs.query)
  → User edits/adds data and selects tag
  → Reads API token from chrome.storage.sync
  → POST to https://api.mrpi.ai/api/captured-items
  → Shows success/error message
  → Auto-closes popup on success
```

### API Integration

**Endpoint**: `https://api.mrpi.ai/api/captured-items`

**Request Format**:
```json
{
  "url": "https://example.com",
  "title": "Page Title",
  "note": "User's notes",
  "tags": ["Product"],
  "source": "chrome_extension"
}
```

**Authentication**: Bearer token in Authorization header, stored in `chrome.storage.sync.apiToken`

**Tag Options**: Product, Competitor, Content, Inspiration (defined in popup.html lines 56-61)

## Development Workflow

### Loading the Extension Locally

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" and select the project root directory
4. Extension appears in toolbar with icon
5. **Important**: After modifying `manifest.json`, `popup.js`, or any extension file, click the reload button (🔄) on the extension card to apply changes

### Testing with Mock API Server

For local testing without a live backend:

1. **Start Mock Server**:
   ```bash
   node mock-api-server.js
   ```
   Server runs on `http://localhost:3000` and logs all received data to console.

2. **Configure Extension for Local Testing**:
   - The extension is already configured to use `http://localhost:3000` (see `popup.js:14`)
   - For production, change `BASE_URL` to `'https://api.mrpi.ai'`
   - `manifest.json` includes both localhost and production permissions

3. **Testing Flow**:
   - Start mock server (keep terminal open)
   - Load/reload extension in Chrome
   - Configure any API token (>10 chars) in options
   - Capture a webpage - server console shows received data
   - Visit `http://localhost:3000/health` to verify server is running

### Configuring for Testing

1. Click extension icon → "⚙️ 配置 API Token" link
2. Enter API Token in options page (mock server accepts any token >10 chars)
3. Save settings (stored in `chrome.storage.sync`)
4. Test by opening any webpage and using the popup
5. **First-time UX**: If no token configured, popup shows blue info banner: "👋 首次使用？请先点击下方'⚙️ 配置 API Token'进行设置"

### Debugging

- **Popup Console**: Right-click popup → Inspect → Console tab
- **Service Worker Console**: `chrome://extensions/` → Click "Service Worker" link under extension
- **Options Page Console**: Right-click options page → Inspect → Console tab
- **Mock Server Logs**: Check terminal running `mock-api-server.js` for API request details

Each surface has its own DevTools instance - they don't share console output.

### Code Modification Points

**Change API endpoint**: Edit `API_CONFIG` object in `popup.js:12-18`

**Modify available tags**: Edit `<select id="tag">` options in `popup.html:56-61`, then update any validation logic if needed

**Adjust token validation**: Modify `handleSubmit` in `options.js:53-93` (currently just checks length > 10)

## Technical Constraints

### Manifest V3 Requirements

- **No inline scripts**: All JavaScript must be in external files
- **Service Worker lifecycle**: Background script can be terminated by Chrome at any time, must handle state properly
- **Permissions**: Currently uses minimal permissions (`activeTab`, `storage`) and host permissions for `https://api.mrpi.ai/*`
- **CSP restrictions**: Content Security Policy is strict by default

### Chrome Extension APIs Used

- `chrome.tabs.query()`: Get current tab URL and title
- `chrome.storage.sync`: Store and retrieve API token (auto-syncs across user's devices)
- `chrome.runtime.openOptionsPage()`: Open options page from popup
- `chrome.runtime.onInstalled`: Installation/update events in service worker
- `chrome.runtime.onMessage`: Message passing between extension components

### Cross-Origin Considerations

Backend API must set appropriate CORS headers to accept requests from `chrome-extension://` origins. If CORS issues occur, this is a backend configuration problem, not fixable in the extension code.

## Common Development Patterns

### Reading from Storage

```javascript
const { apiToken } = await chrome.storage.sync.get('apiToken');
```

### Writing to Storage

```javascript
await chrome.storage.sync.set({ apiToken: 'value' });
```

### Getting Current Tab Info

```javascript
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const url = tab.url;
const title = tab.title;
```

### Error Handling Pattern

All async operations use try-catch blocks. Network errors (fetch failures) are caught and user-friendly messages are displayed via `showMessage(message, 'error')`.

## Known Extension Points

The README.md suggests these future enhancements:

1. **Multi-tag selection**: Change `<select>` to support multiple tags or use checkboxes
2. **Screenshot capture**: Use `chrome.tabs.captureVisibleTab()` to capture visible tab
3. **Content extraction**: Use `chrome.scripting.executeScript()` to inject script and extract meta tags or page summary
4. **Context menu integration**: Add `chrome.contextMenus.create()` in background.js for right-click save
5. **Richer tag taxonomy**: Expand beyond the four current categories

## File Organization

- `manifest.json`: Extension metadata and permissions
- `background.js`: Service worker (currently minimal)
- `popup.html/js`: Main capture interface
- `options.html/js`: Settings/configuration page
- `icons/`: PNG icons (16x16, 48x48, 128x128 required)
- `mock-api-server.js`: Node.js mock server for local testing (not part of extension)
- `TEST_GUIDE.md`: Comprehensive testing scenarios and checklist
- `QUICK_TEST_GUIDE.md`: Quick start guide for testing with mock server
- `IMPLEMENTATION_LOG.md`: Development history and implementation details

## Recent Improvements (2025-11-09)

### First-Time User Experience
- **Auto-detection of missing token**: Popup now checks for API token on load
- **Friendly guidance**: Blue info banner appears when token not configured
- **New message type**: Added `.message.info` CSS class for informational messages (blue theme)
- **Function**: `checkApiToken()` in `popup.js:175-189` handles detection and display

### Enhanced Message System
- **Three message types**:
  - `success` (green) - auto-hides after 3s
  - `error` (red) - persists until dismissed
  - `info` (blue) - persists until dismissed
- **Updated**: `showMessage(message, type)` function supports all three types

## Important Notes

- **Token Security**: API tokens are stored in `chrome.storage.sync`, which is reasonably secure. Never hardcode tokens in source files.
- **Console Logs**: Production code contains `console.log` statements. Before publishing, either remove these or wrap them in a debug flag.
- **Icon Files**: Project requires PNG icons at three sizes. Icons are already generated at `icons/icon{16,48,128}.png`.
- **No Build Process**: This is vanilla JavaScript - no bundler, no transpilation, no npm dependencies. Just load the directory directly into Chrome.
- **API Configuration**: Currently points to `http://localhost:3000` for testing. Change to `https://api.mrpi.ai` for production.
