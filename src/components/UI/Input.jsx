const Input = ({ label, id, isTextarea = false, type, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  };

  return (
    <p className="control">
      <label htmlFor={id}>{label}</label>
      {isTextarea ? (
        <textarea id={id} name={id} required {...props} />
      ) : type === "number" ? (
        <input
          type={type}
          id={id}
          name={id}
          min="0"
          step="any"
          onKeyDown={handleKeyDown}
          required
          {...props}
        />
      ) : (
        <input type={type} id={id} name={id} required {...props} />
      )}
    </p>
  );
};

export default Input;
