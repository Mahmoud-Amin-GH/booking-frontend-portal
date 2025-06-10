# 📅 5-Week 4Sale Design System Migration Plan

## 🎯 **WEEK 1: Foundation & Setup**

### **Day 1-2: Environment Setup**
```bash
# 1. Backup current codebase
git checkout -b migration-4sale-ds

# 2. Install 4Sale Design System
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @4saletech/web-design-system

# 3. Update Tailwind configuration
# 4. Remove MUI theme files
# 5. Test basic build
```

### **Day 3-4: Create Migration Framework**
- [ ] Create `src/design_system_4sale/` directory
- [ ] Build compatibility layer for smooth transition
- [ ] Create component mapping documentation
- [ ] Set up parallel import structure

### **Day 5: Test Login Page Migration**
- [ ] Migrate Login page as proof of concept
- [ ] Test all functionality (forms, validation, RTL)
- [ ] Document any issues found
- [ ] **Checkpoint**: Login page working with 4Sale DS

---

## 🎯 **WEEK 2: Core Components Migration**

### **Priority 1: Form Components**
- [ ] **Button** → 4Sale Button (30 usages)
- [ ] **Input** → 4Sale Input (25 usages) 
- [ ] **Checkbox** → 4Sale Checkbox (8 usages)
- [ ] **Alert** → 4Sale Alert (12 usages)

### **Migration Process per Component:**
1. **Identify all usages** with `grep -r "import.*Button" src/`
2. **Create compatibility wrapper** if API differs
3. **Update imports** file by file
4. **Test functionality** in each context
5. **Update exports** in design system index

### **End of Week 2 Deliverables:**
- [ ] All form components migrated
- [ ] Authentication flows working
- [ ] No breaking changes in functionality
- [ ] **Checkpoint**: Login, Signup, OTP pages working

---

## 🎯 **WEEK 3: Layout & Navigation Migration**

### **Priority 2: Layout Components**
- [ ] **Modal** → 4Sale Modal (6 usages)
- [ ] **Accordion** → 4Sale Accordion (4 usages)
- [ ] **Tabs** → 4Sale Tabs (3 usages)
- [ ] **Navigation** → Custom with 4Sale Sidebar
- [ ] **DashboardLayout** → Rebuild with 4Sale components

### **Complex Migrations:**
```typescript
// Old: Custom Sidebar
import { Sidebar } from '../design_system';

// New: 4Sale Navigation + custom layout
import { Navigation } from '@4saletech/web-design-system';
```

### **End of Week 3 Deliverables:**
- [ ] Dashboard navigation working
- [ ] All modals and overlays migrated
- [ ] Main layout responsive on mobile
- [ ] **Checkpoint**: Full app navigation functional

---

## 🎯 **WEEK 4: Business Components Migration**

### **Priority 3: Complex Business Logic**
- [ ] **PricingTable** → Update to use 4Sale primitives
- [ ] **CarFormSteps** → Migrate forms to 4Sale
- [ ] **OnboardingTour** → Update modals/tooltips
- [ ] **CarImageCell** → Update with 4Sale Card
- [ ] **StatusTags** → Update with 4Sale Badge

### **PricingTable Migration Strategy:**
```typescript
// Keep the table structure, replace internal components:
// MUI components → 4Sale components
// Keep business logic intact
// Update styling with Tailwind classes
```

### **Testing Focus:**
- [ ] Car inventory management
- [ ] Booking flow end-to-end
- [ ] Admin configuration pages
- [ ] Data display accuracy

### **End of Week 4 Deliverables:**
- [ ] All business components migrated
- [ ] Full booking flow working
- [ ] Admin dashboard functional
- [ ] **Checkpoint**: Complete feature parity

---

## 🎯 **WEEK 5: Final Polish & Cleanup**

### **Priority 4: Final Details**
- [ ] **Typography** → Fine-tune sakrPro font usage
- [ ] **Icons** → Map to 4Sale icon set
- [ ] **Colors** → Verify 4Sale brand compliance
- [ ] **Spacing** → Audit Tailwind spacing usage
- [ ] **Toast System** → Replace with 4Sale Toast

### **Quality Assurance:**
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] RTL layout verification
- [ ] Performance audit
- [ ] Accessibility compliance

### **Cleanup Tasks:**
- [ ] Remove all MUI imports
- [ ] Delete unused theme files
- [ ] Update package.json dependencies
- [ ] Clean up custom CSS files
- [ ] Update documentation

### **End of Week 5 Deliverables:**
- [ ] 100% 4Sale Design System usage
- [ ] Zero MUI dependencies
- [ ] All tests passing
- [ ] Performance baseline met
- [ ] **Final Checkpoint**: Production ready

---

## 📊 **Success Metrics**

### **Functionality (Must Have)**
- ✅ All existing features work identically
- ✅ No breaking changes in user experience
- ✅ Form validation and error handling intact
- ✅ Bilingual support (Arabic/English) preserved
- ✅ Mobile responsiveness maintained

### **Code Quality (Should Have)**
- ✅ TypeScript type safety maintained
- ✅ Component APIs consistent
- ✅ Import statements clean and organized
- ✅ No console errors or warnings
- ✅ Linting passes without issues

### **Performance (Nice to Have)**
- ✅ Bundle size improvement (target: 10% reduction)
- ✅ Page load speed maintained or improved
- ✅ Memory usage optimized
- ✅ No performance regressions

### **Design (Must Have)**
- ✅ 4Sale brand guidelines compliance
- ✅ sakrPro font implementation
- ✅ Color palette accuracy (#1D8EFF, #0C86AE)
- ✅ Visual consistency across all pages
- ✅ Kuwait market localization preserved

---

## 🔧 **Tools & Scripts for Migration**

### **1. Component Usage Finder**
```bash
# Find all usages of a component
grep -r "import.*Button" src/ --include="*.tsx" --include="*.ts"
```

### **2. Mass Import Replacement**
```bash
# Replace import paths (use with caution)
find src/ -name "*.tsx" -exec sed -i 's/from "..\/design_system"/from "@4saletech\/web-design-system"/g' {} \;
```

### **3. Pre-migration Checklist Script**
```bash
#!/bin/bash
echo "🔍 Pre-migration Analysis"
echo "Total .tsx files: $(find src/ -name "*.tsx" | wc -l)"
echo "MUI imports: $(grep -r "@mui" src/ | wc -l)"
echo "Custom DS imports: $(grep -r "design_system" src/ | wc -l)"
```

### **4. Testing Automation**
```bash
# Run this after each migration step
npm run test
npm run build
npm run lint
```

---

## 🚨 **Risk Mitigation**

### **High Risk Items:**
1. **Typography variants** - May need custom mapping
2. **Complex forms** - Validation logic changes
3. **Mobile layout** - Responsive behavior changes
4. **Performance** - Bundle size might increase initially

### **Backup Plan:**
- Keep original components in `design_system_backup/`
- Feature flags for gradual rollout
- Rollback script ready
- Database migrations isolated

### **Testing Strategy:**
- Unit tests for each migrated component
- Integration tests for full user flows
- Visual regression testing
- Performance monitoring

---

## 🎯 **Daily Standup Template**

### **Questions to Ask:**
1. What component(s) did you migrate yesterday?
2. Any API compatibility issues found?
3. Performance or styling concerns?
4. Blockers needing team discussion?
5. Ready for testing/review?

### **Success Indicators:**
- ✅ Component renders correctly
- ✅ All props/events work as expected
- ✅ No console errors
- ✅ Styling matches original
- ✅ Responsive behavior intact

This migration will transform your booking portal into a 100% 4Sale Design System implementation while maintaining all existing functionality! 