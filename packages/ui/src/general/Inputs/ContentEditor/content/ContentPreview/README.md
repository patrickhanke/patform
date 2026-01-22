# ContentPreview Component

The ContentPreview component transforms `ContentBlock[]` data into renderable previews for both web and email formats.

## Features

- **Web Preview**: Renders content as it would appear on a website with modern styling
- **Email Preview**: Renders content as HTML email with inline styles for email client compatibility
- **Tab Navigation**: Easy switching between web and email previews
- **Export Functionality**: Copy HTML to clipboard or download as file

## Structure

```
ContentPreview/
├── components/
│   ├── WebPreview.tsx       # Web format preview component
│   ├── WebPreview.scss      # Web preview styles
│   ├── EmailPreview.tsx     # Email format preview component
│   ├── EmailPreview.scss    # Email preview styles
│   └── index.ts             # Component exports
├── functions/
│   ├── transformToWeb.tsx   # Transform ContentBlock[] to React components
│   ├── transformToEmail.ts  # Transform ContentBlock[] to email HTML
│   ├── exportEmail.ts       # Export utilities (copy/download)
│   └── index.ts             # Function exports
├── ContentPreview.tsx       # Main preview component
├── ContentPreview.scss      # Main preview styles
└── index.ts                 # Main export
```

## Usage

```tsx
import ContentPreview from "./content/ContentPreview";

const MyComponent = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [content, setContent] = useState<ContentBlock[]>([]);

  return (
    <>
      <button onClick={() => setPreviewOpen(true)}>
        Show Preview
      </button>
      
      <ContentPreview
        content={content}
        isOpen={previewOpen}
        setIsOpen={setPreviewOpen}
      />
    </>
  );
};
```

## Supported Block Types

### Text Block
- **Type**: `text`
- **Formats**: Paragraph or Heading (h1-h6)
- **Config**: `textType`, `headingLevel`

### Button Block
- **Type**: `button`
- **Config**: `buttonText`, `buttonUrl`, `alignment`

### Divider Block
- **Type**: `divider`
- **Renders**: Horizontal line separator

### Image Block
- **Type**: `image`
- **Config**: `imageUrl`, `imageAlt`, `alignment`

### Layout Block
- **Type**: `layout`
- **Supports**: Multi-column layouts with nested blocks
- **Config**: `columns` (e.g., "50/50", "33/33/33")

## Email HTML Features

The email HTML generator creates email-compatible HTML with:

- **Table-based layouts** for maximum email client compatibility
- **Inline styles** (no external CSS)
- **600px standard width** for optimal rendering
- **Responsive considerations** with max-width
- **Proper email semantics** using `role="presentation"`

## Export Functions

### Copy to Clipboard
```tsx
import { copyEmailHtml } from "./functions/exportEmail";

const success = await copyEmailHtml(contentBlocks);
```

### Download HTML File
```tsx
import { downloadEmailHtml } from "./functions/exportEmail";

downloadEmailHtml(contentBlocks, "my-email-template.html");
```

## Transform Functions

### Web Transform
```tsx
import { transformToWeb } from "./functions/transformToWeb";

const reactComponents = transformToWeb(contentBlocks);
```

### Email Transform
```tsx
import { transformToEmail } from "./functions/transformToEmail";

const emailHtml = transformToEmail(contentBlocks);
```

## Styling

The preview components use SCSS modules for scoped styling:
- **WebPreview**: Clean, modern web styles with responsive container
- **EmailPreview**: Iframe-based preview with email client simulation
- **ContentPreview**: Tab-based navigation with smooth transitions

## Future Enhancements

Potential improvements:
- [ ] Mobile/desktop responsive preview toggle
- [ ] Dark mode preview
- [ ] Custom color themes
- [ ] Email client compatibility testing
- [ ] A/B testing preview comparison
- [ ] Image optimization suggestions
- [ ] Accessibility checking
