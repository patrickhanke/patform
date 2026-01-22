# ContentPreview Usage Guide

## Overview

The ContentPreview component provides a comprehensive preview system that transforms your ContentBlock data into two different formats:

1. **Website Preview** - Shows how content will appear on a modern website
2. **Email Preview** - Shows how content will appear as an HTML email

## Quick Start

### Basic Implementation

```tsx
import ContentPreview from "@repo/ui/ContentEditor/content/ContentPreview";
import { useState } from "react";

function MyEmailEditor() {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <button onClick={() => setPreviewOpen(true)}>
        Preview Content
      </button>

      <ContentPreview
        content={content}
        isOpen={previewOpen}
        setIsOpen={setPreviewOpen}
      />
    </>
  );
}
```

## Features

### 1. Tab Navigation
- Switch between **Website** and **E-Mail** previews using the tabs at the top
- Current selection is highlighted with blue underline

### 2. Website Preview
- Renders content in a clean, modern web layout
- Responsive container with max-width
- Proper spacing and typography
- Supports all block types with web-appropriate styling

### 3. Email Preview
- Renders content in an iframe for accurate email representation
- Uses table-based layouts for email client compatibility
- All styles are inline (email best practice)
- Standard 600px width for optimal email rendering
- Includes utility buttons:
  - **Copy HTML**: Copies the complete email HTML to clipboard
  - **Download**: Downloads the email HTML as a .html file

## Block Type Rendering

### Text Blocks
**Web**: Renders as div or heading with standard web typography
**Email**: Renders in table cell with inline styles and email-safe fonts

### Button Blocks
**Web**: Styled anchor tag with modern button appearance
**Email**: Table-based button with background color for email compatibility

### Divider Blocks
**Web**: Standard `<hr>` element
**Email**: Table row with border-top

### Image Blocks
**Web**: Responsive image with alignment
**Email**: Table-wrapped image with email-safe attributes

### Layout Blocks (Multi-column)
**Web**: CSS Flexbox-based columns
**Email**: Table columns with calculated widths

## Example Content Structure

```tsx
const exampleContent: ContentBlock[] = [
  {
    id: "1",
    name: "Heading",
    type: "text",
    position: 1,
    value: "<h2>Welcome to our Newsletter</h2>",
    active: true,
    config: {
      textType: "heading",
      headingLevel: "h2"
    }
  },
  {
    id: "2",
    name: "Paragraph",
    type: "text",
    position: 2,
    value: "<p>This is a sample paragraph with some content.</p>",
    active: true,
    config: {
      textType: "paragraph"
    }
  },
  {
    id: "3",
    name: "CTA Button",
    type: "button",
    position: 3,
    value: "",
    active: true,
    config: {
      buttonText: "Click Here",
      buttonUrl: "https://example.com",
      alignment: "center"
    }
  },
  {
    id: "4",
    name: "Divider",
    type: "divider",
    position: 4,
    value: "",
    active: true
  },
  {
    id: "5",
    name: "Two Column Layout",
    type: "layout",
    position: 5,
    value: "",
    active: true,
    config: {
      columns: "50/50"
    },
    children: [
      [
        {
          id: "5a",
          name: "Left Column Text",
          type: "text",
          position: 1,
          value: "<p>Left column content</p>",
          active: true
        }
      ],
      [
        {
          id: "5b",
          name: "Right Column Text",
          type: "text",
          position: 1,
          value: "<p>Right column content</p>",
          active: true
        }
      ]
    ]
  }
];
```

## Export Functions

### Copy Email HTML to Clipboard

```tsx
import { copyEmailHtml } from "@repo/ui/ContentEditor/content/ContentPreview/functions";

const handleCopy = async () => {
  const success = await copyEmailHtml(content);
  if (success) {
    console.log("HTML copied to clipboard!");
  }
};
```

### Download Email HTML

```tsx
import { downloadEmailHtml } from "@repo/ui/ContentEditor/content/ContentPreview/functions";

const handleDownload = () => {
  downloadEmailHtml(content, "newsletter-template.html");
};
```

## Advanced Usage

### Custom Transform

If you need to customize the rendering, you can use the transform functions directly:

```tsx
import { transformToWeb, transformToEmail } from "@repo/ui/ContentEditor/content/ContentPreview/functions";

// Get React components for web
const webComponents = transformToWeb(content);

// Get HTML string for email
const emailHtml = transformToEmail(content);
```

## Best Practices

1. **Testing Email Templates**: Always preview email templates in the Email view before sending
2. **Image URLs**: Use absolute URLs for images (required for emails)
3. **Button Links**: Ensure all button URLs are complete and valid
4. **Column Layouts**: Test email layouts with different column configurations
5. **Content Length**: Keep email content concise for better engagement

## Troubleshooting

### Preview not showing
- Ensure `content` array is not empty
- Check that `isOpen` is set to `true`

### Email styles not appearing correctly
- Verify all image URLs are absolute (http:// or https://)
- Check that HTML content is valid

### Copy/Download not working
- Ensure you're on a secure context (HTTPS)
- Check browser permissions for clipboard access

## Browser Support

- **Web Preview**: All modern browsers
- **Email Preview**: All browsers with iframe support
- **Copy to Clipboard**: Modern browsers with Clipboard API support
- **Download**: All browsers with Blob API support
