import "./FormField.css";

export default function FormField({
  label,
  name,
  id = name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  ...rest
}) {
  return (
    <div className="form-field-wrapper">
      <label htmlFor={id}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
