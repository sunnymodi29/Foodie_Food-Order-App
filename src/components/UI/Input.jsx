import AskAI from "./AskAI";

const Input = ({ label, id, isTextarea = false, type, askAI, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "." || e.key === "e") {
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
      {askAI === "true" && (
        <div className="ask-ai-wrapper">
          <AskAI>
            <button>🚀Ask AI</button>
          </AskAI>
        </div>
      )}
    </p>
  );
};

export default Input;
