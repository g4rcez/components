# Autocomplete Component

A searchable select component with fuzzy matching, virtualized options, and dynamic option creation. Features keyboard navigation, custom renderers, and form integration.

## Import

```tsx
import { Autocomplete } from "@g4rcez/components/autocomplete";
```

## Basic Usage

```tsx
const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

<Autocomplete
  title="Choose a fruit"
  options={options}
  value="apple"
  onChange={(value) => console.log(value)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Field title/label |
| `value` | `string` | - | Current selected value |
| `options` | `AutocompleteItemProps[]` | - | Available options |
| `emptyMessage` | `Label` | - | Message when no options match |
| `dynamicOption` | `boolean` | `false` | Allow creating new options |
| `onChange` | `(value: string) => void` | - | Value change handler |
| ...InputFieldProps | | | All InputField props are supported |

## Option Structure

```tsx
type AutocompleteItemProps = {
  value: string;              // Option value
  label?: string;             // Display label (defaults to value)
  hidden?: boolean;           // Hide from search results
  disabled?: boolean;         // Disable selection
  "data-dynamic"?: string;    // Mark as dynamic option
  Render?: React.FC<OptionProps>; // Custom renderer
} & Record<`data-${string}`, string>; // Custom data attributes
```

## Examples

### Simple Autocomplete

```tsx
function SimpleAutocomplete() {
  const [selectedFruit, setSelectedFruit] = useState("");
  
  const fruits = [
    { value: "apple", label: "Apple 🍎" },
    { value: "banana", label: "Banana 🍌" },
    { value: "cherry", label: "Cherry 🍒" },
    { value: "date", label: "Date 🫒" },
    { value: "elderberry", label: "Elderberry 🫐" },
    { value: "fig", label: "Fig 🧅" },
    { value: "grape", label: "Grape 🍇" },
  ];

  return (
    <div className="space-y-4">
      <Autocomplete
        title="Select a fruit"
        placeholder="Search fruits..."
        options={fruits}
        value={selectedFruit}
        onChange={setSelectedFruit}
      />
      
      {selectedFruit && (
        <p>Selected: {fruits.find(f => f.value === selectedFruit)?.label}</p>
      )}
    </div>
  );
}
```

### Dynamic Option Creation

```tsx
function DynamicAutocomplete() {
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "css", label: "CSS" }
  ]);

  const handleChange = (value: string) => {
    setSelectedTag(value);
    
    // If it's a new tag (not in existing options), add it
    const existingTag = tags.find(tag => tag.value === value);
    if (!existingTag && value.trim()) {
      setTags(prev => [...prev, { value, label: value }]);
    }
  };

  return (
    <div className="space-y-4">
      <Autocomplete
        title="Select or create a tag"
        placeholder="Type to search or create..."
        options={tags}
        value={selectedTag}
        onChange={handleChange}
        dynamicOption={true}
        emptyMessage="Type to create a new tag"
      />
      
      <div className="space-y-2">
        <h4 className="font-medium">Available Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag.value}
              className={`px-2 py-1 rounded text-sm ${
                tag.value === selectedTag 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Custom Option Rendering

```tsx
function CustomRenderAutocomplete() {
  const [selectedUser, setSelectedUser] = useState("");
  
  const users = [
    { 
      value: "john_doe", 
      label: "John Doe",
      email: "john@example.com",
      avatar: "/avatars/john.jpg",
      department: "Engineering"
    },
    { 
      value: "jane_smith", 
      label: "Jane Smith",
      email: "jane@example.com",
      avatar: "/avatars/jane.jpg",
      department: "Design"
    },
    { 
      value: "bob_wilson", 
      label: "Bob Wilson",
      email: "bob@example.com", 
      avatar: "/avatars/bob.jpg",
      department: "Marketing"
    }
  ];

  // Custom renderer for user options
  const UserOption = ({ value, label, ...props }: any) => {
    const user = users.find(u => u.value === value);
    if (!user) return <div>{label}</div>;

    return (
      <div className="flex items-center gap-3 p-2">
        <img 
          src={user.avatar} 
          alt={user.label}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{user.label}</div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
        </div>
        <div className="text-xs text-gray-400">
          {user.department}
        </div>
      </div>
    );
  };

  const optionsWithRenderer = users.map(user => ({
    ...user,
    Render: UserOption
  }));

  return (
    <div className="space-y-4">
      <Autocomplete
        title="Assign to user"
        placeholder="Search users..."
        options={optionsWithRenderer}
        value={selectedUser}
        onChange={setSelectedUser}
        emptyMessage="No users found"
      />
      
      {selectedUser && (
        <div className="p-3 bg-gray-50 rounded">
          <p className="font-medium">Selected User:</p>
          <UserOption {...users.find(u => u.value === selectedUser)} />
        </div>
      )}
    </div>
  );
}
```

### Grouped Options with Categories

```tsx
function GroupedAutocomplete() {
  const [selectedItem, setSelectedItem] = useState("");
  
  const options = [
    // Frontend
    { value: "react", label: "React", category: "Frontend" },
    { value: "vue", label: "Vue.js", category: "Frontend" },
    { value: "angular", label: "Angular", category: "Frontend" },
    { value: "svelte", label: "Svelte", category: "Frontend" },
    
    // Backend
    { value: "nodejs", label: "Node.js", category: "Backend" },
    { value: "python", label: "Python", category: "Backend" },
    { value: "java", label: "Java", category: "Backend" },
    { value: "go", label: "Go", category: "Backend" },
    
    // Database
    { value: "postgresql", label: "PostgreSQL", category: "Database" },
    { value: "mongodb", label: "MongoDB", category: "Database" },
    { value: "redis", label: "Redis", category: "Database" },
  ];

  // Custom renderer that shows category
  const CategoryOption = ({ value, label, category, ...props }: any) => (
    <div className="flex items-center justify-between p-2">
      <span>{label}</span>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {category}
      </span>
    </div>
  );

  const optionsWithCategories = options.map(option => ({
    ...option,
    Render: CategoryOption
  }));

  return (
    <Autocomplete
      title="Select technology"
      placeholder="Search technologies..."
      options={optionsWithCategories}
      value={selectedItem}
      onChange={setSelectedItem}
      emptyMessage="No technologies found"
    />
  );
}
```

### Multi-Select Simulation

```tsx
function MultiSelectAutocomplete() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  
  const allSkills = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "nodejs", label: "Node.js" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" }
  ];

  // Filter out already selected skills
  const availableSkills = allSkills.filter(
    skill => !selectedSkills.includes(skill.value)
  );

  const handleSkillSelect = (skillValue: string) => {
    if (skillValue && !selectedSkills.includes(skillValue)) {
      setSelectedSkills(prev => [...prev, skillValue]);
      setCurrentInput("");
    }
  };

  const removeSkill = (skillValue: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillValue));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Skills</label>
        
        {/* Selected skills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSkills.map(skillValue => {
              const skill = allSkills.find(s => s.value === skillValue);
              return (
                <span 
                  key={skillValue}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill?.label}
                  <button
                    onClick={() => removeSkill(skillValue)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <Autocomplete
          placeholder="Add a skill..."
          options={availableSkills}
          value={currentInput}
          onChange={handleSkillSelect}
          emptyMessage="No more skills available"
        />
      </div>

      <div className="text-sm text-gray-600">
        Selected {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
```

### Form Integration

```tsx
function FormWithAutocomplete() {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    category: ""
  });

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" }
  ];

  const categories = [
    { value: "tech", label: "Technology" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <Autocomplete
        title="Country"
        placeholder="Select country..."
        options={countries}
        value={formData.country}
        onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
        required
      />

      <Autocomplete
        title="City"
        placeholder="Enter or select city..."
        options={[]} // Would be populated based on country
        value={formData.city}
        onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
        dynamicOption={true}
      />

      <Autocomplete
        title="Category"
        placeholder="Select category..."
        options={categories}
        value={formData.category}
        onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        emptyMessage="No categories found"
      />

      <button 
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
```

### Async Data Loading

```tsx
function AsyncAutocomplete() {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Debounced search effect
  useEffect(() => {
    if (searchText.length < 2) {
      setRepos([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        // Simulate GitHub API call
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${searchText}&per_page=10`
        );
        const data = await response.json();
        
        const formattedRepos = data.items?.map((repo: any) => ({
          value: repo.full_name,
          label: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          Render: RepoOption
        })) || [];
        
        setRepos(formattedRepos);
      } catch (error) {
        console.error("Failed to fetch repos:", error);
        setRepos([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const RepoOption = ({ value, description, stars }: any) => (
    <div className="p-2">
      <div className="font-medium text-sm">{value}</div>
      {description && (
        <div className="text-xs text-gray-600 truncate">{description}</div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        ⭐ {stars?.toLocaleString() || 0} stars
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Autocomplete
        title="Search GitHub Repositories"
        placeholder="Type to search repositories..."
        options={repos}
        value={selectedRepo}
        onChange={setSelectedRepo}
        onInputChange={setSearchText}
        emptyMessage={
          loading 
            ? "Searching..." 
            : searchText.length < 2 
              ? "Type at least 2 characters"
              : "No repositories found"
        }
      />

      {selectedRepo && (
        <div className="p-3 bg-gray-50 rounded">
          <p className="font-medium">Selected Repository:</p>
          <p className="text-sm text-gray-600">{selectedRepo}</p>
        </div>
      )}
    </div>
  );
}
```

## Features

### Fuzzy Search

The autocomplete uses an advanced fuzzy search algorithm that matches:

- Partial text matches
- Abbreviations (e.g., "JS" matches "JavaScript")
- Out-of-order characters
- Option labels and values

### Virtualization

For large option lists, the component uses virtualization to maintain performance:

```tsx
<Autocomplete
  options={thousandsOfOptions}
  // Automatically virtualizes for performance
/>
```

### Keyboard Navigation

- **Arrow Keys**: Navigate through options
- **Enter**: Select highlighted option
- **Escape**: Close dropdown
- **Tab**: Move to next field
- **Home/End**: Jump to first/last option

## Styling

The Autocomplete inherits styling from the Input component and can be customized:

```tsx
<Autocomplete
  className="my-autocomplete"
  containerProps={{ className: "my-container" }}
  // ... other props
/>
```

## Accessibility

- **ARIA Labels**: Proper autocomplete labeling
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Announces options and selection
- **Focus Management**: Proper focus handling
- **Role Attributes**: Correct ARIA roles

## Performance

- **Virtualized Scrolling**: Handles large datasets efficiently
- **Debounced Search**: Prevents excessive filtering
- **Memoized Components**: Optimized re-renders
- **Fuzzy Search Caching**: Cached search results

## Related Components

- **Select**: For simple dropdown selection
- **Input**: For text input with suggestions
- **CommandPalette**: For command-style search
- **MultiSelect**: For multiple selections