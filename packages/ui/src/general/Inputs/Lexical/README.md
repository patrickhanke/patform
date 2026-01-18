# Lexical Editor Component

A feature-rich Lexical editor component with Playground-inspired functionality.

## Features

### Insert Toolbar Buttons (NEW!)
When `withInsertMenu={true}`, these buttons appear in the toolbar:
- **Horizontal Rule (—)** - Visual separators
- **Page Break (📄)** - Page breaks for printing
- **Image (🖼️)** - Insert images from URLs
- **Table (📊)** - Insert tables with customizable rows/columns
- **Columns (⚏ ▼)** - Multi-column layouts (2, 3, or 4 columns) 🆕
- **YouTube (▶️)** - Embed YouTube videos
- **Equation (∑)** - LaTeX mathematical equations

### Rich Text Formatting
- **Bold** (Ctrl/Cmd + B)
- *Italic* (Ctrl/Cmd + I)
- <u>Underline</u> (Ctrl/Cmd + U)
- ~~Strikethrough~~
- `Inline Code`

### Block Formatting
- Headings (H1, H2, H3)
- Block quotes
- Code blocks with syntax highlighting
- Horizontal rules

### Lists
- Bulleted lists
- Numbered lists
- **Checklists** with interactive checkboxes
- Nested lists
- Indent/Outdent support

### Links & URLs
- Insert and edit links
- Auto-detect URLs and emails
- Clickable links (when not editing)
- Floating link editor for easy management

### Markdown Support
- Type markdown shortcuts and they'll auto-convert:
  - `# ` → Heading 1
  - `## ` → Heading 2
  - `### ` → Heading 3
  - `- ` or `* ` → Bulleted list
  - `1. ` → Numbered list
  - `[] ` → Checklist item
  - `> ` → Block quote
  - ``` ` ` ` ``` → Code block
  - `---` → Horizontal rule

### Additional Features
- **Hashtags**: Type `#tag` to create clickable hashtags
- **Tab Indentation**: Use Tab/Shift+Tab for indentation
- **History**: Undo/Redo support (Ctrl/Cmd + Z/Y)
- **Auto-save**: Debounced onChange (300ms) for performance
- **HTML Output**: Editor state is saved as HTML

## Props

```typescript
interface LexicalEditorProps {
  value?: string;                    // HTML string to initialize editor
  onChange?: (html: string) => void; // Callback when content changes
  disabled?: boolean;                // Disable editing
  placeholder?: string;              // Placeholder text
  withToolbar?: boolean;             // Show/hide toolbar (default: true)
  withFloatingToolbar?: boolean;     // Enable floating format toolbar (default: false)
  withCodeHighlight?: boolean;       // Enable code syntax highlighting (default: true)
  withCharacterCount?: boolean;      // Show character count (default: false)
  withTreeView?: boolean;            // Show tree view for debugging (default: false)
  withInsertMenu?: boolean;          // Enable Insert menu (default: false)
  autoFocus?: boolean;               // Auto-focus on mount (default: false)
  maxLength?: number;                // Maximum character limit (optional)
  className?: string;                // Additional CSS classes
}
```

## Usage

### Basic Usage

```tsx
import { Lexical } from "@repo/ui";

function MyComponent() {
  const [content, setContent] = useState("<p>Initial content</p>");

  return (
    <Lexical
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      withToolbar={true}
    />
  );
}
```

### Advanced Usage

```tsx
import { Lexical } from "@repo/ui";

function AdvancedEditor() {
  const [content, setContent] = useState("");

  return (
    <Lexical
      value={content}
      onChange={setContent}
      placeholder="Start typing... Try markdown shortcuts!"
      withToolbar={true}
      withFloatingToolbar={true}     // Shows toolbar on text selection
      withCodeHighlight={true}       // Syntax highlighting for code
      withCharacterCount={true}      // Show character count
      withInsertMenu={true}          // Enable Insert menu
      maxLength={5000}               // Limit to 5000 characters
      autoFocus={true}               // Auto-focus on mount
      withTreeView={false}           // Debug view (dev only)
    />
  );
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + K | Insert Link |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z | Redo |
| Tab | Indent |
| Shift + Tab | Outdent |

## Plugins Included

### Core Plugins (Always Active)
1. **RichTextPlugin** - Rich text editing capabilities
2. **HistoryPlugin** - Undo/Redo functionality
3. **ListPlugin** - List support
4. **CheckListPlugin** - Interactive checklists
5. **LinkPlugin** - Link management
6. **AutoLinkPlugin** - Automatic URL/email detection
7. **ClickableLinkPlugin** - Makes links clickable
8. **FloatingLinkEditorPlugin** - Floating link editor UI
9. **TabIndentationPlugin** - Tab key indentation
10. **HorizontalRulePlugin** - Horizontal rules
11. **MarkdownShortcutPlugin** - Markdown shortcuts
12. **HashtagPlugin** - Hashtag support
13. **ClearEditorPlugin** - Command to clear editor content

### Optional Plugins (Configurable)
14. **FloatingTextFormatToolbarPlugin** - Inline toolbar on text selection (`withFloatingToolbar`)
15. **CodeHighlightPlugin** - Prism syntax highlighting (`withCodeHighlight`)
16. **MaxLengthPlugin** - Character limit enforcement (`maxLength`)
17. **CharacterCountPlugin** - Display character count (`withCharacterCount`)
18. **TreeViewPlugin** - Debug tree view (`withTreeView`)
19. **AutoFocusPlugin** - Auto-focus on mount (`autoFocus`)
20. **InsertMenuPlugin** - Insert menu for special content (`withInsertMenu`)
21. **ImagesPlugin** - Image insertion support
22. **PageBreakPlugin** - Page break support
23. **TablePlugin** - Table editing and management
24. **LayoutPlugin** - Multi-column layouts 🆕

## Nodes Supported

- HeadingNode (H1-H6)
- ListNode (ordered/unordered)
- ListItemNode
- QuoteNode
- CodeNode
- CodeHighlightNode
- LinkNode
- AutoLinkNode
- HorizontalRuleNode
- HashtagNode
- MarkNode (for highlighting)
- **ImageNode** (NEW!)
- **PageBreakNode** (NEW!)
- **TableNode, TableCellNode, TableRowNode** (NEW!)
- **LayoutContainerNode, LayoutItemNode** (NEW! 🆕)

## Styling

The editor comes with comprehensive styling including:
- Modern toolbar with active states
- Proper list indentation
- Interactive checkboxes
- Syntax-highlighted code blocks
- Styled links, quotes, and more

## Customization

You can customize the editor by:
1. Passing a custom `className` prop
2. Overriding SCSS variables in your own styles
3. Modifying the theme object in the component
4. Adding/removing plugins as needed

## Plugin Features

### Floating Text Format Toolbar
When `withFloatingToolbar={true}`, a floating toolbar appears when you select text:
- Quick access to Bold, Italic, Underline, Strikethrough, Code
- Link insertion/removal
- Auto-positions above selected text
- Disappears when selection is cleared

### Code Highlighting
When `withCodeHighlight={true}`:
- Automatic syntax highlighting for code blocks
- Powered by Prism
- Supports multiple languages

### Character Count
When `withCharacterCount={true}`:
- Displays current character count
- If `maxLength` is set, shows "current / max"
- Turns red when over limit

### Max Length
When `maxLength={number}` is set:
- Enforces character limit
- Prevents typing beyond limit
- Works with paste operations
- Restores previous state if limit exceeded

### Tree View (Debug Mode)
When `withTreeView={true}`:
- Shows the Lexical AST structure
- Useful for debugging
- Toggle show/hide with button
- **Recommended for development only**

## Insert Menu Features

### Images
- Insert images from URLs
- Automatic sizing
- Responsive design
- Alt text support

### Tables
- Customizable rows and columns
- Cell merge support
- Background colors
- Header rows
- Resizable cells

### Page Breaks
- Visual page break indicators
- Print-friendly
- Easy to identify in editor

### Columns Layout (NEW! 🆕)
- **2 columns** - Equal width or 25%/75%
- **3 columns** - Equal width or 25%/50%/25%
- **4 columns** - Equal width
- Beautiful styling with CSS Grid
- Focus effects per column
- All content types supported in columns
- Full serialization support

### Coming Soon
- Images with drag & drop upload
- Emojis picker
- Math equations (LaTeX)
- Collapsible sections
- @Mentions
- YouTube embeds (with preview)
- Twitter embeds
- Figma embeds
- Drag & drop blocks
- Component picker (slash commands)
