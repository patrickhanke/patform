# How to Use the Insert Menu

## 🚨 Important: The Insert Menu is Opt-In!

The Insert menu is **disabled by default**. You must explicitly enable it by passing the `withInsertMenu={true}` prop.

---

## ✅ Correct Usage

```tsx
import { Lexical } from "@repo/ui";

function MyComponent() {
  const [content, setContent] = useState("");

  return (
    <Lexical
      value={content}
      onChange={setContent}
      withToolbar={true}
      withInsertMenu={true}  // ⚠️ THIS IS REQUIRED!
    />
  );
}
```

---

## ❌ Common Mistake

```tsx
// This will NOT show the Insert menu:
<Lexical
  value={content}
  onChange={setContent}
  withToolbar={true}
  // Missing: withInsertMenu={true}
/>
```

---

## 🔍 What to Look For

When `withInsertMenu={true}` is set, you should see:

1. **Insert buttons** directly in the toolbar (after a divider):
   - Horizontal Rule (—)
   - Page Break (📄)
   - Image (🖼️)
   - Table (📊)
   - Columns (⚏ ▼) - This one has a dropdown
   - YouTube Video (▶️)
   - Equation (∑)

---

## 🎯 Quick Test

Copy and paste this into your component to verify it works:

```tsx
<Lexical
  value=""
  onChange={(html) => console.log(html)}
  placeholder="Click insert buttons to test!"
  withToolbar={true}
  withInsertMenu={true}
/>
```

---

## 🐛 Troubleshooting

### Issue: "I don't see the Insert buttons"

**Solution:** Make sure you're passing `withInsertMenu={true}`

```tsx
<Lexical withInsertMenu={true} />  // ✅
<Lexical withInsertMenu={false} /> // ❌
<Lexical />                        // ❌ (defaults to false)
```

### Issue: "Hot reload not working"

**Solution:** Restart your dev server

```bash
# Stop the dev server (Ctrl+C)
npm run dev

# Or for specific app:
npm run dev:patstore
npm run dev:patflow
```

### Issue: "Insert menu appears but inserts don't work"

**Check console for errors:**
1. Open browser DevTools (F12)
2. Click Console tab
3. Try inserting content
4. Look for any red error messages

### Issue: "Table insert doesn't work"

**Check:** Make sure `@lexical/table` is installed:

```bash
npm install @lexical/table --workspace=packages/ui
```

---

## 📋 All Available Props

```typescript
interface LexicalEditorProps {
  value?: string;                    // Initial HTML
  onChange?: (html: string) => void; // Called on change
  disabled?: boolean;                // Disable editing
  placeholder?: string;              // Placeholder text
  
  // Toolbar options
  withToolbar?: boolean;             // Show main toolbar (default: true)
  withInsertMenu?: boolean;          // Show Insert menu (default: false) ⚠️
  withFloatingToolbar?: boolean;     // Floating toolbar on selection
  
  // Features
  withCodeHighlight?: boolean;       // Syntax highlighting
  withCharacterCount?: boolean;      // Character counter
  withTreeView?: boolean;            // Debug tree view
  
  // Settings
  autoFocus?: boolean;               // Auto-focus on mount
  maxLength?: number;                // Character limit
  className?: string;                // Custom CSS class
}
```

---

## 🎨 Full Example

```tsx
import React, { useState } from "react";
import { Lexical } from "@repo/ui";

export default function RichEditor() {
  const [content, setContent] = useState("");

  return (
    <div className="editor-container">
      <h2>My Editor</h2>
      
      <Lexical
        value={content}
        onChange={setContent}
        placeholder="Start typing or click + Insert..."
        
        // Enable features
        withToolbar={true}
        withInsertMenu={true}          // INSERT MENU!
        withFloatingToolbar={true}
        withCodeHighlight={true}
        withCharacterCount={true}
        
        // Settings
        maxLength={10000}
        autoFocus={false}
      />
      
      {/* Preview output */}
      <div className="output">
        <h3>HTML Output:</h3>
        <pre>{content}</pre>
      </div>
    </div>
  );
}
```

---

## 🎬 Step-by-Step Test

1. **Add the prop:**
   ```tsx
   <Lexical withInsertMenu={true} />
   ```

2. **Save the file** (Ctrl+S)

3. **Check the browser** - Look for blue "+ Insert" button

4. **Click "+ Insert"** - Dropdown should appear

5. **Click "Horizontal Rule"** - A line should be inserted

6. **Click "+ Insert" → "Image"** - Prompt for URL should appear

7. **Enter:** `https://picsum.photos/200`

8. **Image should appear** in the editor

---

## ✅ Verification Checklist

- [ ] `withInsertMenu={true}` is set
- [ ] Blue "+ Insert" button is visible
- [ ] Clicking button shows dropdown
- [ ] Dropdown has 6+ menu items
- [ ] Horizontal Rule inserts work
- [ ] Page Break inserts work
- [ ] Image prompt appears
- [ ] Table inserts work
- [ ] No console errors

---

## 🆘 Still Not Working?

1. **Check your import:**
   ```tsx
   import { Lexical } from "@repo/ui";
   // NOT: import Lexical from "..."
   ```

2. **Verify file saved:**
   - Check file tab for unsaved indicator (●)

3. **Hard refresh browser:**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

4. **Clear cache:**
   ```bash
   # Stop dev server
   # Delete .next or .turbo folders
   # Restart dev server
   ```

5. **Check TypeScript:**
   ```tsx
   // TypeScript should autocomplete withInsertMenu:
   <Lexical with[Tab] />  // Should show withInsertMenu
   ```

---

## 📱 What You Should See

```
┌────────────────────────────────────────────────────────────────┐
│ [B][I][U] ··· Heading ▼ [Link] │ [—][📄][🖼️][📊][⚏▼][▶️][∑] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Type here...                                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                                      ↑
                              Insert buttons
                         (appear after divider)
```

**Columns button dropdown:**
```
┌──────────────────────┐
│ [⚏ ▼]                │ ← Columns button
└──────────────────────┘
  ┌──────────────────────────┐
  │ 2 columns (equal)        │
  │ 2 columns (25% / 75%)    │
  │ 3 columns (equal)        │
  │ 3 columns (25%/50%/25%)  │
  │ 4 columns (equal)        │
  └──────────────────────────┘
       ↑
  Layout options
```

---

## 🎉 Success!

If you see the blue "+ Insert" button and the dropdown menu, **congratulations!** The Insert menu is working.

Now try inserting:
- A horizontal rule
- An image from a URL
- A table

**Enjoy your new Insert menu! 🚀**
