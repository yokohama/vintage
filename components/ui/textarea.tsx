import * as React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="form-field">
        <label className="form-label">
          {label} {props.required && <span className="form-required">*</span>}
        </label>
        <textarea
          ref={ref}
          rows={props.rows || 4}
          className="form-textarea"
          {...props}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
