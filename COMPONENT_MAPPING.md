# 📊 Component Mapping: Current → @4saletech/web-design-system

## 🎯 Direct Replacements (Available in 4Sale DS)

| Current Component | 4Sale DS Component | Status | Notes |
|------------------|-------------------|---------|-------|
| `Button` | `Button` | ✅ **Direct Replace** | Same API, variants supported |
| `Input` | `Input` | ✅ **Direct Replace** | Text inputs with validation |
| `Alert` | `Alert` | ✅ **Direct Replace** | Same variants (info, success, warning, error) |
| `Badge` | `Badge` | ✅ **Direct Replace** | Status indicators |
| `Checkbox` | `Checkbox` | ✅ **Direct Replace** | Checkbox inputs |
| `Switch` | `Switch` | ✅ **Direct Replace** | Toggle switches |
| `Select` | `Select` | ✅ **Direct Replace** | Dropdown selectors |
| `Textarea` | `Textarea` | ✅ **Direct Replace** | Multi-line text inputs |
| `Tabs` | `Tabs` | ✅ **Direct Replace** | Tab navigation |
| `Pagination` | `Pagination` | ✅ **Direct Replace** | Page navigation |
| `Accordion` | `Accordion` | ✅ **Direct Replace** | Collapsible content |
| `Modal` | `Modal` | ✅ **Direct Replace** | Modal dialogs |
| `Tooltip` | `Tooltip` | ✅ **Direct Replace** | Hover tooltips |
| `Progress` | `Progress` | ✅ **Direct Replace** | Progress indicators |
| `Card` | `Card` | ✅ **Direct Replace** | Content containers |

## 🔄 Components Needing Adaptation

| Current Component | 4Sale DS Alternative | Migration Strategy |
|------------------|----------------------|-------------------|
| `Typography` | **Custom Wrapper** | Wrap 4Sale typography with our variant system |
| `Icon` | **Custom Wrapper** | Map to 4Sale icons + keep Kuwait flag |
| `PhoneInput` | **Custom Component** | Build on top of 4Sale Input |
| `LanguageSwitcher` | **Custom Component** | Build with 4Sale Button |
| `Loader` | `Progress` | Replace with circular progress |
| `NumberInput` | `Input` | Use Input with number validation |

## 🎨 Layout Components (No Direct Equivalent)

| Current Component | Migration Strategy |
|------------------|-------------------|
| `Form` | **Keep as wrapper** - Use Tailwind classes |
| `Sidebar` | **Navigation** component + custom layout |
| `BottomNavigation` | **Navigation** component + mobile styling |
| `DashboardLayout` | **Custom layout** with 4Sale components |
| `AuthLayout` | **Custom layout** with 4Sale Card |
| `HeroSection` | **Custom component** with 4Sale typography |
| `Navbar` | **Navigation** component |

## 🔧 Specialized Components (Keep Custom)

| Component | Reason | Action |
|-----------|---------|---------|
| `PricingTable` | **Business-specific** | Migrate to use 4Sale primitives |
| `CarImageCell` | **Business-specific** | Update to use 4Sale Card/Typography |
| `StatusTags` | **Business-specific** | Update to use 4Sale Badge |
| `ActionsDropdown` | **Business-specific** | Update to use 4Sale DropdownMenu |
| `CarFormSteps` | **Business-specific** | Update to use 4Sale form components |
| `OnboardingTour` | **Business-specific** | Update to use 4Sale Modal/Tooltip |
| `OfficeConfigSection` | **Business-specific** | Update to use 4Sale form components |

## 📝 Toast System Replacement

| Current | 4Sale DS | Migration |
|---------|----------|-----------|
| `Toast.tsx` | `Toast` | ✅ Direct replacement |
| `useSuccessToast()` | Built-in | Update import paths |
| `useErrorToast()` | Built-in | Update import paths |

## 🎯 Migration Priority Matrix

### **Priority 1: Core Primitives (Week 1)**
- Button, Input, Alert, Badge, Checkbox → Direct replacements

### **Priority 2: Form Components (Week 2)**  
- Select, Textarea, PhoneInput, NumberInput → Mostly direct

### **Priority 3: Layout Components (Week 3)**
- Modal, Accordion, Tabs, Navigation → Direct + custom layouts

### **Priority 4: Business Components (Week 4)**
- PricingTable, CarFormSteps, OnboardingTour → Update internals

### **Priority 5: Specialized Components (Week 5)**
- StatusTags, ActionsDropdown, CarImageCell → Custom adaptations

## 🔍 API Compatibility Analysis

### **Breaking Changes Expected:**
1. **Typography variants** - Need custom mapping
2. **Icon names** - May need remapping
3. **Theme system** - Switch from MUI theme to Tailwind
4. **Spacing system** - Switch to Tailwind spacing
5. **Color references** - Update to 4Sale color palette

### **Non-Breaking:**
- Event handlers (onClick, onChange)
- Form validation patterns
- State management
- Routing logic
- API calls 