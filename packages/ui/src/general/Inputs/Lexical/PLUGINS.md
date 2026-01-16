# Lexical Editor Plugins Documentation

This document provides detailed information about all plugins available in the enhanced Lexical editor.

## Plugin Directory

```
plugins/
├── AutoFocusPlugin.tsx              - Auto-focus editor on mount
├── CharacterCountPlugin.tsx         - Display character count
├── CharacterCountPlugin.scss
├── ClearEditorPlugin.tsx            - Clear editor command
├── CodeHighlightPlugin.tsx          - Code syntax highlighting
├── FloatingLinkEditorPlugin.tsx     - Floating link editor
├── FloatingLinkEditorPlugin.scss
├── FloatingTextFormatToolbarPlugin.tsx  - Floating format toolbar
├── FloatingTextFormatToolbarPlugin.scss
├── MaxLengthPlugin.tsx              - Character limit enforcement
├── TreeViewPlugin.tsx               - Debug tree view
├── TreeViewPlugin.scss
└── index.ts                         - Plugin exports
```

## Core Plugins (Always Active)

### 1. HistoryPlugin
**Source:** `@lexical/react/LexicalHistoryPlugin`

Provides undo/redo functionality.

**Features:**
- Undo with Ctrl/Cmd + Z
- Redo with Ctrl/Cmd + Shift + Z
- Tracks editor state history
- Supports collaborative editing

---

### 2. ListPlugin
**Source:** `@lexical/react/LexicalListPlugin`

Enables list functionality.

**Features:**
- Bullet lists
- Numbered lists
- Nested lists
- List item management

---

### 3. CheckListPlugin
**Source:** `@lexical/react/LexicalCheckListPlugin`

Interactive checkbox lists.

**Features:**
- Todo lists with checkboxes
- Toggle check state with click
- Keyboard navigation
- Strike-through completed items

---

### 4. LinkPlugin
**Source:** `@lexical/react/LexicalLinkPlugin`

Basic link support.

**Features:**
- Insert/edit links
- Link validation
- TOGGLE_LINK_COMMAND support

---

### 5. AutoLinkPlugin
**Source:** `@lexical/react/LexicalAutoLinkPlugin`

Automatically detects and creates links.

**Features:**
- Auto-detect URLs (http://, https://, www.)
- Auto-detect email addresses
- Real-time detection as you type
- Configurable matchers

**Configuration:**
```typescript
const MATCHERS = [
  (text: string) => {
    // URL matcher
    const match = URL_MATCHER.exec(text);
    if (match) {
      return {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[0].startsWith("http") ? match[0] : `https://${match[0]}`
      };
    }
    return null;
  }
];
```

---

### 6. ClickableLinkPlugin
**Source:** `@lexical/react/LexicalClickableLinkPlugin`

Makes links clickable.

**Features:**
- Click to open links
- Disabled when editor is disabled
- Opens in new tab
- Prevents accidental navigation while editing

---

### 7. TabIndentationPlugin
**Source:** `@lexical/react/LexicalTabIndentationPlugin`

Tab key indentation support.

**Features:**
- Tab to indent
- Shift+Tab to outdent
- Works in lists
- Preserves indentation in code blocks

---

### 8. HorizontalRulePlugin
**Source:** `@lexical/react/LexicalHorizontalRulePlugin`

Horizontal rule (HR) support.

**Features:**
- Insert horizontal rules
- Markdown shortcut: `---`
- INSERT_HORIZONTAL_RULE_COMMAND

---

### 9. MarkdownShortcutPlugin
**Source:** `@lexical/react/LexicalMarkdownShortcutPlugin`

Markdown shortcuts that auto-convert.

**Features:**
- `# ` → H1
- `## ` → H2
- `### ` → H3
- `- ` or `* ` → Bullet list
- `1. ` → Numbered list
- `[] ` → Checklist
- `> ` → Block quote
- ``` ` ` ` ``` → Code block
- `---` → Horizontal rule

---

### 10. HashtagPlugin
**Source:** `@lexical/react/LexicalHashtagPlugin`

Hashtag support.

**Features:**
- Auto-detect #hashtags
- Styled differently
- Clickable (if handler added)
- Real-time detection

---

### 11. ClearEditorPlugin
**Source:** Custom

Provides command to clear editor.

**Features:**
- CLEAR_EDITOR_COMMAND support
- Clears all content
- Resets to single paragraph
- Can be triggered programmatically

**Usage:**
```typescript
editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
```

---

## Custom Plugins

### 12. FloatingLinkEditorPlugin
**Source:** Custom

Floating UI for link editing.

**Features:**
- Appears when link is selected
- Edit URL inline
- Remove link button
- Opens link in new tab
- Clean, minimal UI

**UI Elements:**
- URL input field
- Edit button (✎)
- Remove button (🗑)
- Confirm button (✓)
- Cancel button (✕)

---

### 13. FloatingTextFormatToolbarPlugin
**Source:** Custom
**Prop:** `withFloatingToolbar`

Floating toolbar on text selection.

**Features:**
- Appears when text is selected
- Quick format buttons
- Auto-positions above selection
- Smooth animations
- Portal-based rendering

**Formats Available:**
- Bold (B)
- Italic (I)
- Underline (U)
- Strikethrough (S)
- Code (</>)
- Link (🔗)

**Behavior:**
- Shows only when text is selected
- Hides when selection is cleared
- Repositions on scroll/resize
- Non-intrusive design

---

### 14. CodeHighlightPlugin
**Source:** Custom
**Prop:** `withCodeHighlight` (default: true)

Syntax highlighting for code blocks.

**Features:**
- Uses Prism for highlighting
- Automatic language detection
- Support for multiple languages
- Real-time highlighting

**Supported Languages:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- SQL
- And more...

---

### 15. MaxLengthPlugin
**Source:** Custom
**Prop:** `maxLength`

Enforces character limit.

**Features:**
- Hard character limit
- Prevents typing beyond limit
- Handles paste operations
- Restores previous state if exceeded
- Works with undo/redo

**Implementation:**
- Uses RootNode transform
- Trims excess characters
- Maintains cursor position
- No data loss

**Usage:**
```tsx
<Lexical maxLength={1000} />
```

---

### 16. CharacterCountPlugin
**Source:** Custom
**Prop:** `withCharacterCount`

Displays character count.

**Features:**
- Real-time count
- Shows current / max (if maxLength set)
- Visual indicator when over limit
- Non-intrusive positioning

**Display:**
- Bottom-right corner
- Semi-transparent background
- Red when over limit
- Updates on every change

**Usage:**
```tsx
<Lexical 
  withCharacterCount={true}
  maxLength={500}
/>
```

---

### 17. TreeViewPlugin
**Source:** Custom
**Prop:** `withTreeView` (default: false)

Debug view of Lexical AST.

**Features:**
- Shows node tree structure
- Expandable/collapsible
- Time travel debugging
- Node type visualization

**Use Cases:**
- Development debugging
- Understanding node structure
- Testing custom nodes
- Learning Lexical internals

**⚠️ Recommendation:**
Only enable in development. Not intended for production.

**Usage:**
```tsx
<Lexical withTreeView={true} />
```

---

### 18. AutoFocusPlugin
**Source:** Custom
**Prop:** `autoFocus` (default: false)

Auto-focus editor on mount.

**Features:**
- Focuses editor immediately
- Sets cursor in editor
- Useful for forms
- One-time action

**Usage:**
```tsx
<Lexical autoFocus={true} />
```

---

## Plugin Communication

Plugins communicate through:

1. **Commands** - Lexical command system
2. **Node Transforms** - React to node changes
3. **Update Listeners** - React to editor updates
4. **Shared Context** - React context for state

### Common Commands

```typescript
// Clear editor
editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);

// Format text
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");

// Toggle link
editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://example.com");

// Insert horizontal rule
editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);

// Insert list
editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);

// Indent/Outdent
editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
```

---

## Creating Custom Plugins

To create a custom plugin:

```typescript
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function MyCustomPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register listeners, commands, transforms
    return editor.registerUpdateListener(({ editorState }) => {
      // React to changes
    });
  }, [editor]);

  return null;
}
```

### Plugin Best Practices

1. **Always return cleanup function** from useEffect
2. **Use mergeRegister** for multiple registrations
3. **Keep plugins focused** on single responsibility
4. **Return null** for non-UI plugins
5. **Use portals** for floating UI elements
6. **Memoize** expensive calculations
7. **Test thoroughly** with different scenarios

---

## Performance Considerations

- **Update Debouncing:** OnChangePlugin debounces by 300ms
- **Conditional Rendering:** Optional plugins only load when enabled
- **Lazy Loading:** Consider code-splitting for heavy plugins
- **Memoization:** Use React.memo for plugin components
- **Efficient Selectors:** Use specific selectors in node transforms

---

## Future Plugin Ideas

From Lexical Playground:
- **TablePlugin** - Rich table editing
- **ImagePlugin** - Image upload and management
- **EmojiPlugin** - Emoji picker
- **MentionPlugin** - @mentions functionality
- **EquationPlugin** - Math equations (KaTeX)
- **CollapsiblePlugin** - Collapsible sections
- **TwitterPlugin** - Embed tweets
- **YouTubePlugin** - Embed videos
- **FigmaPlugin** - Embed Figma files
- **ExcalidrawPlugin** - Drawing integration
- **DraggableBlockPlugin** - Drag & drop blocks
- **ComponentPickerPlugin** - Slash commands menu

---

## Resources

- [Lexical Documentation](https://lexical.dev/)
- [Lexical Playground Source](https://github.com/facebook/lexical/tree/main/packages/lexical-playground)
- [Plugin API Reference](https://lexical.dev/docs/concepts/plugins)
- [Creating Custom Nodes](https://lexical.dev/docs/concepts/nodes)
