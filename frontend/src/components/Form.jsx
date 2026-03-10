import "./Form.css";

export default function Form({ children, onSubmit }) {
  return (
    <form className="form-wrapper" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
