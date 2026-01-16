# Multi-Column Layouts - Complete Guide

## 🎉 Feature Implemented!

You can now create multi-column layouts in your Lexical editor with various pre-configured options.

---

## 📋 What Was Added

### New Nodes (2)
1. **LayoutContainerNode** - Container for columns (uses CSS Grid)
2. **LayoutItemNode** - Individual column within a layout

### New Plugin (1)
1. **LayoutPlugin** - Handles column layout creation and management

### Updated Components
- **InsertMenuPlugin** - Now includes "Columns Layout" submenu
- **InsertMenuPlugin.scss** - Submenu styling with hover effects
- **Lexical.tsx** - Integrated new nodes and plugin
- **Lexical.scss** - Beautiful column styling

---

## 🎯 How to Use

### Enable Insert Menu (Required)

```tsx
<Lexical
  value={content}
  onChange={setContent}
  withInsertMenu={true}  // Required for column layouts
/>
```

### Insert Columns

1. Click **"+ Insert"** button in toolbar
2. Hover over **"Columns Layout"**
3. Select from **5 layout options:**
   - 2 columns (equal width)
   - 2 columns (25% / 75%)
   - 3 columns (equal width)
   - 3 columns (25% / 50% / 25%)
   - 4 columns (equal width)

---

## 📐 Available Layouts

### 2 Columns (Equal)
```
┌──────────────────┬──────────────────┐
│                  │                  │
│    Column 1      │    Column 2      │
│     (50%)        │     (50%)        │
│                  │                  │
└──────────────────┴──────────────────┘
```
**Template:** `1fr 1fr`

### 2 Columns (25% / 75%)
```
┌─────┬─────────────────────────────────┐
│     │                                 │
│ Col │         Column 2                │
│  1  │         (75%)                   │
│ 25% │                                 │
└─────┴─────────────────────────────────┘
```
**Template:** `1fr 3fr`

### 3 Columns (Equal)
```
┌──────────┬──────────┬──────────┐
│          │          │          │
│  Col 1   │  Col 2   │  Col 3   │
│  (33%)   │  (33%)   │  (33%)   │
│          │          │          │
└──────────┴──────────┴──────────┘
```
**Template:** `1fr 1fr 1fr`

### 3 Columns (25% / 50% / 25%)
```
┌─────┬──────────────┬─────┐
│     │              │     │
│ C1  │   Column 2   │ C3  │
│ 25% │    (50%)     │ 25% │
│     │              │     │
└─────┴──────────────┴─────┘
```
**Template:** `1fr 2fr 1fr`

### 4 Columns (Equal)
```
┌──────┬──────┬──────┬──────┐
│      │      │      │      │
│ Col1 │ Col2 │ Col3 │ Col4 │
│ 25%  │ 25%  │ 25%  │ 25%  │
│      │      │      │      │
└──────┴──────┴──────┴──────┘
```
**Template:** `1fr 1fr 1fr 1fr`

---

## 🎨 Visual Features

### Column Container
- **Background:** Light gray (#fafafa)
- **Border:** Subtle border (#e2e8f0)
- **Gap:** 16px between columns
- **Padding:** 16px around all columns
- **Rounded corners:** 8px border radius

### Individual Columns
- **Background:** White
- **Border:** Light border (#e2e8f0)
- **Min Height:** 60px
- **Padding:** 12px
- **Focus Effect:** Blue border + shadow when typing

### Empty Column Indicator
- Shows "Empty column..." in italic gray text
- Disappears when content is added

---

## 💡 Use Cases

### Blog Posts
```
┌──────────────────┬──────────────────┐
│  Main content    │   Sidebar        │
│  - Article text  │   - Related      │
│  - Images        │   - Author bio   │
│  - Paragraphs    │   - Social links │
└──────────────────┴──────────────────┘
```

### Documentation
```
┌──────────┬──────────┬──────────┐
│ Feature  │  Usage   │  Example │
│          │          │          │
│ Details  │  Code    │  Demo    │
└──────────┴──────────┴──────────┘
```

### Product Showcase
```
┌──────┬──────┬──────┬──────┐
│ Pro1 │ Pro2 │ Pro3 │ Pro4 │
│      │      │      │      │
│ Img  │ Img  │ Img  │ Img  │
│ Desc │ Desc │ Desc │ Desc │
└──────┴──────┴──────┴──────┘
```

### Comparison Tables
```
┌─────┬──────────────┬─────┐
│ Old │ Comparison   │ New │
│     │              │     │
│ v1  │ Features     │ v2  │
└─────┴──────────────┴─────┘
```

---

## 🔧 Technical Details

### LayoutContainerNode

**Type:** ElementNode

**Properties:**
- `__templateColumns` - CSS Grid template (e.g., "1fr 1fr")

**Methods:**
- `getTemplateColumns()` - Get current template
- `setTemplateColumns(template)` - Update template
- `isShadowRoot()` - Returns true (isolates content)

**Serialization:**
```json
{
  "type": "layout-container",
  "templateColumns": "1fr 1fr",
  "children": [...]
}
```

**HTML Export:**
```html
<div 
  data-lexical-layout-container="true"
  style="grid-template-columns: 1fr 1fr">
  <!-- columns -->
</div>
```

### LayoutItemNode

**Type:** ElementNode

**Properties:** None (simple container)

**Methods:**
- `collapseAtStart()` - Removes layout if all columns empty
- `isShadowRoot()` - Returns true (isolates content)

**Serialization:**
```json
{
  "type": "layout-item",
  "children": [...]
}
```

**HTML Export:**
```html
<div data-lexical-layout-item="true">
  <!-- column content -->
</div>
```

---

## 🎮 Commands

### INSERT_LAYOUT_COMMAND

**Usage:**
```tsx
editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr");
```

**Parameters:**
- `template: string` - CSS Grid template columns

**Examples:**
```tsx
// 2 equal columns
editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr");

// 3 equal columns
editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr 1fr");

// 2 columns (1/3 and 2/3)
editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 2fr");

// Custom layout (200px, auto, 100px)
editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "200px auto 100px");
```

---

## 📝 Editing Columns

### Adding Content

1. **Click inside a column** to focus it
2. **Type normally** - all formatting works
3. **Use toolbar** - all buttons work per-column

### Supported Content in Columns

Each column can contain:
- ✅ Text (bold, italic, underline, etc.)
- ✅ Headings (H1-H6)
- ✅ Lists (ordered, unordered, checklists)
- ✅ Links
- ✅ Code blocks
- ✅ Quotes
- ✅ Images
- ✅ Tables
- ✅ Horizontal rules
- ✅ **Even nested columns!**

### Navigation

- **Tab:** Move to next column
- **Arrow keys:** Navigate between columns
- **Click:** Focus specific column

---

## 🎨 Styling

### Default Styles (Lexical.scss)

```scss
.lexical-layout-container {
  display: grid;
  gap: 16px;
  margin: 16px 0;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fafafa;
}

.lexical-layout-item {
  min-height: 60px;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  
  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1);
  }
}
```

### Customization

Override styles in your CSS:

```scss
// Tighter columns
.lexical-layout-container {
  gap: 8px;
  padding: 8px;
}

// Darker borders
.lexical-layout-item {
  border-color: #cbd5e0;
}

// No container background
.lexical-layout-container {
  background: transparent;
  border: none;
}

// Colorful columns
.lexical-layout-item:nth-child(1) {
  background: #fef5e7; // Light yellow
}
.lexical-layout-item:nth-child(2) {
  background: #e8f5e9; // Light green
}
```

---

## 🚀 Advanced Usage

### Programmatic Creation

```tsx
import { 
  INSERT_LAYOUT_COMMAND 
} from "@repo/ui/Lexical/plugins/LayoutPlugin";

function MyComponent() {
  const editorRef = useRef<LexicalEditor>();

  const insertCustomLayout = () => {
    if (editorRef.current) {
      // Create custom layout
      editorRef.current.dispatchCommand(
        INSERT_LAYOUT_COMMAND,
        "200px 1fr 200px" // Fixed sidebars, flexible center
      );
    }
  };

  return (
    <>
      <button onClick={insertCustomLayout}>
        Custom Layout
      </button>
      <Lexical
        ref={editorRef}
        withInsertMenu={true}
      />
    </>
  );
}
```

### Responsive Layouts

Create responsive templates with CSS Grid:

```tsx
// Auto-fit columns (responsive)
editor.dispatchCommand(
  INSERT_LAYOUT_COMMAND,
  "repeat(auto-fit, minmax(250px, 1fr))"
);

// Mobile-first: stack on small screens
// (Will require custom CSS media queries)
```

---

## 📦 Dependencies

### Already Included
- `lexical` - Core Lexical
- `@lexical/react` - React bindings
- `@lexical/utils` - Utility functions

### No New Dependencies!
- Uses native CSS Grid
- Pure Lexical nodes
- No external libraries

---

## ✅ Testing Checklist

- [x] Insert 2-column layout
- [x] Insert 3-column layout
- [x] Insert 4-column layout
- [x] Type in each column
- [x] Format text in columns
- [x] Add lists in columns
- [x] Add images in columns
- [x] Add tables in columns
- [x] Navigate between columns
- [x] Delete layout
- [x] Serialize/deserialize
- [x] HTML export
- [x] Styling applied
- [x] Focus effects work
- [x] No console errors

---

## 🎓 Examples

### Example 1: Simple Two-Column

```tsx
<Lexical
  value=""
  onChange={(html) => console.log(html)}
  withToolbar={true}
  withInsertMenu={true}
/>

// User actions:
// 1. Click "+ Insert"
// 2. Hover "Columns Layout"
// 3. Click "2 columns (equal)"
// 4. Type in left column
// 5. Tab to right column
// 6. Type in right column
```

### Example 2: Product Showcase (4 columns)

```tsx
<Lexical
  value=""
  onChange={setContent}
  withInsertMenu={true}
  placeholder="Create a product showcase..."
/>

// Result:
// ┌─────────┬─────────┬─────────┬─────────┐
// │ Product │ Product │ Product │ Product │
// │    1    │    2    │    3    │    4    │
// │ [Image] │ [Image] │ [Image] │ [Image] │
// │ $99.99  │ $149.99 │ $199.99 │ $249.99 │
// └─────────┴─────────┴─────────┴─────────┘
```

### Example 3: Blog Post with Sidebar

```tsx
<Lexical
  value=""
  onChange={setContent}
  withInsertMenu={true}
/>

// Insert: 2 columns (25% / 75%)
// Left (25%): Table of contents, author bio
// Right (75%): Main article content
```

---

## 🐛 Troubleshooting

### Issue: "Columns don't appear"

**Check:**
1. `withInsertMenu={true}` is set
2. Hover over "Columns Layout" (don't click too fast)
3. Select a layout option

### Issue: "Can't type in columns"

**Solution:** Click inside a column to focus it

### Issue: "Columns look weird"

**Check CSS:** Make sure Lexical.scss is loaded

### Issue: "Columns too narrow"

**Adjust template:**
```tsx
// Instead of "1fr 1fr 1fr 1fr" (narrow columns)
// Use "1fr 1fr" (wider columns)
```

---

## 📊 Performance

- **Lightweight:** Pure CSS Grid, no JavaScript layout
- **Fast:** No re-renders for layout changes
- **Efficient:** Minimal DOM nodes
- **Scalable:** Handles many columns easily

---

## 🎉 Summary

**What You Can Do Now:**

✅ Insert multi-column layouts
✅ 5 pre-configured templates
✅ Type and format in each column
✅ All content types supported
✅ Beautiful default styling
✅ Fully customizable
✅ Serialization support
✅ HTML export
✅ Responsive-ready

**Total Added:**
- 2 new nodes (LayoutContainer, LayoutItem)
- 1 new plugin (LayoutPlugin)
- 5 layout templates
- Complete styling
- Submenu UI
- Full documentation

**Your editor now supports professional multi-column layouts! 🚀**
