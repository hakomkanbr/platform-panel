# 🌐 Enhanced Language Select Component

A professional, feature-rich language selection component with multiple variants and responsive design.

## ✨ Features

### 🎨 **Multiple Variants**
- **Default**: Full-featured with label, value, and badge
- **Compact**: Streamlined design with badge counter
- **Minimal**: Text-only button for subtle integration

### 📏 **Size Options**
- **Small**: 40px height, compact spacing
- **Default**: 48px height, balanced design
- **Large**: 56px height, spacious layout

### 🧠 **Smart Behavior**
- **No Languages**: Returns null (hidden)
- **Single Language**: Shows static display without dropdown
- **Multiple Languages**: Full dropdown functionality

### 🎯 **Professional Design**
- Clean, modern interface
- Consistent with system colors
- Smooth hover and focus states
- Accessibility-compliant

## 🚀 Usage Examples

### Basic Usage
```tsx
import LanguageSelect from '@/components/elements/language-select';

// Default variant
<LanguageSelect 
  title="Choose Language"
  onClick={(e) => console.log('Language changed:', e.key)}
  singleItem={null}
/>
```

### Size Variants
```tsx
// Small size
<LanguageSelect 
  title="Language"
  size="small"
  variant="compact"
/>

// Large size
<LanguageSelect 
  title="Select Language"
  size="large"
  variant="default"
/>
```

### Style Variants
```tsx
// Compact variant with badge
<LanguageSelect 
  title="Language"
  variant="compact"
  size="default"
/>

// Minimal variant for headers
<LanguageSelect 
  title="EN"
  variant="minimal"
  size="small"
/>
```

## 🎨 Design System

### **Color Palette**
- **Primary**: #3b82f6 (Blue)
- **Text Primary**: #1f2937 (Dark Gray)
- **Text Secondary**: #6b7280 (Medium Gray)
- **Border**: #d1d5db (Light Gray)
- **Background**: #ffffff (White)
- **Hover**: #fafbff (Light Blue)

### **Typography**
- **Label**: 11px, uppercase, medium weight
- **Value**: 14px, semibold weight
- **Menu Items**: 14px, medium weight

### **Spacing**
- **Default Padding**: 12px horizontal, 16px vertical
- **Small Padding**: 8px horizontal, 12px vertical
- **Large Padding**: 16px horizontal, 20px vertical

## 📱 Responsive Behavior

### **Desktop (> 768px)**
- Full-sized buttons with complete labels
- Spacious dropdown menus
- All variants available

### **Tablet (768px - 480px)**
- Slightly reduced sizes
- Maintained functionality
- Optimized touch targets

### **Mobile (< 480px)**
- Compact sizing
- Reduced text sizes
- Touch-optimized interface

## 🔧 Props Interface

```typescript
interface LanguageSelectProps {
  title: string;                    // Placeholder text
  singleItem: React.ReactNode;      // Custom single language display
  onClick?: MenuProps['onClick'];   // Language change handler
  size?: "small" | "default" | "large";     // Size variant
  variant?: "default" | "compact" | "minimal"; // Style variant
}
```

## 🎯 Component States

### **Empty State**
```tsx
// No languages available
languages.list.length === 0
// Returns: null (component hidden)
```

### **Single Language**
```tsx
// Only one language available
languages.list.length === 1
// Returns: Static display with language name
```

### **Multiple Languages**
```tsx
// Multiple languages available
languages.list.length > 1
// Returns: Full dropdown with selection
```

## 🎨 Visual Examples

### Default Variant
```
┌─────────────────────────────────────┐
│ 🌐  LANGUAGE                    2 ▼ │
│     English                         │
└─────────────────────────────────────┘
```

### Compact Variant
```
┌─────────────────────────┐
│ 🌐 English    2    ▼   │
└─────────────────────────┘
```

### Minimal Variant
```
🌐 English
```

## 🔄 State Management

### **Redux Integration**
- Uses `useSelector` for language state
- Dispatches `setSelectedLang` on change
- Automatically updates UI on state change

### **Language State Structure**
```typescript
interface LanguageState {
  list: ILanguage[];           // Available languages
  selectedLang: ILanguage;     // Currently selected language
}

interface ILanguage {
  name: string;                // Display name
  slug: string;                // Unique identifier
}
```

## 🎯 Accessibility Features

### **Keyboard Navigation**
- Full keyboard support
- Tab navigation
- Enter/Space activation
- Arrow key menu navigation

### **Screen Reader Support**
- Proper ARIA labels
- Role definitions
- State announcements
- Focus management

### **Visual Indicators**
- Clear focus outlines
- High contrast ratios
- Consistent hover states
- Loading indicators

## 🚀 Advanced Features

### **Badge Counter**
- Shows total language count
- Color-coded by variant
- Responsive sizing
- Optional display

### **Selected State Indicator**
- Checkmark for selected language
- Color highlighting
- Visual feedback
- Consistent styling

### **Smooth Animations**
- Dropdown arrow rotation
- Hover transitions
- Focus state changes
- Loading animations

## 🔧 Customization

### **CSS Custom Properties**
```css
.language-select-button {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --border-color: #d1d5db;
  --hover-bg: #fafbff;
}
```

### **Theme Integration**
- Follows system color scheme
- Consistent with other components
- Easy theme switching
- Dark mode ready

## 📊 Performance

### **Optimizations**
- Memoized language list
- Efficient re-renders
- Minimal DOM updates
- Lazy loading ready

### **Bundle Size**
- Lightweight implementation
- Tree-shakeable
- No external dependencies
- Optimized CSS

## 🧪 Testing

### **Test Cases**
- Empty language list
- Single language display
- Multiple language selection
- Responsive behavior
- Accessibility compliance

### **Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

This enhanced Language Select component provides a professional, accessible, and highly customizable solution for language selection in modern web applications.