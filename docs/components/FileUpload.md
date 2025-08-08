# FileUpload Component

A comprehensive drag-and-drop file upload component with preview, file management, and modal viewer support. Features thumbnails for images, file type icons, and individual file deletion.

## Import

```tsx
import { FileUpload } from "@g4rcez/components/file-upload";
```

## Basic Usage

```tsx
function BasicFileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload
      files={files}
      onDrop={setFiles}
      accept="image/*"
      multiple
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `File[]` | - | Controlled files array |
| `onDrop` | `(files: File[]) => void` | - | File drop/selection handler |
| `onDeleteFile` | `(file: File) => void` | - | Individual file deletion handler |
| `idle` | `React.ReactElement` | - | Custom idle state component |
| `File` | `React.FC<{file: File}>` | - | Custom file renderer |
| `accept` | `string` | - | Accepted file types (e.g., "image/*") |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxFiles` | `number` | - | Maximum number of files |
| `maxSize` | `number` | - | Maximum file size in bytes |
| `disabled` | `boolean` | `false` | Disable the upload area |
| ...DropzoneProps | | | All react-dropzone props supported |

## Examples

### Image Upload with Preview

```tsx
function ImageUpload() {
  const [images, setImages] = useState<File[]>([]);

  const handleDrop = (newFiles: File[]) => {
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleDelete = (fileToDelete: File) => {
    setImages(prev => prev.filter(file => file !== fileToDelete));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Images</h3>
      
      <FileUpload
        files={images}
        onDrop={handleDrop}
        onDeleteFile={handleDelete}
        accept="image/*"
        multiple
        maxFiles={10}
        maxSize={5 * 1024 * 1024} // 5MB
      />

      {images.length > 0 && (
        <div className="text-sm text-gray-600">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
```

### Document Upload with File Types

```tsx
function DocumentUpload() {
  const [documents, setDocuments] = useState<File[]>([]);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
        <p className="text-sm text-gray-600 mb-4">
          Accepted formats: PDF, DOC, DOCX, XLS, XLSX (max 10MB each)
        </p>
      </div>

      <FileUpload
        files={documents}
        onDrop={setDocuments}
        onDeleteFile={(file) => {
          setDocuments(prev => prev.filter(f => f !== file));
        }}
        accept={acceptedTypes}
        multiple
        maxSize={10 * 1024 * 1024} // 10MB
      />

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Documents:</h4>
          <ul className="space-y-1 text-sm">
            {documents.map((doc, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{doc.name}</span>
                <span className="text-gray-500">
                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Custom Idle State

```tsx
function CustomIdleUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const CustomIdle = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <CloudUploadIcon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Upload your files
      </h3>
      <p className="text-gray-600 mb-4">
        Drag and drop files here, or click to browse
      </p>
      <div className="text-sm text-gray-500">
        Supports: Images, PDFs, Documents up to 25MB
      </div>
    </div>
  );

  return (
    <FileUpload
      files={files}
      onDrop={setFiles}
      idle={<CustomIdle />}
      accept="image/*,.pdf,.doc,.docx"
      multiple
      maxSize={25 * 1024 * 1024}
    />
  );
}
```

### Single File Upload with Replace

```tsx
function SingleFileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]); // Only take the first file
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Profile Picture</h3>
        <p className="text-sm text-gray-600">
          Upload a profile picture (JPG, PNG, max 2MB)
        </p>
      </div>

      <FileUpload
        files={file ? [file] : []}
        onDrop={handleDrop}
        onDeleteFile={handleDelete}
        accept="image/jpeg,image/png"
        multiple={false}
        maxSize={2 * 1024 * 1024} // 2MB
      />

      {file && (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Profile picture ready to upload</span>
        </div>
      )}
    </div>
  );
}
```

### Form Integration with Validation

```tsx
function FormWithFileUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachments: [] as File[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.attachments.length === 0) {
      newErrors.attachments = "At least one attachment is required";
    }
    
    const oversizedFiles = formData.attachments.filter(
      file => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      newErrors.attachments = "Some files exceed the 5MB limit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Attachments *
        </label>
        <FileUpload
          files={formData.attachments}
          onDrop={(files) => setFormData(prev => ({ ...prev, attachments: files }))}
          onDeleteFile={(file) => {
            setFormData(prev => ({
              ...prev,
              attachments: prev.attachments.filter(f => f !== file)
            }));
          }}
          accept="image/*,.pdf,.doc,.docx"
          multiple
          maxSize={5 * 1024 * 1024}
        />
        {errors.attachments && (
          <p className="text-red-600 text-sm mt-1">{errors.attachments}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
```

### Custom File Renderer

```tsx
function CustomFileRenderer() {
  const [files, setFiles] = useState<File[]>([]);

  const CustomFileItem = ({ file }: { file: File }) => {
    const isImage = file.type.startsWith('image/');
    const fileSize = (file.size / 1024).toFixed(1);
    
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-gray-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{file.name}</div>
          <div className="text-xs text-gray-500">
            {fileSize} KB • {file.type || 'Unknown type'}
          </div>
          <div className="text-xs text-gray-400">
            Modified: {new Date(file.lastModified).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <EyeIcon className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={() => {
              setFiles(prev => prev.filter(f => f !== file));
            }}
            className="p-1 hover:bg-red-100 rounded"
          >
            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <FileUpload
      files={files}
      onDrop={setFiles}
      File={CustomFileItem}
      multiple
    />
  );
}
```

### Progress Upload Simulation

```tsx
function ProgressUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const simulateUpload = async (filesToUpload: File[]) => {
    setUploading(true);
    
    for (const file of filesToUpload) {
      const fileId = `${file.name}-${file.size}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
    }
    
    setUploading(false);
    setUploadProgress({});
  };

  const handleDrop = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    simulateUpload(newFiles);
  };

  const FileWithProgress = ({ file }: { file: File }) => {
    const fileId = `${file.name}-${file.size}`;
    const progress = uploadProgress[fileId];
    const isUploading = progress !== undefined;
    const isComplete = progress === 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">{file.name}</span>
          <span className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
        </div>
        
        {isUploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{isComplete ? 'Complete' : 'Uploading...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isComplete ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <FileUpload
        files={files}
        onDrop={handleDrop}
        onDeleteFile={(file) => {
          setFiles(prev => prev.filter(f => f !== file));
        }}
        File={FileWithProgress}
        multiple
        disabled={uploading}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Uploading files...</span>
        </div>
      )}
    </div>
  );
}
```

## File Type Support

The FileUpload component provides different presentations based on file types:

### Images
- **Thumbnail Preview**: Shows image thumbnails
- **Modal Viewer**: Click to view full-size image
- **Supported Formats**: JPG, PNG, GIF, WebP, SVG

### Videos  
- **Thumbnail**: Shows video thumbnail
- **Modal Player**: Click to play video
- **Supported Formats**: MP4, WebM, OGG

### Audio
- **Audio Icon**: Shows audio file icon  
- **Modal Player**: Click to play audio
- **Supported Formats**: MP3, WAV, OGG

### Documents
- **File Type Icons**: PDF, Excel, Word, PowerPoint icons
- **File Info**: Shows file size and type
- **Download Action**: Click to download

## Drag and Drop States

The component provides visual feedback for drag and drop:

- **Idle**: Default upload area
- **Drag Over**: Highlighted when files are dragged over
- **Drag Active**: Active state during drag
- **Drop Target**: Visual feedback for valid drop area

## Accessibility

- **Keyboard Navigation**: Fully keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Clear focus indicators
- **File Information**: Accessible file details

## Error Handling

```tsx
<FileUpload
  files={files}
  onDrop={setFiles}
  onError={(error) => {
    console.error("Upload error:", error);
    // Handle errors (file too large, wrong type, etc.)
  }}
  maxSize={5 * 1024 * 1024}
  accept="image/*"
/>
```

## Performance

- **Lazy Loading**: File previews loaded on demand
- **Memory Management**: Proper cleanup of object URLs
- **Virtualization**: Efficient rendering of large file lists
- **Throttled Updates**: Optimized progress updates

## Related Components

- **Input**: For file input elements
- **Progress**: For upload progress indication
- **Modal**: For file preview modals
- **Button**: For upload trigger buttons