# Development Guidelines - Car Rental Booking Portal

## 🎯 Core Development Principles

### **1. UI & Design System Rules**
- **ALWAYS enhance with beautiful UI** while **strictly following 4Sale design system components**
- **Component Priority**: Check 4Sale design system components first for any primitive component needs (buttons, inputs, toggles, etc.)
- **New Component Approval**: NEVER add a new component without explicit approval from project lead
- **Design Consistency**: Maintain consistent spacing, typography, and interaction patterns as per 4Sale DS

### **2. Code Architecture & Structure**

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

### **3. File Management Rules**

#### **File Creation Policy**
- **ALWAYS add** all necessary import statements, dependencies, and endpoints required to run the code
- **ALWAYS create** dependency management files when needed
- **Ensure immediate execution**: Code must be runnable immediately after creation
- **Prefer editing existing files** over creating new ones when functionality overlaps

#### **Dependencies & Imports**
- **Complete imports**: Include all necessary dependencies
- **4Sale DS imports**: Always import from 4Sale design system when available
- **Type safety**: Include proper TypeScript imports and types

## 🛠️ Implementation Standards

### **Component Development**

#### **4Sale Design System Integration**
```typescript
// ✅ CORRECT: Use 4Sale components
import { Button, Input, Modal } from '@4sale/design-system'

// ❌ INCORRECT: Creating custom primitives without approval
const CustomButton = () => { ... }
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
└── compatibility/       # 4Sale DS compatibility wrappers
```

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `CarInventoryPage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCarInventory.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)
- **Business Logic**: Descriptive names indicating purpose (e.g., `carInventoryLogic.ts`)

## 🔄 Development Workflow

### **Before Creating New Code**
1. **Search existing codebase** for similar functionality
2. **Check 4Sale design system** for available components
3. **Review compatibility wrappers** in `src/compatibility/`
4. **Document business logic** if creating new functions
5. **Request approval** for new primitive components

### **Code Review Checklist**
- [ ] Business logic separated from presentation
- [ ] 4Sale design system components used where available
- [ ] Existing functions checked and reused
- [ ] Complete imports and dependencies included
- [ ] Business logic documented with purpose and examples
- [ ] TypeScript types properly defined
- [ ] Code can run immediately

## 🎨 4Sale Design System Guidelines

### **Available Components**
```typescript
// Buttons
import { Button } from '@4sale/design-system'
<Button variant="primary" size="medium">Submit</Button>

// Form Elements
import { Input, Select, Switch, Slider } from '@4sale/design-system'

// Feedback
import { Badge, Progress, Toast } from '@4sale/design-system'

// Layout
import { Modal, Accordion, Card } from '@4sale/design-system'
```

### **Compatibility Wrappers**
- Located in `src/compatibility/`
- Bridge between old API and 4Sale DS
- Prefer direct 4Sale DS usage when possible
- Update wrappers rather than bypassing them

### **Component Approval Process**
1. **Check 4Sale DS documentation** for existing solutions
2. **Verify compatibility wrappers** don't already solve the need
3. **Document business justification** for new component
4. **Request explicit approval** from project lead
5. **Create with 4Sale DS patterns** if approved

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
 * @description UI component following 4Sale design system
 * 
 * @businessLogic References to business logic hooks/functions used
 * 
 * @4saleComponents List of 4Sale DS components utilized
 */
```

## 🚨 Anti-Patterns to Avoid

### **❌ DON'T DO:**
- Mix business logic with presentation components
- Create primitive components without checking 4Sale DS first
- Duplicate existing utility functions
- Skip documentation for business logic
- Create files without complete imports
- Bypass 4Sale design system for standard UI elements

### **✅ DO:**
- Separate concerns cleanly
- Reuse existing business logic
- Follow 4Sale DS patterns
- Document business logic thoroughly
- Ensure code runs immediately
- Request approval for new components

---

*This document should be referenced for all development work on the Car Rental Booking Portal. Updates to these guidelines require approval from the project lead.* 