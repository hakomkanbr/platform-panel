# Relations Select Components

This document explains the Relations functionality added to the Content Management System.

## Components

### 1. RelationSelect (`select-xhr-relations.tsx`)
Fetches and displays all relations for a specific module.

**Props:**
- `moduleSlug`: The slug of the current module
- `onRelationSelect`: Callback when a relation is selected
- `debounceTimeout`: Debounce timeout for API calls (default: 800ms)

**Features:**
- Fetches relations from `/admin/Relation?moduleSlug={moduleSlug}`
- Displays relation name, type, and target module
- Shows relation type (One-to-One, One-to-Many, Many-to-Many)
- Custom dropdown rendering with icons and descriptions
- Simple selected value display to avoid UI issues

### 2. RelatedContentSelect (`select-xhr-related-content.tsx`)
Fetches and displays content from the related module.

**Props:**
- `relatedModuleSlug`: The slug of the related module
- `relationType`: The type of relation (1=OneToOne, 2=OneToMany, 3=ManyToMany)
- `languageSlug`: Current language slug
- `debounceTimeout`: Debounce timeout for API calls (default: 800ms)

**Features:**
- Fetches content from `/Admin/Content/GetAll`
- Automatically handles single/multiple selection based on relation type
- Shows content title, publish status, and creation date
- Custom dropdown rendering with status tags and dates
- Supports filtering by content title

## Relation Types Control

The system automatically handles different relation types:

- **One-to-One (1)**: Single selection only
- **One-to-Many (2)**: Multiple selection allowed
- **Many-to-Many (3)**: Multiple selection allowed

## Usage in Content Create/Update

The relations functionality is integrated into the content create/update form:

1. **Relations Card**: Added to the sidebar after Categories
2. **Two-step selection**:
   - First: Select a relation from available relations for the module
   - Second: Select content from the related module (appears after relation selection)
3. **Visual feedback**: Shows selected relation type and target module
4. **Form integration**: Properly handles form data submission

## API Integration

### Data Structure Sent to Backend:
```javascript
{
  // ... other content fields
  relations: [{
    relationId: number,
    relatedContentIds: number[]
  }]
}
```

### Expected API Responses:

**Relations API** (`/admin/Relation?moduleSlug={slug}`):
```javascript
{
  data: [{
    id: number,
    name: string,
    relationType: number, // 1, 2, or 3
    relatedModuleSlug: string,
    relatedModuleName: string
  }]
}
```

**Content API** (`/Admin/Content/GetAll`):
```javascript
{
  data: [{
    id: number,
    title: string,
    published: boolean,
    createdAt: string
  }]
}
```

## Styling

Custom CSS classes added to `create-update.css`:
- `.relations-card`: Main relations card styling
- `.relations-card .ant-card-head`: Header styling with gradient
- `.relations-card .ant-select-selection-item`: Selected item styling
- `.relations-card .ant-alert`: Alert styling for relation info

## Error Handling

- Network errors are logged to console
- Empty states show appropriate messages
- Loading states with spinners
- Graceful fallbacks for missing data

## Testing

A test component is available at `test-relations.tsx` for development and debugging purposes.