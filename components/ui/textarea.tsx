type TextareaProps = {
  label: string;
  name: string;
  value: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rows?: number;
};

export const Textarea = ({
  label,
  name,
  value,
  handleChange,
  rows = 4,
}: TextareaProps) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} <span className="form-required">*</span>
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        required
        rows={rows}
        className="form-textarea"
      />
    </div>
  );
};
