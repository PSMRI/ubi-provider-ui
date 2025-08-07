import React, { useEffect } from "react";

interface FormAccessibilityProviderProps {
  formRef: React.RefObject<HTMLFormElement>;
  uiSchema: Record<string, any>;
  formSchema: Record<string, any>;
  children: React.ReactNode;
}

/**
 * FormAccessibilityProvider Component
 *
 * Handles accessibility styling, field grouping, and WCAG compliance for RJSF forms.
 * This component ensures all form elements meet accessibility standards while preserving
 * React Select and other complex component functionality.
 * 
 * Uses stable selectors instead of generated CSS class names for better maintainability.
 */
const FormAccessibilityProvider: React.FC<FormAccessibilityProviderProps> = ({
  formRef,
  uiSchema,
  formSchema,
  children,
}) => {
  /**
   * Apply field grouping after form renders
   * Groups form fields into fieldsets based on uiSchema metadata
   */
  useEffect(() => {
    if (formRef.current && uiSchema && Object.keys(uiSchema).length > 0) {
      const timeoutId = setTimeout(() => {
        applyFieldGrouping();
        applyAccessibilityStyles();
        removeEmptyDivs();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [formSchema, uiSchema]);

  /**
   * Groups form fields into visual fieldsets with legends
   */
  const applyFieldGrouping = () => {
    const formContainer = formRef.current?.querySelector
      ? formRef.current
      : null;
    let formElement = null;

    if (formContainer) {
      formElement = formContainer;
    } else {
      formElement = document.querySelector("form");
    }

    if (!formElement) {
      console.log("No form element found for field grouping");
      return;
    }

    // Get all field groups from uiSchema
    const fieldGroups: Record<string, { label: string; fields: Element[] }> =
      {};

    Object.keys(uiSchema).forEach((fieldName) => {
      if (fieldName === "ui:order") return;

      const fieldConfig = (uiSchema)[fieldName];
      if (fieldConfig?.["ui:group"] && fieldConfig?.["ui:groupFirst"]) {
        const groupName = fieldConfig["ui:group"];
        const groupLabel = fieldConfig["ui:groupLabel"];

        if (!fieldGroups[groupName]) {
          fieldGroups[groupName] = { label: groupLabel, fields: [] };
        }
      }
    });

    // Find and group field elements
    Object.keys(uiSchema).forEach((fieldName) => {
      if (fieldName === "ui:order") return;

      const fieldConfig = (uiSchema)[fieldName];
      if (fieldConfig?.["ui:group"]) {
        const groupName = fieldConfig["ui:group"];

        let fieldElement = findFieldElement(formElement, fieldName);

        if (fieldElement && fieldGroups[groupName]) {
          fieldGroups[groupName].fields.push(fieldElement);
        }
      }
    });

    // Create fieldsets for each group
    const groupEntries = Object.entries(fieldGroups);
    groupEntries.forEach(([groupName, group]) => {
      if (group.fields.length > 0) {
        createFieldset(group, groupName);
      }
    });
  };

  /**
   * Finds a form field element using multiple strategies
   */
  const findFieldElement = (
    formElement: Element,
    fieldName: string
  ): Element | null => {
    // Try multiple selectors to find the field
    let fieldElement: Element | null =
      formElement
        .querySelector(`#root_${fieldName}`)
        ?.closest(
          ".chakra-form__group, .form-group, .field, div[data-field]"
        ) || null;

    // Use nullish coalescing assignment for cleaner fallback logic
    fieldElement ??= formElement
      .querySelector(`[id*="${fieldName}"]`)
      ?.closest(
        ".chakra-form__group, .form-group, .field, div[data-field]"
      ) || null;

    fieldElement ??= formElement
      .querySelector(`[name*="${fieldName}"]`)
      ?.closest(".chakra-form__group, .form-group, .field, div") || null;

    if (!fieldElement) {
      // Try finding by label text
      const labelElements = formElement.querySelectorAll("label");
      for (const label of labelElements) {
        const labelText = label.textContent?.toLowerCase() || "";
        const fieldNameParts = fieldName.toLowerCase().split("_");

        if (
          labelText.includes(fieldName.toLowerCase()) ||
          fieldNameParts.some(
            (part) => part.length > 2 && labelText.includes(part)
          )
        ) {
          fieldElement =
            label.closest(".chakra-form__group, .form-group, .field, div") ||
            null;
          break;
        }
      }
    }

    return fieldElement;
  };

  /**
   * Creates a fieldset wrapper for a group of fields
   */
  const createFieldset = (
    group: { label: string; fields: Element[] },
    groupName: string,
  ) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "field-group";
    fieldset.setAttribute("data-group", groupName);

    // Apply fieldset styling - darker border for clear section definition
    fieldset.style.cssText = `
      border: 1px solid var(--form-section-border);
      border-radius: var(--form-border-radius);
      padding: var(--form-padding-large);
      margin: 0 !important;
      background-color: var(--form-bg-color);
      position: relative; 
      display: block;
      box-sizing: border-box;
    `;

    // Create legend
    const legend = document.createElement("legend");
    legend.textContent = group.label;
    legend.className = "field-group-legend";
    legend.style.cssText = `
      font-weight: bold;
      font-size: 1.2em;
      color: var(--form-text-color);
      background-color: var(--form-bg-color);
      margin-bottom: var(--form-padding-large);
      padding: var(--form-padding-small);
    `;

    fieldset.appendChild(legend);

    // Move fields into fieldset
    const firstField = group.fields[0];
    if (firstField?.parentNode) {
      firstField.parentNode.insertBefore(fieldset, firstField);

      group.fields.forEach((field, fieldIndex) => {
        if (field instanceof HTMLElement) {
          field.style.marginTop = "0px";
          field.style.marginBottom =
            fieldIndex === group.fields.length - 1 ? "0px" : "8px";
        }
        fieldset.appendChild(field);
      });
    }
  };

  /**
   * Applies WCAG compliant accessibility styles to form elements
   * Uses stable selectors instead of generated CSS class names
   */
  const applyAccessibilityStyles = () => {
    const formContainer = formRef.current?.querySelector
      ? formRef.current
      : null;
    let formElement = formContainer || document.querySelector("form");

    if (!formElement || !(formElement instanceof HTMLElement)) return;

    // Remove spacing from form container
    formElement.style.gap = "0";
    formElement.style.rowGap = "0";
    formElement.style.columnGap = "0";

    // Style labels with explicit colors
    const labels = formElement.querySelectorAll("label");
    labels.forEach((label: Element) => {
      if (label instanceof HTMLElement) {
        label.style.color = "var(--form-text-color)";
        label.style.backgroundColor = "var(--form-bg-color)";
        label.style.fontWeight = "600";
        label.style.padding = "var(--form-padding-small)";
      }
    });

    // Style basic inputs (exclude React Select containers)
    const basicInputs = formElement.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="date"], textarea'
    );
    basicInputs.forEach((input: Element) => {
      if (
        input instanceof HTMLElement &&
        !input.closest('[data-react-select="true"], .react-select, [class*="react-select"]')
      ) {
        input.style.color = "var(--form-text-color)";
        input.style.backgroundColor = "var(--form-bg-color)";
        input.style.border = `1px solid var(--form-border-color)`;
      }
    });

    // Style text elements (exclude React Select components)
    const allTextElements = formElement.querySelectorAll(
      'span:not([class*="css-"]), div:not([class*="css-"]), p, h1, h2, h3, h4, h5, h6'
    );
    allTextElements.forEach((element: Element) => {
      if (
        element instanceof HTMLElement &&
        element.textContent?.trim() &&
        !element.closest('[data-react-select="true"], .react-select, [class*="react-select"], [class*="css-"]')
      ) {
        element.style.color = "var(--form-text-color)";
        element.style.backgroundColor = "var(--form-bg-color)";
      }
    });

    // Handle placeholder text (exclude React Select)
    const inputsWithPlaceholder = formElement.querySelectorAll(
      'input[placeholder]:not([class*="css-"]), textarea[placeholder]'
    );
    if (inputsWithPlaceholder.length > 0) {
      const style = document.createElement("style");
      style.textContent = `
        input:not([class*="css-"])::placeholder, textarea::placeholder {
          color: var(--form-placeholder-color) !important;
          background-color: var(--form-bg-color) !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Style error messages and required indicators
    const errorElements = formElement.querySelectorAll(
      '[class*="error"], [class*="required"], .chakra-form__required-indicator'
    );
    errorElements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        element.style.color = "var(--form-error-color)";
        element.style.backgroundColor = "var(--form-bg-color)";
        element.style.fontWeight = "600";
      }
    });

    // Add global CSS for form validation and React Select
    addGlobalStyles();

    // Handle React Select components using stable selectors
    setTimeout(() => {
      handleReactSelectStyling(formElement);
    }, 200);
  };

  /**
   * Handles React Select styling using stable selectors
   */
  const handleReactSelectStyling = (formElement: Element) => {
    // Use more stable selectors for React Select components
    // Look for divs with React Select indicators (aria-hidden="true" and SVG content)
    const reactSelectContainers = formElement.querySelectorAll(
      '[role="combobox"], [aria-expanded], div[class*="react-select"], div[data-react-select="true"]'
    );

    // Also try to find by common React Select structure patterns
    const possibleSelectContainers = formElement.querySelectorAll('div');
    const selectContainers: Element[] = [];

    possibleSelectContainers.forEach((div) => {
      // Look for React Select indicators: presence of dropdown arrow SVG or specific roles
      const hasDropdownIndicator = div.querySelector('svg[aria-hidden="true"]') || 
                                   div.querySelector('[role="button"]') ||
                                   div.querySelector('input[readonly][aria-autocomplete="list"]') ||
                                   div.hasAttribute('aria-expanded');

      if (hasDropdownIndicator && !selectContainers.includes(div)) {
        selectContainers.push(div);
      }
    });

    // Combine both approaches
    const allSelectElements = [
      ...Array.from(reactSelectContainers),
      ...selectContainers
    ].filter((elem, index, self) => 
      self.findIndex(e => e === elem) === index
    );

    allSelectElements.forEach((selectEl: Element) => {
      if (selectEl instanceof HTMLElement) {
        selectEl.style.pointerEvents = "auto";
        selectEl.style.cursor = "pointer";
        
        // Find the control area (usually contains the input and value)
        const controlArea = selectEl.querySelector('div:has(> input[readonly])') ||
                           selectEl.querySelector('[role="button"]') ||
                           selectEl.querySelector('div:first-child');
                           
        if (controlArea instanceof HTMLElement) {
          controlArea.style.cursor = "pointer";
          controlArea.style.pointerEvents = "auto";
        }
        
        // Handle hidden/readonly inputs in React Select
        const hiddenInputs = selectEl.querySelectorAll('input[readonly], input[aria-autocomplete="list"]');
        hiddenInputs.forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.readOnly = true;
            input.style.pointerEvents = "none";
            input.tabIndex = -1; // Remove from tab order
          }
        });
      }
    });

    // Make dropdown indicators clickable using more stable selectors
    const dropdownIndicators = formElement.querySelectorAll('svg[aria-hidden="true"], [role="button"]');
    dropdownIndicators.forEach((indicator: Element) => {
      if (indicator instanceof HTMLElement && indicator.closest('[role="combobox"], div[class*="react-select"]')) {
        indicator.style.cursor = "pointer";
        indicator.style.pointerEvents = "auto";
      }
    });
  };

  /**
   * Adds global CSS styles for accessibility and React Select using stable selectors
   */
  const addGlobalStyles = () => {
    // Check if styles already added
    if (document.getElementById("form-accessibility-styles")) return;

    const globalStyle = document.createElement("style");
    globalStyle.id = "form-accessibility-styles";
    globalStyle.textContent = `
      /* CSS Variables for WCAG-compliant form styling */
      :root {
        /* Base Colors */
        --form-text-color: #1A202C;           /* Primary text - passes AAA (15.8:1 vs white) */
        --form-bg-color: #FFFFFF;             /* Form background */
        --form-bg-secondary: #F7FAFC;         /* Secondary background */
        
        /* Border Colors - Consistent with Chakra UI */
        --form-border-color: #E2E8F0;         /* Default border (gray.200) */
        --form-border-hover: #D1D5DB;         /* Hover border (gray.300) */
        --form-border-focus: #3182CE;         /* Focus border (blue.500) */
        --form-border-error: #E53E3E;         /* Error border (red.500) */
        
        /* Text Colors */
        --form-placeholder-color: #4A5568;    /* WCAG AA compliant placeholder (7.6:1 vs white) */
        --form-help-text-color: #718096;      /* Help text (gray.500) */
        --form-error-color: #C53030;          /* Error text (red.600) */
        --form-required-color: #C53030;       /* Required indicator */
        
        /* Interactive States */
        --form-hover-bg: #EDF2F7;             /* Hover background (gray.100) */
        --form-selected-bg: #E6FFFA;          /* Selected/active background (teal.50) */
        --form-disabled-bg: #F7FAFC;          /* Disabled background */
        --form-disabled-text: #A0AEC0;        /* Disabled text (gray.400) */
        
        /* Dividers and Separators */
        --form-divider-color: #F1F5F9;        /* Subtle separators */
        --form-section-border: #000000;       /* Strong section borders (fieldsets) */
        
        /* Dimensions */
        --form-border-radius: 6px;            /* Standard border radius */
        --form-input-height: 40px;            /* Standard input height */
        --form-dropdown-max-height: 200px;    /* Dropdown menu max height */
        
        /* Spacing */
        --form-padding-small: 4px 8px;        /* Small padding (labels, indicators) */
        --form-padding-medium: 8px 12px;      /* Medium padding (inputs, options) */
        --form-padding-large: 16px;           /* Large padding (fieldsets) */
        
        /* Shadows */
        --form-focus-shadow: 0 0 0 1px var(--form-border-focus);
        --form-dropdown-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        
        /* Z-index */
        --form-dropdown-z-index: 1000;        /* Dropdown menu z-index */
      }
      

      
      /* WCAG Compliant Form Styles */
      .chakra-form__error-message {
        color: var(--form-error-color) !important;
        background-color: var(--form-bg-color) !important;
        font-weight: 600 !important;
        padding: var(--form-padding-small) !important;
      }
      .chakra-form__required-indicator {
        color: var(--form-required-color) !important;
        background-color: var(--form-bg-color) !important;
        font-weight: bold !important;
      }
      .chakra-form__help-text {
        color: var(--form-help-text-color) !important;
        background-color: var(--form-bg-color) !important;
      }
      
      /* React Select styling using stable selectors - consistent with Chakra UI form fields */
      /* Target React Select containers by role and data attributes */
      [role="combobox"], 
      div[class*="react-select__control"],
      div[data-react-select="true"] {
        background-color: var(--form-bg-color) !important;
        border: 1px solid var(--form-border-color) !important;
        border-radius: var(--form-border-radius);
        cursor: pointer;
      }
      
      [role="combobox"]:hover,
      div[class*="react-select__control"]:hover,
      div[data-react-select="true"]:hover {
        border-color: var(--form-border-hover) !important;
      }
      
      [role="combobox"]:focus-within,
      div[class*="react-select__control"]:focus-within,
      div[data-react-select="true"]:focus-within {
        border-color: var(--form-border-focus) !important;
        box-shadow: var(--form-focus-shadow);
      }
      
      /* Style React Select inputs using more stable selectors */
      input[aria-autocomplete="list"],
      input[readonly][aria-expanded],
      div[class*="react-select"] input {
        color: var(--form-text-color) !important;
        background-color: transparent;
        caret-color: transparent;
        cursor: pointer;
      }
      
      /* Hide React Select internal inputs that should not be visible */
      input[aria-autocomplete="list"][readonly] {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        position: absolute !important;
        pointer-events: none !important;
        caret-color: transparent;
      }
      
      /* React Select dropdown menu - using more stable selectors */
      [role="listbox"],
      div[class*="react-select__menu"],
      div[class*="menu"][role="menu"] {
        background-color: var(--form-bg-color) !important;
        border: 1px solid var(--form-border-color) !important;
        border-radius: var(--form-border-radius);
        box-shadow: var(--form-dropdown-shadow);
        z-index: var(--form-dropdown-z-index);
      }
      
      /* React Select menu list */
      div[class*="react-select__menu-list"],
      div[class*="menuList"] {
        padding: 4px 0;
        max-height: var(--form-dropdown-max-height);
        overflow-y: auto;
      }
      
      /* React Select options */
      [role="option"],
      div[class*="react-select__option"] {
        color: var(--form-text-color) !important;
        background-color: var(--form-bg-color) !important;
        padding: var(--form-padding-medium) !important;
        cursor: pointer;
        font-size: 14px;
        border-bottom: 1px solid var(--form-divider-color);
      }
      
      [role="option"]:last-child,
      div[class*="react-select__option"]:last-child {
        border-bottom: none;
      }
      
      [role="option"]:hover,
      div[class*="react-select__option"]:hover {
        background-color: var(--form-hover-bg) !important;
        color: var(--form-text-color) !important;
      }
      
      [role="option"]:focus,
      [role="option"][aria-selected="true"],
      div[class*="react-select__option"]:focus,
      div[class*="react-select__option"][aria-selected="true"] {
        background-color: var(--form-selected-bg) !important;
        color: var(--form-text-color) !important;
      }
      
      /* React Select single value and placeholder */
      div[class*="react-select__single-value"],
      div[class*="singleValue"] {
        color: var(--form-text-color) !important;
        font-size: 14px;
        font-weight: 400;
      }
      
      div[class*="react-select__placeholder"],
      div[class*="placeholder"] {
        color: var(--form-placeholder-color) !important;
        font-size: 14px;
      }
      
      /* General React Select value container */
      div[class*="react-select__value-container"] {
        padding: 8px 12px !important;
        font-size: 14px !important;
      }
      
      /* React Select control styling - fallback for specific implementations */
      div[class*="react-select__control"] {
        min-height: var(--form-input-height) !important;
        border: 1px solid var(--form-border-color) !important;
        box-shadow: none !important;
      }
      
      div[class*="react-select__control"]:hover {
        border-color: #D1D5DB !important; /* Chakra UI gray.300 */
      }
      
      /* React Select indicator container */
      div[class*="react-select__indicator"] {
        cursor: pointer !important;
        padding: 8px !important;
      }
      
      /* SVG dropdown arrows in React Select */
      svg[aria-hidden="true"] {
        cursor: pointer !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(globalStyle);
  };

  /**
   * Removes empty divs that create unwanted gaps between fieldsets
   */
  const removeEmptyDivs = () => {
    const formContainer = formRef.current?.querySelector
      ? formRef.current
      : null;
    let formElement = formContainer || document.querySelector("form");

    if (!formElement) return;

    setTimeout(() => {
      // Use more specific selectors for empty divs, avoiding React Select components
      const emptyDivs = formElement.querySelectorAll(
        'div.css-0, div[class="css-0"]:not([role]):not([class*="react-select"]):not([data-react-select])'
      );

      emptyDivs.forEach((div: Element) => {
        const hasContent =
          div.textContent?.trim() ||
          div.querySelector("input, select, textarea, button, img") ||
          div.children.length > 0;

        if (!hasContent && div instanceof HTMLElement) {
          div.style.display = "none";
        }
      });
    }, 150);
  };

  return <>{children}</>;
};

export default FormAccessibilityProvider;
