# Email Attachments Component

This module provides a comprehensive UI for managing email attachments.

## Features

- **List Attachments**: Display all files attached to an email
- **Upload New Files**: Modal interface for uploading new attachments
- **Delete Attachments**: Remove unwanted files
- **Download Attachments**: Direct download links for each file

## Structure

```
Emailattachments/
├── components/
│   ├── AttachmentsList.tsx       # List container component
│   ├── AttachmentItem.tsx        # Individual attachment display
│   └── UploadAttachmentModal.tsx # Upload modal interface
├── functions/
│   ├── uploadFileAndCreateRecord.ts # File upload logic
│   └── formatFileSize.ts            # File size formatting utility
├── EmailAttachments.tsx          # Main component
├── types.d.ts                    # TypeScript definitions
└── index.ts                      # Module exports

```

## Usage

The component is automatically integrated into the Email page and appears when the "Anhänge" (Attachments) tab is selected.

```tsx
<EmailAttachments emailId={emailId} email={email} />
```

## Data Flow

1. **Display**: Fetches files from "File" class where `reference_id` matches `emailId`
2. **Upload**: 
   - Creates a new record in the "File" class
   - Stores the file in the "file" field
   - Sets "reference_id" to the email's objectId
   - Adds the file's objectId to email's "attachments" array
3. **Delete**: Removes the file record from the database

## Required Fields

When uploading a file:
- **title** (string, required): Display name for the file
- **file** (File object, required): The actual file to upload
- **reference_id** (string, automatic): Set to email.objectId

## File Class Structure

```typescript
class File {
  objectId: string;
  title: string;        // User-provided title (required)
  file: ParseFile;      // The uploaded file
  reference_id: string; // Email's objectId
  createdAt: Date;
}
```

## Email Attachments Field

The email's `attachments` field is an array of File objectIds:

```typescript
email.attachments = ["fileId1", "fileId2", "fileId3"];
```
