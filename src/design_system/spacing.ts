/**
 * Centralized Spacing System
 * 
 * This file defines all spacing values used across the application.
 * Based on MUI's 8px base unit system with semantic naming for better UX.
 * 
 * Design Philosophy:
 * - 8px base unit (MUI standard)
 * - Consistent vertical rhythm
 * - Semantic naming for component context
 * - Responsive spacing considerations
 */

// Base spacing unit (8px) - MUI standard
export const BASE_SPACING = 8;

/**
 * CORE SPACING SCALE
 * Based on 8px base unit with logical progression
 */
export const spacing = {
  // Micro spacings - for tight layouts
  xxs: 0.25,  // 2px  - Icon gaps, minimal padding
  xs: 0.5,    // 4px  - Small element spacing
  sm: 1,      // 8px  - Compact spacing
  
  // Standard spacings - most common usage
  md: 1.5,    // 12px - Default small spacing
  lg: 2,      // 16px - Default medium spacing  
  xl: 3,      // 24px - Default large spacing
  
  // Macro spacings - for layout and sections
  '2xl': 4,   // 32px - Section spacing
  '3xl': 6,   // 48px - Large section spacing
  '4xl': 8,   // 64px - Hero spacing
  '5xl': 12,  // 96px - Huge spacing
} as const;

/**
 * COMPONENT-SPECIFIC SPACING
 * Semantic spacing for specific UI patterns
 */
export const componentSpacing = {
  // Form elements
  form: {
    fieldGap: spacing.xl,          // 24px - Gap between form fields
    sectionGap: spacing['2xl'],    // 32px - Gap between form sections
    labelMargin: spacing.md,       // 12px - Label to input spacing
    helperMargin: spacing.xs,      // 4px  - Input to helper text
    groupPadding: spacing.xl,      // 24px - Form group internal padding
  },
  
  // Card and container spacing
  card: {
    padding: spacing.xl,           // 24px - Default card padding
    paddingCompact: spacing.lg,    // 16px - Compact card padding
    paddingSpacious: spacing['2xl'], // 32px - Spacious card padding
    gap: spacing.lg,               // 16px - Gap between card elements
  },
  
  // Button spacing
  button: {
    iconGap: spacing.sm,           // 8px  - Icon to text spacing
    groupGap: spacing.md,          // 12px - Gap between buttons
    paddingSmall: spacing.md,      // 12px - Small button padding
    paddingMedium: spacing.lg,     // 16px - Medium button padding
    paddingLarge: spacing.xl,      // 24px - Large button padding
  },
  
  // Navigation spacing
  navigation: {
    itemGap: spacing.xs,           // 4px  - Gap between nav items
    groupGap: spacing.lg,          // 16px - Gap between nav groups
    padding: spacing.lg,           // 16px - Navigation padding
    marginMobile: spacing['4xl'],  // 64px - Bottom margin for mobile nav
  },
  
  // Layout spacing
  layout: {
    sectionGap: spacing['3xl'],    // 48px - Gap between main sections
    containerPadding: spacing.xl,  // 24px - Container padding
    headerHeight: spacing['4xl'],  // 64px - Header height
    sidebarWidth: 280,             // 280px - Sidebar width (fixed)
  },
  
  // Modal and dialog spacing
  modal: {
    padding: spacing.xl,           // 24px - Modal content padding
    headerPadding: spacing.lg,     // 16px - Modal header padding
    footerPadding: spacing.lg,     // 16px - Modal footer padding
    buttonGap: spacing.md,         // 12px - Gap between modal buttons
  },
  
  // List and table spacing
  list: {
    itemPadding: spacing.lg,       // 16px - List item padding
    itemGap: spacing.xs,           // 4px  - Gap between list items
    sectionGap: spacing.lg,        // 16px - Gap between list sections
  },
  
  // Alert and notification spacing
  alert: {
    padding: spacing.lg,           // 16px - Alert padding
    iconGap: spacing.md,           // 12px - Icon to text spacing
    titleMargin: spacing.xs,       // 4px  - Title to content spacing
  },
  
  // Input component sizing
  input: {
    heightSmall: 48,               // 6 spacing units (48px)
    heightMedium: 56,              // 7 spacing units (56px)
    paddingHorizontal: spacing.lg, // 16px - Horizontal padding
    paddingVertical: spacing.md,   // 12px - Vertical padding
    borderRadius: 1.5,             // 12px - Border radius (rounded-xs)
  },
} as const;

/**
 * RESPONSIVE SPACING
 * Breakpoint-aware spacing for responsive design
 */
export const responsiveSpacing = {
  // Container padding by breakpoint
  containerPadding: {
    xs: spacing.lg,        // 16px on mobile
    sm: spacing.xl,        // 24px on small tablets
    md: spacing['2xl'],    // 32px on tablets
    lg: spacing['2xl'],    // 32px on desktop
    xl: spacing['3xl'],    // 48px on large screens
  },
  
  // Section gaps by breakpoint
  sectionGap: {
    xs: spacing.xl,        // 24px on mobile
    sm: spacing['2xl'],    // 32px on small tablets
    md: spacing['3xl'],    // 48px on tablets
    lg: spacing['3xl'],    // 48px on desktop
    xl: spacing['4xl'],    // 64px on large screens
  },
} as const;

/**
 * SPACING UTILITIES
 * Helper functions for common spacing calculations
 */
export const spacingUtils = {
  /**
   * Get spacing value in MUI units
   * @param key - Spacing key from the spacing scale
   * @returns MUI spacing value
   */
  get: (key: keyof typeof spacing) => spacing[key],
  
  /**
   * Get component spacing value
   * @param component - Component name
   * @param property - Spacing property
   * @returns MUI spacing value
   */
  getComponent: <T extends keyof typeof componentSpacing>(
    component: T, 
    property: keyof typeof componentSpacing[T]
  ) => componentSpacing[component][property],
  
  /**
   * Get responsive spacing value for MUI sx prop
   * @param property - Responsive spacing property
   * @returns Object with breakpoint values
   */
  getResponsive: <T extends keyof typeof responsiveSpacing>(
    property: T
  ) => responsiveSpacing[property],
  
  /**
   * Create custom spacing value
   * @param multiplier - Multiplier of base spacing unit
   * @returns MUI spacing value
   */
  custom: (multiplier: number) => multiplier,
} as const;

/**
 * SPACING CONSTANTS FOR COMMON PATTERNS
 * Pre-defined spacing objects for frequent use cases
 */
export const spacingPresets = {
  // Form field spacing
  formField: {
    marginBottom: componentSpacing.form.fieldGap,
  },
  
  // Card content spacing
  cardContent: {
    padding: componentSpacing.card.padding,
    gap: componentSpacing.card.gap,
  },
  
  // Button group spacing
  buttonGroup: {
    gap: componentSpacing.button.groupGap,
  },
  
  // Modal content spacing
  modalContent: {
    padding: componentSpacing.modal.padding,
  },
  
  // Section spacing
  section: {
    marginBottom: responsiveSpacing.sectionGap,
  },
} as const;

/**
 * TYPE DEFINITIONS
 */
export type SpacingKey = keyof typeof spacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;
export type ResponsiveSpacingKey = keyof typeof responsiveSpacing;

// Export individual spacing values for direct usage
export const {
  xxs,
  xs,
  sm,
  md,
  lg,
  xl,
} = spacing; 