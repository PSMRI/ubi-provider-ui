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
      border: 1px solid #C6C5D0;
      border-radius: 8px;
      padding: 16px;
      margin: 0 !important;
      background-color: #FFFFFF;
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
      color: #1A202C;
      background-color: #FFFFFF;
      margin-bottom: 16px;
      padding: 4px 8px;
     
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
        label.style.color = "#1A202C";
        label.style.backgroundColor = "#FFFFFF";
        label.style.fontWeight = "600";
        label.style.padding = "2px 4px";
      }
    });

    // Style basic inputs (exclude React Select)
    // Basic inputs with lighter borders for better visual hierarchy
    const basicInputs = formElement.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="date"], textarea'
    );
    basicInputs.forEach((input: Element) => {
      if (
        input instanceof HTMLElement &&
        !input.closest(".css-18h4ju6, .react-select")
      ) {
        input.style.color = "#1A202C";
        input.style.backgroundColor = "#FFFFFF";
        input.style.border = "1px solid #767680";
      }
    });

    // Style text elements (exclude React Select)
    const allTextElements = formElement.querySelectorAll(
      'span:not([class*="css-"]), div:not([class*="css-"]), p, h1, h2, h3, h4, h5, h6'
    );
    allTextElements.forEach((element: Element) => {
      if (
        element instanceof HTMLElement &&
        element.textContent?.trim() &&
        !element.closest('.css-18h4ju6, .react-select, [class*="css-"]')
      ) {
        element.style.color = "#1A202C";
        element.style.backgroundColor = "#FFFFFF";
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
          color: #767680 !important;
          background-color: #FFFFFF !important;
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
        element.style.color = "#C53030";
        element.style.backgroundColor = "#FFFFFF";
        element.style.fontWeight = "600";
      }
    });

    // Add global CSS for form validation and React Select
    addGlobalStyles();

    // Ensure React Select functionality with hidden input
    setTimeout(() => {
      const selectElements = formElement.querySelectorAll(".css-18h4ju6, .css-i2418r");
      selectElements.forEach((selectEl: Element) => {
        if (selectEl instanceof HTMLElement) {
          selectEl.style.pointerEvents = "auto";
          selectEl.style.cursor = "pointer";
          
          // Make the entire control area clickable
          const controlArea = selectEl.querySelector(".css-j93siq, .css-18euh9p");
          if (controlArea instanceof HTMLElement) {
            controlArea.style.cursor = "pointer";
            controlArea.style.pointerEvents = "auto";
          }
          
          // Handle the hidden input
          const input = selectEl.querySelector(".css-10wwmqn");
          if (input instanceof HTMLInputElement) {
            input.readOnly = true;
            input.style.pointerEvents = "none";
            input.tabIndex = -1; // Remove from tab order
          }
        }
      });

      // Make dropdown indicators clickable
      const dropdownIndicators = formElement.querySelectorAll(".css-xq12md, .css-hfbj6y");
      dropdownIndicators.forEach((indicator: Element) => {
        if (indicator instanceof HTMLElement) {
          indicator.style.cursor = "pointer";
          indicator.style.pointerEvents = "auto";
        }
      });
    }, 200);
  };

  /**
   * Adds global CSS styles for accessibility and React Select
   */
  const addGlobalStyles = () => {
    // Check if styles already added
    if (document.getElementById("form-accessibility-styles")) return;

    const globalStyle = document.createElement("style");
    globalStyle.id = "form-accessibility-styles";
    globalStyle.textContent = `
      /* WCAG Compliant Form Styles */
      .chakra-form__error-message {
        color: #C53030 !important;
        background-color: #FFFFFF !important;
        font-weight: 600 !important;
        padding: 2px 4px !important;
      }
      .chakra-form__required-indicator {
        color: #C53030 !important;
        background-color: #FFFFFF !important;
        font-weight: bold !important;
      }
      .chakra-form__help-text {
        color: #767680 !important;
        background-color: #FFFFFF !important;
      }
      /* React Select proper styling without breaking functionality */
      .css-18h4ju6 .css-10wwmqn {
        color: #1A202C !important;
        background-color: transparent !important;
        caret-color: transparent !important;
        cursor: pointer !important;
      }
      .css-18h4ju6 {
        background-color: #FFFFFF !important;
        border: 1px solid #767680 !important;
        border-radius: 6px !important;
        cursor: pointer !important;
      }
      .css-18h4ju6:hover {
        border-color: #2D3748 !important;
      }
      .css-18h4ju6:focus-within {
        border-color: #3182CE !important;
        box-shadow: 0 0 0 1px #3182CE !important;
      }
      /* Hide React Select input completely while preserving functionality */
      .css-10wwmqn {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        position: absolute !important;
        pointer-events: none !important;
        caret-color: transparent !important;
      }
      /* React Select dropdown menu - consistent with form styling */
      [class*="menu"] {
        background-color: #FFFFFF !important;
        border: 1px solid #767680 !important;
        border-radius: 6px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        z-index: 1000 !important;
      }
      [class*="menuList"] {
        padding: 4px 0 !important;
        max-height: 200px !important;
        overflow-y: auto !important;
      }
      [class*="option"] {
        color: #1A202C !important;
        background-color: #FFFFFF !important;
        padding: 8px 12px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        border-bottom: 1px solid #F7FAFC !important;
      }
      [class*="option"]:last-child {
        border-bottom: none !important;
      }
      [class*="option"]:hover {
        background-color: #EDF2F7 !important;
        color: #1A202C !important;
      }
      [class*="option"]:focus,
      [class*="option"][aria-selected="true"] {
        background-color: #E6FFFA !important;
        color: #1A202C !important;
      }
      [class*="singleValue"] {
        color: #1A202C !important;
        font-size: 14px !important;
        font-weight: 400 !important;
      }
      [class*="placeholder"] {
        color: #767680 !important;
        font-size: 14px !important;
      }
      /* Dropdown control styling to match other form inputs */
      .css-j93siq {
        min-height: 40px !important;
      
        border: 1px solid #767680 !important;
        border-right: none !important;
        
        box-shadow: none !important;
      }
      .css-j93siq:hover {
        border-color: #2D3748 !important;
      }
      .css-i2418r:focus-within .css-j93siq {
        border-color: #3182CE !important;
        border-right: none !important;
        box-shadow: 0 0 0 1px #3182CE !important;
      }
             /* Value container styling */
       .css-18euh9p {
         padding: 8px 12px !important;
         font-size: 14px !important;
       }
       /* Dropdown indicator styling - borders except left */
       .css-xq12md {
         border-top: 1px solid #767680 !important;
         border-right: 1px solid #767680 !important;
         border-bottom: 1px solid #767680 !important;
         border-left: none !important;
         border-top-right-radius: 6px !important;
         border-bottom-right-radius: 6px !important;
         padding: 8px !important;
         background-color: #FFFFFF !important;
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
      const emptyDivs = formElement.querySelectorAll(
        'div.css-0, div[class="css-0"]'
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
