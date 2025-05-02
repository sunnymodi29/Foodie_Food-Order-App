const Input = ({ label, id, isTextarea = false, ...props }) => {
  return (
    <p className="control">
      <label htmlFor={id}>{label}</label>
      {isTextarea ? (
        <textarea id={id} name={id} required {...props} />
      ) : (
        <input id={id} name={id} required {...props} />
      )}
    </p>
  );
};

export default Input;
