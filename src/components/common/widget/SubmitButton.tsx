// SubmitButton.tsx
import React from "react";
import { SubmitButtonProps, getSubmitButtonOptions } from "@rjsf/utils";

// Custom Submit Button Component
const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);

  if (norender) {
    return null; // Return null if "norender" flag is true
  }

  return <button type="submit" style={{ display: "none" }}></button>;
};

export default SubmitButton;
