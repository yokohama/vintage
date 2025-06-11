import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, ...props }, ref) => {
    return (
      <div className="form-field">
        <label className="form-label">
          {label} {props.required && <span className="form-required">*</span>}
        </label>
        <input type={type} className="form-input" ref={ref} {...props} />
      </div>
    );
  },
);
Input.displayName = "Input";
