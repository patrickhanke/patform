# ContentPreview Features Overview

## 🎯 What Was Built

A comprehensive preview system that transforms structured content blocks into two different formats:

### 1. 🌐 Website Preview
Display content as it would appear on a modern website.

**Features:**
- Clean, modern styling
- Responsive containers
- Proper typography and spacing
- Flexbox-based layouts
- Interactive elements (buttons)

**Example Output:**
```
┌─────────────────────────────────────┐
│  Welcome to Our Newsletter          │  ← Heading
│                                     │
│  This is a sample paragraph with   │  ← Paragraph
│  some informative content here.    │
│                                     │
│         [  Click Here  ]           │  ← Button
│  ───────────────────────────────   │  ← Divider
│                                     │
│  ┌────────────┬────────────┐       │
│  │ Left Col   │ Right Col  │       │  ← Layout
│  │ Content    │ Content    │
│  └────────────┴────────────┘       │
└─────────────────────────────────────┘
```

### 2. 📧 Email Preview
Display content as email-compatible HTML.

**Features:**
- Table-based layouts (email standard)
- Inline styles only (no external CSS)
- 600px standard width
- Email client compatibility
- Copy to clipboard
- Download as HTML file

**Example Email HTML Structure:**
```html
<!DOCTYPE html>
<html>
  <body style="...">
    <table width="600">
      <tr>
        <td>
          <h2 style="...">Heading</h2>
          <p style="...">Paragraph</p>
          <table><tr><td>Button</td></tr></table>
          <table><tr><td style="border-top">Divider</td></tr></table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

## 🎨 User Interface

### Tab Navigation
```
┌─────────────────────────────────────────────────────┐
│ [🌐 Website] [📧 E-Mail]                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  (Preview content displayed here)                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Email Preview Actions
```
┌──────────────────────────────────────────────────────┐
│ Email Preview        [📋 HTML kopieren] [⬇ Download]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────┐            │
│  │                                    │            │
│  │   Email content in iframe          │            │
│  │                                    │            │
│  └────────────────────────────────────┘            │
└──────────────────────────────────────────────────────┘
```

## 📦 Content Block Support

### Text Block
```typescript
{
  type: "text",
  value: "<p>Content</p>",
  config: {
    textType: "paragraph" | "heading",
    headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
}
```
**Renders as:**
- Web: `<div>` or `<h1>-<h6>` with modern styling
- Email: Table cell with inline typography

### Button Block
```typescript
{
  type: "button",
  config: {
    buttonText: "Click Here",
    buttonUrl: "https://example.com",
    alignment: "left" | "center" | "right"
  }
}
```
**Renders as:**
- Web: Styled `<a>` tag with button appearance
- Email: Table-based button with background color

### Divider Block
```typescript
{
  type: "divider"
}
```
**Renders as:**
- Web: `<hr>` element
- Email: Table row with border

### Image Block
```typescript
{
  type: "image",
  config: {
    imageUrl: "https://example.com/image.jpg",
    imageAlt: "Description",
    alignment: "left" | "center" | "right"
  }
}
```
**Renders as:**
- Web: Responsive `<img>` with alignment
- Email: Table-wrapped image with max-width

### Layout Block
```typescript
{
  type: "layout",
  config: {
    columns: "50/50" | "33/33/33" | "25/75" // etc.
  },
  children: [
    [/* Column 1 blocks */],
    [/* Column 2 blocks */]
  ]
}
```
**Renders as:**
- Web: Flexbox columns
- Email: Table columns with calculated widths

## 🔄 Data Transformation Flow

```
Input: ContentBlock[]
  │
  ├─→ Website Preview Path
  │   │
  │   └─→ transformToWeb()
  │       │
  │       ├─→ Text → <div> or <h1-6>
  │       ├─→ Button → <a> styled
  │       ├─→ Divider → <hr>
  │       ├─→ Image → <img>
  │       └─→ Layout → <div> flexbox
  │
  └─→ Email Preview Path
      │
      └─→ transformToEmail()
          │
          ├─→ Text → <table><tr><td>
          ├─→ Button → <table> button
          ├─→ Divider → <table> border
          ├─→ Image → <table><img>
          └─→ Layout → <table> columns
```

## 🛠️ Export Functions

### Copy Email HTML
```typescript
import { copyEmailHtml } from "./functions";

const success = await copyEmailHtml(content);
// Copies full email HTML to clipboard
```

### Download Email HTML
```typescript
import { downloadEmailHtml } from "./functions";

downloadEmailHtml(content, "template.html");
// Downloads as file
```

## 💡 Use Cases

### 1. Email Marketing
- Create newsletter templates
- Preview before sending
- Export for email platform (Mailchimp, SendGrid, etc.)

### 2. Content Management
- Preview article layouts
- Test responsive designs
- Validate content structure

### 3. Template Development
- Build reusable email templates
- Test across formats
- Maintain consistency

## ⚡ Performance

- **Lightweight**: Minimal dependencies
- **Fast Rendering**: Efficient transformation
- **Responsive**: Smooth tab switching
- **Memory Efficient**: Uses React best practices

## 🎓 Learning Resources

- **README.md**: Technical architecture
- **USAGE.md**: Practical examples
- **Inline Comments**: Code documentation

## 🔐 Security

- **XSS Protection**: Uses React's built-in sanitization
- **Iframe Sandbox**: Email preview runs in sandboxed iframe
- **No External Deps**: All transformations done locally

## 🌟 Highlights

✅ **Dual Format Support**: One component, two outputs  
✅ **Email Compatible**: Industry-standard email HTML  
✅ **Export Ready**: Copy or download with one click  
✅ **Type Safe**: Full TypeScript support  
✅ **Extensible**: Easy to add new block types  
✅ **Well Documented**: Comprehensive guides  
✅ **Zero Errors**: Clean, tested code  

---

**Built with**: React, TypeScript, SCSS  
**Compatible with**: All modern browsers  
**Status**: Production Ready ✅
