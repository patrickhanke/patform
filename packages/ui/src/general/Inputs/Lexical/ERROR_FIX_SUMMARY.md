# Editor State Error - Fixed ✅

## Error Message
```
Uncaught Error: Unable to find an active editor state. 
State helpers or node methods can only be used synchronously 
during the callback of editor.update(), editor.read(), or 
editorState.read().
```

---

## Root Cause

The error occurred because Lexical's state access functions (like `$getSelection()`) were being called **outside** of the required editor context callbacks.

### The Rule
All Lexical state functions (those starting with `$`) must be called **inside**:
- `editor.update(() => { ... })`
- `editor.read(() => { ... })`
- `editorState.read(() => { ... })`
- Or within registered callbacks (commands, transforms, etc.)

---

## Files Fixed

### 1. `Lexical.tsx` - Toolbar Component
**Problem:**
```tsx
// ❌ WRONG - $getSelection() outside editor context
const updateToolbar = useCallback(() => {
  const selection = $getSelection();  // Error here!
  if ($isRangeSelection(selection)) {
    setIsBold(selection.hasFormat("bold"));
    // ...
  }
}, []);
```

**Fixed:**
```tsx
// ✅ CORRECT - Wrapped in editor.read()
const updateToolbar = useCallback(() => {
  editor.read(() => {
    const selection = $getSelection();  // Now safe!
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      // ...
    }
  });
}, [editor]);
```

### 2. `plugins/FloatingTextFormatToolbarPlugin.tsx`
**Problem:**
```tsx
// ❌ WRONG
const updateToolbar = useCallback(() => {
  const selection = $getSelection();  // Error!
  // ...
}, []);
```

**Fixed:**
```tsx
// ✅ CORRECT
const updateToolbar = useCallback(() => {
  editor.read(() => {
    const selection = $getSelection();  // Now safe!
    // ...
  });
}, [editor]);
```

### 3. `plugins/FloatingLinkEditorPlugin.tsx`
**Problem:**
```tsx
// ❌ WRONG
const updateLinkEditor = useCallback(() => {
  const selection = $getSelection();  // Error!
  // ...
}, []);
```

**Fixed:**
```tsx
// ✅ CORRECT
const updateLinkEditor = useCallback(() => {
  editor.read(() => {
    const selection = $getSelection();  // Now safe!
    // ...
  });
}, [editor]);
```

---

## Why These Plugins Were Affected

All three plugins update toolbar/UI state based on the current selection:

1. **Toolbar** - Shows which formatting is active (bold, italic, etc.)
2. **FloatingTextFormatToolbar** - Shows floating toolbar when text is selected
3. **FloatingLinkEditor** - Shows link editor when cursor is in a link

They all:
- Listen to `SELECTION_CHANGE_COMMAND`
- Call `updateToolbar()` or similar
- Need to read current selection state
- **Forgot to wrap in `editor.read()`**

---

## Plugins That Were Already Correct

### ✅ UpdatePlugin
Already wrapped in `editor.update()`:
```tsx
editor.update(() => {
  const parser = new DOMParser();
  const nodes = $generateNodesFromDOM(editor, dom);
  // ... safe $-function calls
});
```

### ✅ MaxLengthPlugin
Uses `registerNodeTransform()` which provides editor context:
```tsx
editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
  const selection = $getSelection();  // Safe in transform callback
  // ...
});
```

### ✅ LayoutPlugin
Uses `registerCommand()` which provides editor context:
```tsx
editor.registerCommand(INSERT_LAYOUT_COMMAND, (template: string) => {
  const selection = $getSelection();  // Safe in command callback
  // ...
});
```

---

## Understanding the Fix

### When to Use `editor.read()`
Use when **reading** editor state without modifying:
```tsx
editor.read(() => {
  const selection = $getSelection();
  const html = $generateHtmlFromNodes(editor, null);
  // Read-only operations
});
```

### When to Use `editor.update()`
Use when **modifying** editor state:
```tsx
editor.update(() => {
  const root = $getRoot();
  root.clear();
  root.append(...nodes);
  // Modifications
});
```

### When It's Automatic
Some callbacks already provide editor context:
- `registerCommand()` callbacks
- `registerNodeTransform()` callbacks
- `registerUpdateListener()` callbacks

---

## Testing

After the fix:
- ✅ No console errors
- ✅ Toolbar updates correctly
- ✅ Floating toolbar appears on selection
- ✅ Link editor appears on link selection
- ✅ All formatting buttons work
- ✅ All plugins function correctly
- ✅ No performance issues

---

## Key Takeaways

1. **Always wrap `$` functions** in `editor.read()` or `editor.update()`
2. **`editor.read()`** for reading state (doesn't trigger re-render)
3. **`editor.update()`** for modifying state (triggers re-render)
4. **Command callbacks** already have context (no wrapping needed)
5. **Transform callbacks** already have context (no wrapping needed)

---

## Common Patterns

### ✅ Correct: Reading selection in useCallback
```tsx
const handleSomething = useCallback(() => {
  editor.read(() => {
    const selection = $getSelection();
    // ... use selection
  });
}, [editor]);
```

### ✅ Correct: Updating state in useCallback
```tsx
const handleSomething = useCallback(() => {
  editor.update(() => {
    const root = $getRoot();
    root.append($createParagraphNode());
  });
}, [editor]);
```

### ✅ Correct: In command callback
```tsx
editor.registerCommand(SOME_COMMAND, () => {
  const selection = $getSelection();  // Already in context
  return true;
}, COMMAND_PRIORITY_LOW);
```

### ❌ Wrong: Direct call
```tsx
const handleSomething = () => {
  const selection = $getSelection();  // ERROR!
};
```

---

## Summary

**Problem:** Accessing Lexical state outside editor context
**Solution:** Wrap all `$` function calls in `editor.read()` or `editor.update()`
**Files Modified:** 3 (Lexical.tsx, FloatingTextFormatToolbarPlugin.tsx, FloatingLinkEditorPlugin.tsx)
**Result:** Error resolved, all plugins working correctly

**The editor is now fully functional! ✅**
