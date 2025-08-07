import React, { useEffect } from "react";
import "./FormAccessibility.css";

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
    const timeoutId = setTimeout(() => {
      // Always apply accessibility classes, even without uiSchema
      applyAccessibilityClasses();
      
      // Only apply field grouping if uiSchema exists
      if (formRef.current && uiSchema && Object.keys(uiSchema).length > 0) {
        applyFieldGrouping();
      }
      
      hideEmptyDivs();
    }, 100);

    return () => clearTimeout(timeoutId);
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

    // Create legend
    const legend = document.createElement("legend");
    legend.textContent = group.label;
    legend.className = "field-group-legend";

    fieldset.appendChild(legend);

    // Move fields into fieldset
    const firstField = group.fields[0];
    if (firstField?.parentNode) {
      firstField.parentNode.insertBefore(fieldset, firstField);

      group.fields.forEach((field) => {
        fieldset.appendChild(field);
      });
    }
  };

  /**
   * Applies accessibility CSS classes to form elements
   * Uses CSS classes instead of inline styles for better maintainability
   */
  const applyAccessibilityClasses = () => {
    const formContainer = formRef.current?.querySelector
      ? formRef.current
      : null;
    let formElement = formContainer || document.querySelector("form");

    if (!formElement || !(formElement instanceof HTMLElement)) {
      return;
    }

    // Add main accessibility container class
    formElement.classList.add("form-accessibility-container");

    // Handle React Select components using stable selectors
    setTimeout(() => {
      handleReactSelectInteractivity(formElement);
    }, 200);
  };

  /**
   * Handles React Select interactivity using CSS classes
   */
  const handleReactSelectInteractivity = (formElement: Element) => {
    // Use more stable selectors for React Select components
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
        selectEl.classList.add("react-select-interactive");
        
        // Find the control area (usually contains the input and value)
        const controlArea = selectEl.querySelector('div:has(> input[readonly])') ||
                           selectEl.querySelector('[role="button"]') ||
                           selectEl.querySelector('div:first-child');
                           
        if (controlArea instanceof HTMLElement) {
          controlArea.classList.add("react-select-control-area");
        }
        
        // Handle hidden/readonly inputs in React Select
        const hiddenInputs = selectEl.querySelectorAll('input[readonly], input[aria-autocomplete="list"]');
        hiddenInputs.forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.readOnly = true;
            input.classList.add("react-select-hidden-input");
            input.tabIndex = -1; // Remove from tab order
          }
        });
      }
    });
  };

  /**
   * Hides empty divs that create unwanted gaps between fieldsets
   * Uses CSS classes instead of inline styles
   */
  const hideEmptyDivs = () => {
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
          div.querySelector("input, select, textarea, button, img, label, fieldset") ||
          div.children.length > 0;

        // Only hide divs that are truly empty and don't contain any form elements
        const containsFormElements = div.querySelector("input, select, textarea, button, label, fieldset, .chakra-form__group, .form-group, .field");
        
        if (!hasContent && !containsFormElements && div instanceof HTMLElement) {
          // The hiding is now handled by CSS in FormAccessibility.css
          // Just ensure the element has the proper class for CSS targeting
          if (!div.classList.contains('css-0')) {
            div.classList.add('css-0');
          }
        }
      });
    }, 150);
  };

  return <>{children}</>;
};

export default FormAccessibilityProvider;
