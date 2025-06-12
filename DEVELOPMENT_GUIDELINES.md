# Development Guidelines - Car Rental Booking Portal

## 🎯 Core Development Principles

### **1. UI & Design System Rules**
- **ALWAYS enhance with beautiful UI** while **strictly following 4Sale design system components**
- **Component Priority**: Check `@mo_sami/web-design-system` library components first for any primitive component needs (buttons, inputs, toggles, etc.)
- **New Component Approval**: NEVER add a new component without explicit approval from project lead
- **Design Consistency**: Maintain consistent spacing, typography, and interaction patterns as per 4Sale DS
- **Custom UI Tokens**: NEVER add custom colors, spacing, or design tokens without explicit approval from project lead
- **Style Adherence**: ALWAYS follow the existing styles and colors defined in the project's design system

### **2. Internationalization (i18n) Rules**
- **MANDATORY i18n**: ALL user-facing text MUST use internationalization functions
- **No Hardcoded Text**: NEVER use hardcoded English (or any language) strings in UI components
- **Translation Pattern**: Always use `{t('translation.key')}` without fallback values
- **Parameter Interpolation**: Use proper i18n interpolation for dynamic content:
  ```typescript
  // ✅ CORRECT
  {t('cars.deleteConfirmMessage', {
    carName: `${car.brand} ${car.model}`,
    year: car.year
  })}
  
  // ❌ INCORRECT
  {t('cars.deleteConfirmMessage', 'Delete this car')} // No fallbacks
  "Delete this car" // No hardcoded text
  ```

### **3. Code Architecture & Structure**

#### **Business Logic Separation**
- **Mandatory Separation**: All business logic MUST be separated from presentation layer
- **Reusability Focus**: Design business logic to be reusable across different components
- **Documentation Required**: Every business logic function/module must include:
  ```typescript
  /**
   * Business Logic Documentation
   * @description What this logic does and its business purpose
   * @example Usage example
   * @param parameters Description of inputs
   * @returns Description of outputs
   */
  ```

#### **Function Reuse Protocol**
- **ALWAYS check existing functions** before implementing new business logic
- **Search locations**:
  - `src/hooks/` - Custom hooks
  - `src/utils/` - Utility functions
  - `src/services/` - API services
  - `src/context/` - Context providers
- **Extend vs Create**: Prefer extending existing functions over creating new ones

### **4. File Management Rules**

#### **File Creation Policy**
- **ALWAYS add** all necessary import statements, dependencies, and endpoints required to run the code
- **ALWAYS create** dependency management files when needed
- **Ensure immediate execution**: Code must be runnable immediately after creation
- **Prefer editing existing files** over creating new ones when functionality overlaps

#### **Dependencies & Imports**
- **Complete imports**: Include all necessary dependencies
- **Design System imports**: Always import from `@mo_sami/web-design-system` when available
- **Type safety**: Include proper TypeScript imports and types

## 🛠️ Implementation Standards

### **Component Development**

#### **@mo_sami/web-design-system Integration**
```typescript
// ✅ CORRECT: Use @mo_sami/web-design-system components
import { Button, Input, Modal } from '@mo_sami/web-design-system'

// ❌ INCORRECT: Creating custom primitives without approval
const CustomButton = () => { ... }
```

#### **Internationalization Pattern**
```typescript
// ✅ CORRECT: Proper i18n usage
import { useTranslation } from 'react-i18next'

const Component = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('cars.deleteConfirmMessage', { carName: car.name })}</p>
    </div>
  )
}

// ❌ INCORRECT: Hardcoded text or fallbacks
<h1>Welcome</h1> // No hardcoded text
<h1>{t('dashboard.welcome', 'Welcome')}</h1> // No fallbacks
```

#### **Business Logic Pattern**
```typescript
// ✅ CORRECT: Separated business logic
// File: src/hooks/useCarInventory.ts
/**
 * Car Inventory Business Logic
 * @description Manages car inventory operations including CRUD operations,
 * search, filtering, and data validation for the rental system
 * @example const { cars, addCar, updateCar } = useCarInventory()
 */
export const useCarInventory = () => {
  // Business logic here
}

// File: src/components/CarInventoryPage.tsx
import { useCarInventory } from '../hooks/useCarInventory'

const CarInventoryPage = () => {
  const { cars, addCar } = useCarInventory() // Reusable logic
  // Only presentation logic here
}
```

### **Function Reuse Example**
```typescript
// ✅ CORRECT: Check existing functions first
// Before creating new validation, check existing:
import { validateKuwaitiPhone } from '../utils/validation'

// ❌ INCORRECT: Creating duplicate logic
const validatePhone = (phone: string) => { ... } // May duplicate existing
```

## 📁 Project Structure Standards

### **Directory Organization**
```
src/
├── components/           # Presentation components only
├── hooks/               # Reusable business logic hooks
├── utils/               # Pure utility functions
├── services/            # API and external service logic
├── context/             # State management business logic
├── types/               # TypeScript definitions
└── compatibility/       # Design system compatibility wrappers
```

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `CarInventoryPage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCarInventory.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)
- **Business Logic**: Descriptive names indicating purpose (e.g., `carInventoryLogic.ts`)

## 🔄 Development Workflow

### **Before Creating New Code**
1. **Search existing codebase** for similar functionality
2. **Check `@mo_sami/web-design-system`** for available components
3. **Review compatibility wrappers** in `src/compatibility/`
4. **Verify i18n keys exist** for all user-facing text
5. **Document business logic** if creating new functions
6. **Request approval** for new primitive components or custom UI tokens

### **Code Review Checklist**
- [ ] Business logic separated from presentation
- [ ] `@mo_sami/web-design-system` components used where available
- [ ] All user-facing text uses i18n (no hardcoded strings)
- [ ] Existing functions checked and reused
- [ ] Complete imports and dependencies included
- [ ] Project styles and colors followed (no custom tokens without approval)
- [ ] Business logic documented with purpose and examples
- [ ] TypeScript types properly defined
- [ ] Code can run immediately

## 🎨 Design System Guidelines

### **Available Components**
```typescript
// Buttons
import { Button } from '@mo_sami/web-design-system'
<Button variant="primary" size="lg">{t('common.submit')}</Button>

// Form Elements
import { Input, Select, Switch, Slider } from '@mo_sami/web-design-system'

// Feedback
import { Badge, Progress, Alert } from '@mo_sami/web-design-system'

// Layout
import { Modal, Accordion, Card } from '@mo_sami/web-design-system'
```

### **Approved Color & Style Tokens**
- **Primary Colors**: `bg-primary-500`, `text-primary-600`, etc.
- **Surface Colors**: `bg-surface`, `bg-surface-container`
- **Text Colors**: `text-on-surface`, `text-on-surface-variant`
- **Error Colors**: `bg-error-600`, `text-error-600`
- **Success Colors**: `bg-success-600`, `text-success-600`
- **Typography**: `font-sakr` with weights (`font-bold`, `font-medium`, `font-normal`)

### **Component Approval Process**
1. **Check `@mo_sami/web-design-system` documentation** for existing solutions
2. **Verify compatibility wrappers** don't already solve the need
3. **Document business justification** for new component or custom token
4. **Request explicit approval** from project lead
5. **Create with design system patterns** if approved

## 🌐 Internationalization Standards

### **Translation Key Structure**
```typescript
// Hierarchical structure
{
  "dashboard": {
    "welcome": "Welcome Back!",
    "overview": "Business Overview"
  },
  "cars": {
    "deleteCar": "Delete Car",
    "deleteConfirmMessage": "You are about to delete {{carName}} ({{year}}).",
    "deleteWarning": "This action cannot be undone."
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### **i18n Best Practices**
- **Descriptive Keys**: Use clear, hierarchical translation keys
- **Parameter Interpolation**: Use `{{variable}}` syntax for dynamic content
- **No Fallbacks**: Never provide fallback values in t() function calls
- **Context Separation**: Group related translations logically

## 📝 Documentation Requirements

### **Business Logic Documentation Template**
```typescript
/**
 * [Function/Hook Name] - Business Logic
 * 
 * @description Clear explanation of what this logic does and why it exists
 * 
 * @businessPurpose Explain the business value and use cases
 * 
 * @example
 * ```typescript
 * const { data, loading, error } = useBusinessLogic(params)
 * ```
 * 
 * @param {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 * 
 * @reusability How this can be reused across different components
 * 
 * @dependencies List any dependencies or related functions
 */
```

### **Component Documentation**
```typescript
/**
 * [Component Name] - Presentation Component
 * 
 * @description UI component following @mo_sami/web-design-system
 * 
 * @businessLogic References to business logic hooks/functions used
 * 
 * @designSystemComponents List of @mo_sami/web-design-system components utilized
 * 
 * @i18nKeys List of translation keys used in component
 */
```

## 🚨 Anti-Patterns to Avoid

### **❌ DON'T DO:**
- Mix business logic with presentation components
- Create primitive components without checking `@mo_sami/web-design-system` first
- Use hardcoded text strings (always use i18n)
- Add custom colors or design tokens without approval
- Duplicate existing utility functions
- Skip documentation for business logic
- Create files without complete imports
- Bypass design system for standard UI elements
- Provide fallback values in translation functions

### **✅ DO:**
- Separate concerns cleanly
- Check `@mo_sami/web-design-system` components first
- Use i18n for ALL user-facing text
- Follow existing project styles and colors
- Reuse existing business logic
- Follow design system patterns
- Document business logic thoroughly
- Ensure code runs immediately
- Request approval for new components or custom tokens

---

*This document should be referenced for all development work on the Car Rental Booking Portal. Updates to these guidelines require approval from the project lead.* 