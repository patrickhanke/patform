# ContentEditor

A powerful drag-and-drop content editor for building web pages and email templates. Similar to Unlayer's react-email-editor, this component provides an intuitive interface for creating layouts with various content blocks.

## Features

- **Drag-and-Drop Interface**: Easily add and reorder content blocks
- **Multiple Content Types**: Text, Button, Image, Divider, and Layout blocks
- **Live Preview**: See changes in real-time as you build
- **Properties Panel**: Edit block properties with a dedicated panel
- **Flexible Layouts**: Support for 2 and 3 column layouts with various ratios
- **Responsive Design**: Works on desktop and mobile devices
- **Type-Safe**: Full TypeScript support

## Installation

The ContentEditor is already part of the `@repo/ui` package and includes all necessary dependencies:
- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list implementation
- `uuid` - Unique ID generation

## Usage

### Basic Example

```tsx
import { ContentEditor, ContentBlock } from "@repo/ui";
import { useState } from "react";

function MyPage() {
  const [content, setContent] = useState<ContentBlock[]>([]);

  const handleContentChange = (newContent: ContentBlock[]) => {
    setContent(newContent);
    console.log("Content updated:", newContent);
  };

  return (
    <ContentEditor
      content={content}
      onChange={handleContentChange}
    />
  );
}
```

### With Initial Content

```tsx
const initialContent: ContentBlock[] = [
  {
    id: "63610040-3b4f-4f98-a2bf-f6509bc00a0c",
    name: "Welcome Heading",
    position: 1,
    type: "text",
    value: "<h1>Welcome to Our Website</h1>",
    active: true,
    config: {
      textType: "heading",
      headingLevel: "h1"
    }
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Call to Action",
    position: 2,
    type: "button",
    value: "",
    active: true,
    config: {
      buttonText: "Get Started",
      buttonUrl: "/signup",
      alignment: "center"
    }
  }
];

<ContentEditor
  content={initialContent}
  onChange={handleContentChange}
/>
```

## Content Block Types

### Text Block

For paragraphs and headings.

```typescript
{
  type: "text",
  value: "<h3>Mitgliedsbeiträge</h3>",
  config: {
    textType: "heading" | "paragraph",
    headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
}
```

### Button Block

Interactive button with customizable text and URL.

```typescript
{
  type: "button",
  config: {
    buttonText: "Click me",
    buttonUrl: "#",
    alignment: "left" | "center" | "right"
  }
}
```

### Image Block

Display images with alt text and alignment.

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

### Divider Block

Horizontal line separator.

```typescript
{
  type: "divider",
  value: ""
}
```

### Layout Block

Multi-column layouts for complex designs. Supports nested blocks within each column.

```typescript
{
  type: "layout",
  value: "",
  children: [
    [/* Column 1 blocks */],
    [/* Column 2 blocks */],
    // ... more columns based on layout
  ],
  config: {
    columns: "50/50" | "33/66" | "66/33" | "25/75" | "75/25" | "33/33/33"
  }
}
```

**Nested Blocks**: You can drag any content block (Text, Button, Image, Divider) into layout columns. Each column maintains its own array of blocks.

## Data Format

Each content block follows this structure:

```typescript
interface ContentBlock {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Display name for the block
  position: number;              // Order in the content array
  type: "text" | "button" | "divider" | "image" | "layout";
  value: string | any;           // Block-specific content
  active: boolean;               // Whether the block is active/visible
  children?: ContentBlock[][];   // For layout blocks: array of columns
  config?: {                     // Block-specific configuration
    // ... varies by block type
  };
}
```

## Component Props

### ContentEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ContentBlock[]` | `[]` | Initial content blocks |
| `onChange` | `(content: ContentBlock[]) => void` | - | Callback fired when content changes |
| `className` | `string` | `""` | Additional CSS class name |

## Features in Detail

### Drag and Drop

- **Add Blocks**: Drag components from the left sidebar onto the canvas or into layout columns
- **Reorder**: Drag blocks within the canvas or within columns to reorder them
- **Move Between Columns**: Drag blocks from one column to another or from the canvas into columns
- **Visual Feedback**: See a preview while dragging and highlighted drop zones

### Block Management

- **Select**: Click a block to select it and view properties
- **Edit**: Use the properties panel on the right to edit block settings
- **Duplicate**: Click the duplicate button in the toolbar
- **Delete**: Click the delete button in the toolbar

### Properties Panel

The properties panel shows different options based on the selected block type:

- **All Blocks**: Name and Active status
- **Text**: Text type, heading level
- **Button**: Button text, URL, alignment
- **Image**: Image URL, alt text, alignment
- **Layout**: Column layout configuration

## Styling

The ContentEditor uses SCSS modules for styling. You can customize the appearance by:

1. **Override CSS variables** in your application
2. **Use the className prop** to add custom styles
3. **Modify the SCSS files** directly (located in `styles.scss` and `content/*/styles.scss`)

## File Structure

```
ContentEditor/
├── ContentEditor.tsx          # Main editor component
├── index.ts                   # Exports
├── styles.scss               # Main styles
├── README.md                 # This file
├── components/               # Utility components
│   ├── Canvas.tsx           # Drop zone and block container
│   ├── PropertiesPanel.tsx  # Block properties editor
│   ├── Sidebar.tsx          # Draggable component library
│   └── SortableBlock.tsx    # Wrapper for draggable blocks
└── content/                  # Content block components
    ├── TextBlock/
    │   ├── TextBlock.tsx
    │   └── styles.scss
    ├── ButtonBlock/
    │   ├── ButtonBlock.tsx
    │   └── styles.scss
    ├── ImageBlock/
    │   ├── ImageBlock.tsx
    │   └── styles.scss
    ├── DividerBlock/
    │   ├── DividerBlock.tsx
    │   └── styles.scss
    └── LayoutBlock/
        ├── LayoutBlock.tsx
        └── styles.scss
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **Optimized Rendering**: Blocks only re-render when their data changes
- **Efficient Drag & Drop**: Uses @dnd-kit for performant interactions
- **Lazy Updates**: Content changes are batched and debounced

## Future Enhancements

Potential features for future development:

- ✅ Nested layouts (blocks within layout columns) - **IMPLEMENTED**
- Rich text editor integration for text blocks
- Image upload functionality
- Template library
- Undo/redo functionality
- Keyboard shortcuts
- Export to HTML/JSON
- Mobile-first email templates

## License

Part of the patform project.
