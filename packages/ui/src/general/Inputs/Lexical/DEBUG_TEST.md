# 🐛 Debug Test - Insert Menu

## Quick Debug Checklist

### 1. Check the Code

Open your component file and verify:

```tsx
// ✅ This is correct:
<Lexical
  value={content}
  onChange={setContent}
  withInsertMenu={true}  // ← This line must be present
/>

// ❌ This won't show Insert menu:
<Lexical
  value={content}
  onChange={setContent}
/>
```

### 2. Check the Prop Value

```tsx
// These all work:
<Lexical withInsertMenu={true} />   // ✅
<Lexical withInsertMenu />          // ✅ (same as true)

// These won't work:
<Lexical withInsertMenu={false} />  // ❌
<Lexical />                         // ❌ (defaults to false)
```

### 3. Verify Import

```tsx
// ✅ Correct:
import { Lexical } from "@repo/ui";

// ❌ Wrong:
import Lexical from "@repo/ui/Lexical";
import { Lexical } from "../Lexical";
```

### 4. Check Browser Console

Open DevTools (F12) and check for:

```
⚠️ Common Errors:

1. "Cannot find module './plugins/InsertMenuPlugin'"
   → Run: npm install
   → Restart dev server

2. "INSERT_IMAGE_COMMAND is not defined"
   → The plugins aren't loading
   → Check imports in Lexical.tsx

3. "Cannot read property 'dispatchCommand' of undefined"
   → Editor context issue
   → Check LexicalComposer wrapping
```

### 5. Verify Files Exist

Check these files exist:

```
packages/ui/src/general/Inputs/Lexical/
├── Lexical.tsx                      ✓
├── Lexical.scss                     ✓
├── index.ts                         ✓
├── plugins/
│   ├── InsertMenuPlugin.tsx         ✓ NEW
│   ├── InsertMenuPlugin.scss        ✓ NEW
│   ├── ImagesPlugin.tsx             ✓ NEW
│   ├── PageBreakPlugin.tsx          ✓ NEW
│   ├── TablePlugin.tsx              ✓ NEW
│   └── index.ts                     ✓
└── nodes/
    ├── ImageNode.tsx                ✓ NEW
    ├── PageBreakNode.tsx            ✓ NEW
    └── index.ts                     ✓ NEW
```

### 6. Check SCSS Import

In `Lexical.scss`, verify:

```scss
.lexical-toolbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
```

### 7. Check Component Structure

In `Lexical.tsx`, verify this structure exists:

```tsx
<LexicalComposer initialConfig={initialConfig}>
  <div className="lexical-toolbar-row">
    {withToolbar && <Toolbar />}
    {withInsertMenu && <InsertMenuPlugin />}  {/* ← This line */}
  </div>
  {/* ... rest of component */}
</LexicalComposer>
```

### 8. Verify Nodes Are Registered

In `Lexical.tsx`, check `initialConfig.nodes` includes:

```tsx
nodes: [
  // ... other nodes ...
  ImageNode,       // ← NEW
  PageBreakNode,   // ← NEW
  TableNode,       // ← NEW
  TableCellNode,   // ← NEW
  TableRowNode,    // ← NEW
],
```

### 9. Verify Plugins Are Rendered

In `Lexical.tsx`, check these plugins exist:

```tsx
<ImagesPlugin />      {/* ← NEW */}
<PageBreakPlugin />   {/* ← NEW */}
<TablePlugin />       {/* ← NEW */}
```

### 10. Test Rendering

Create a test file `test.tsx`:

```tsx
import { Lexical } from "@repo/ui";

export default function Test() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Insert Menu Test</h1>
      <Lexical
        withInsertMenu={true}
        placeholder="If you see + Insert button, it works!"
      />
    </div>
  );
}
```

---

## 🔍 Expected Behavior

### When withInsertMenu={false} or not set:
```
┌─────────────────────────────────┐
│ [B][I][U] Heading ▼ [Link]     │  ← No Insert button
├─────────────────────────────────┤
│ Type here...                    │
└─────────────────────────────────┘
```

### When withInsertMenu={true}:
```
┌──────────────────────────────────────┐
│ [B][I][U] Heading ▼ [Link] [+Insert]│  ← Insert button appears!
├──────────────────────────────────────┤
│ Type here...                         │
└──────────────────────────────────────┘
```

---

## 🎯 Visual Indicators

The Insert button should:
- ✅ Be **blue** (#3182ce)
- ✅ Show text **"+ Insert"**
- ✅ Be on the **same row** as other toolbar buttons
- ✅ Have **8px gap** from toolbar
- ✅ Show **dropdown** on click
- ✅ Dropdown has **6 items** (HR, Page Break, Image, Table, YouTube, Equation)

---

## 🧪 Manual Test Steps

1. **Set the prop:**
   ```tsx
   <Lexical withInsertMenu={true} />
   ```

2. **Save file** (Ctrl+S)

3. **Check browser** - Should see blue button

4. **Click "+ Insert"**
   - Dropdown should appear
   - Should have 6+ menu items
   - Should have icons (—, 📄, 🖼️, etc.)

5. **Click "Horizontal Rule"**
   - Dropdown closes
   - Horizontal line appears in editor

6. **Click "+ Insert" → "Image"**
   - Prompt appears asking for URL
   - Enter: `https://picsum.photos/200`
   - Image appears in editor

7. **Click "+ Insert" → "Table"**
   - 3x3 table appears
   - Can type in cells

8. **Check HTML output**
   - onChange should fire
   - HTML should include inserted elements

---

## 🚨 Common Issues & Solutions

### Issue: "Button doesn't appear"

**Check 1:** Prop is set
```tsx
// Add this:
withInsertMenu={true}
```

**Check 2:** File is saved
- Look for unsaved indicator (●) in file tab

**Check 3:** Dev server is running
```bash
npm run dev
```

**Check 4:** Hard refresh browser
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R

---

### Issue: "Button appears but dropdown doesn't open"

**Check 1:** Console for errors
- Open DevTools (F12)
- Look for red errors

**Check 2:** SCSS is loaded
- Inspect element
- Check if `.insert-menu-dropdown` styles exist

**Check 3:** React state
- Add console.log:
```tsx
const [showMenu, setShowMenu] = useState(false);
console.log('showMenu:', showMenu);  // ← Add this
```

---

### Issue: "Insert functions don't work"

**Check 1:** Commands are registered
- ImagesPlugin loaded?
- PageBreakPlugin loaded?
- TablePlugin loaded?

**Check 2:** Nodes are registered
- ImageNode in nodes array?
- PageBreakNode in nodes array?
- Table nodes in nodes array?

**Check 3:** Console errors
```
Look for:
- "Command not found"
- "Node not registered"
- "Cannot dispatch command"
```

---

## 📊 Diagnostic Output

Add this to your component to debug:

```tsx
<Lexical
  withInsertMenu={true}
  onChange={(html) => {
    console.log('Content changed:', html);
    console.log('Length:', html.length);
  }}
/>
```

Then check console when you:
1. Click + Insert
2. Insert horizontal rule
3. Insert image
4. Insert table

Each should trigger onChange with updated HTML.

---

## ✅ Success Criteria

You know it's working when:

- [x] Blue "+ Insert" button is visible
- [x] Button is in toolbar row (not floating)
- [x] Clicking button shows dropdown
- [x] Dropdown has 6+ items with icons
- [x] Clicking "Horizontal Rule" inserts a line
- [x] Clicking "Image" shows prompt
- [x] Entering URL inserts image
- [x] Clicking "Table" inserts 3x3 table
- [x] onChange fires with correct HTML
- [x] No console errors
- [x] Dropdown closes after insert

---

## 🎉 It Works!

If all checks pass, your Insert menu is fully functional!

Try inserting:
- ✅ Horizontal Rule
- ✅ Page Break
- ✅ Image (URL: https://picsum.photos/300)
- ✅ Table
- ✅ YouTube (command ready, preview coming soon)
- ✅ Equation (command ready, KaTeX coming soon)

**Happy editing! 🚀**
