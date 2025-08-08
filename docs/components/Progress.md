# Progress Component

A progress bar component built on Radix UI Progress primitive with customizable styling, labels, and smooth transitions for indicating task completion or loading states.

## Import

```tsx
import { Progress } from "@g4rcez/components/progress";
```

## Basic Usage

```tsx
<Progress percent={75} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percent` | `number` | - | Current progress percentage (0-100) |
| `max` | `number` | Radix default | Maximum value (inherited from Radix UI) |
| `label` | `Label` | - | Custom label (overrides percentage display) |
| `container` | `string` | - | Additional container CSS classes |
| `className` | `string` | - | Progress bar CSS classes |
| `textClassName` | `string` | - | Text overlay CSS classes |

## Examples

### Basic Progress Bar

```tsx
function BasicProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 10);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return <Progress percent={progress} />;
}
```

### File Upload Progress

```tsx
function FileUploadProgress() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={simulateUpload} 
        disabled={isUploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Start Upload"}
      </button>
      
      {isUploading && (
        <div>
          <Progress 
            percent={uploadProgress} 
            label={`Uploading... ${uploadProgress}%`}
          />
        </div>
      )}
    </div>
  );
}
```

### Custom Styled Progress

```tsx
<Progress 
  percent={60}
  container="bg-gray-100 border rounded-full h-3"
  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
  textClassName="text-white font-semibold text-xs"
/>
```

### Progress with Custom Labels

```tsx
function CustomLabelsExample() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const percent = (step / totalSteps) * 100;

  const labels = [
    "Starting...",
    "Processing data...",
    "Analyzing results...", 
    "Generating report...",
    "Complete!"
  ];

  return (
    <div className="space-y-4">
      <Progress 
        percent={percent}
        label={labels[step - 1]}
      />
      
      <div className="flex gap-2">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={() => setStep(Math.min(totalSteps, step + 1))}
          disabled={step === totalSteps}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Multi-Step Form Progress

```tsx
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const steps = [
    "Personal Information",
    "Contact Details", 
    "Preferences",
    "Review & Submit"
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        
        <Progress 
          percent={progress}
          container="bg-gray-200 h-2 rounded-full"
          className="bg-green-500 h-full rounded-full transition-all duration-500"
        />
        
        <div className="mt-2">
          <h2 className="text-xl font-semibold">{steps[currentStep - 1]}</h2>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded border">
        <p>Step {currentStep} content goes here...</p>
      </div>

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-green-500"
        >
          {currentStep === totalSteps ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
```

### Download Progress with Speed

```tsx
function DownloadProgress() {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const startDownload = () => {
    setIsDownloading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setSpeed(0);
          return 100;
        }
        
        const increment = Math.random() * 5 + 1;
        setSpeed(Math.random() * 10 + 2); // MB/s
        return Math.min(100, prev + increment);
      });
    }, 200);
  };

  const formatSpeed = (mbps: number) => `${mbps.toFixed(1)} MB/s`;

  return (
    <div className="space-y-4">
      <button 
        onClick={startDownload}
        disabled={isDownloading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isDownloading ? "Downloading..." : "Start Download"}
      </button>
      
      {isDownloading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>downloading-file.zip</span>
            <span>{formatSpeed(speed)}</span>
          </div>
          
          <Progress 
            percent={progress}
            container="bg-gray-200 h-4 rounded"
            className="bg-green-500 h-full rounded transition-all duration-200"
            textClassName="text-white text-sm font-medium"
          />
        </div>
      )}
    </div>
  );
}
```

### Skill Level Progress

```tsx
function SkillProgress() {
  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "React", level: 95 },
    { name: "Node.js", level: 75 },
    { name: "Python", level: 60 }
  ];

  const getColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Technical Skills</h3>
      
      {skills.map(skill => (
        <div key={skill.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{skill.name}</span>
            <span className="text-gray-600">{skill.level}%</span>
          </div>
          
          <Progress 
            percent={skill.level}
            container="bg-gray-200 h-2 rounded-full"
            className={`${getColor(skill.level)} h-full rounded-full transition-all duration-1000`}
          />
        </div>
      ))}
    </div>
  );
}
```

### Loading States

```tsx
function LoadingStates() {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const startLoading = async () => {
    setLoadingState('loading');
    setProgress(0);

    // Simulate loading with varying speeds
    const stages = [
      { target: 20, duration: 500 },   // Quick start
      { target: 40, duration: 1000 },  // Slower
      { target: 80, duration: 800 },   // Medium
      { target: 100, duration: 300 }   // Quick finish
    ];

    for (const stage of stages) {
      await animateProgress(progress, stage.target, stage.duration);
    }

    setLoadingState('complete');
    setTimeout(() => {
      setLoadingState('idle');
      setProgress(0);
    }, 2000);
  };

  const animateProgress = (from: number, to: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const steps = 20;
      const increment = (to - from) / steps;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setProgress(from + (increment * currentStep));

        if (currentStep >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const getLabel = () => {
    switch (loadingState) {
      case 'loading': return `Loading... ${Math.round(progress)}%`;
      case 'complete': return 'Complete!';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={startLoading}
        disabled={loadingState === 'loading'}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loadingState === 'loading' ? 'Loading...' : 'Start Loading'}
      </button>

      {loadingState !== 'idle' && (
        <Progress 
          percent={progress}
          label={getLabel()}
          container={`h-6 rounded-lg ${
            loadingState === 'complete' ? 'bg-green-100' : 'bg-gray-200'
          }`}
          className={`h-full rounded-lg transition-all duration-300 ${
            loadingState === 'complete' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          textClassName="text-white font-medium text-sm"
        />
      )}
    </div>
  );
}
```

## Accessibility

The Progress component includes proper accessibility features:

- **ARIA Labels**: Built-in progress labeling
- **Screen Reader Support**: Announces progress changes
- **Semantic HTML**: Uses proper progress element
- **Keyboard Accessible**: Works with assistive technologies

```tsx
<Progress 
  percent={50}
  aria-label="File upload progress"
  role="progressbar"
  aria-valuenow={50}
  aria-valuemin={0}
  aria-valuemax={100}
/>
```

## Performance

- Built on Radix UI for optimal performance
- Smooth transitions without causing layout shifts  
- Efficient re-rendering with proper memoization
- Lightweight with minimal dependencies

## Related Components

- **Skeleton**: For loading placeholders
- **Notifications**: For progress notifications  
- **Modal**: For modal dialogs with progress
- **Button**: For controlling progress actions