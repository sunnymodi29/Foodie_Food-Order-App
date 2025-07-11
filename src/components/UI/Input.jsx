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
      {/* {askAI && (
        <div className="ask-ai-wrapper">
          <AskAI>
            <span>Meal Description or</span>
            <button type="button">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="ai_gradient"
                    x1="3.59964"
                    y1="1.94859"
                    x2="22.5376"
                    y2="6.49998"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#A34BE9"></stop>
                    <stop offset="1" stop-color="#522B5C"></stop>
                  </linearGradient>
                </defs>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.70959 1.95936C3.99295 1.24279 5.00711 1.24279 5.29047 1.95936L5.78644 3.21359L7.04064 3.70955C7.75723 3.99292 7.75721 5.00713 7.04058 5.29046L5.78603 5.78645L5.29007 7.04064C5.00671 7.75721 3.99255 7.75721 3.70919 7.04064L3.2132 5.78638L1.9593 5.29043C1.24278 5.00702 1.24283 3.99292 1.95936 3.70957L3.21361 3.21359L3.70959 1.95936ZM4.50003 4.03924C4.41373 4.24799 4.24785 4.41383 4.03907 4.50008C4.24766 4.58638 4.41338 4.75214 4.49963 4.96076C4.58593 4.752 4.75181 4.58616 4.96059 4.49992C4.752 4.41363 4.58627 4.24786 4.50003 4.03924ZM10.1521 3.09436C10.4354 2.3778 11.4496 2.37779 11.7329 3.09436L13.733 8.15204L18.7906 10.152C19.5072 10.4354 19.5072 11.4496 18.7906 11.733L13.7317 13.733L11.7317 18.7906C11.4483 19.5072 10.4342 19.5072 10.1508 18.7906L8.15078 13.7329L3.09428 11.7329C2.37776 11.4495 2.3778 10.4354 3.09434 10.1521L8.15204 8.15204L10.1521 3.09436ZM10.9425 5.17452L9.44338 8.96551C9.35698 9.184 9.184 9.35698 8.96552 9.44338L5.17432 10.9426L8.96432 12.4416C9.18278 12.528 9.35574 12.701 9.44213 12.9195L10.9413 16.7105L12.4404 12.9195C12.5268 12.701 12.6998 12.528 12.9183 12.4416L16.7103 10.9424L12.9195 9.44338C12.701 9.35698 12.528 9.18401 12.4416 8.96551L10.9425 5.17452ZM18.239 11.5469C18.2387 11.5468 18.2383 11.5467 18.238 11.5465L18.239 11.5469ZM11.5466 3.64699L11.547 3.64596L11.5466 3.64699Z"
                  fill="currentColor"
                ></path>
              </svg>
              Generate with AI...
            </button>
          </AskAI>
        </div>
      )} */}
    </p>
  );
};

export default Input;
