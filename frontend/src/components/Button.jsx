import "./Button.css";

export default function Button({
  type = "button",
  disabled = false,
  onClick,
  children,
  ...props
}) {
  return (
    <button
      className="primary-btn"
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
