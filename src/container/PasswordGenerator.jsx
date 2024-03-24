import React, { useReducer, useRef, useCallback } from "react";
import "./PasswordGenerator.css";

const initialState = {
  passwordLength: 8,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  password: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PASSWORD_LENGTH":
      return { ...state, passwordLength: action.payload };
    case "TOGGLE_INCLUDE_UPPERCASE":
      return { ...state, includeUppercase: action.payload };
    case "TOGGLE_INCLUDE_LOWERCASE":
      return { ...state, includeLowercase: action.payload };
    case "TOGGLE_INCLUDE_NUMBERS":
      return { ...state, includeNumbers: action.payload };
    case "TOGGLE_INCLUDE_SYMBOLS":
      return { ...state, includeSymbols: action.payload };
    case "GENERATE_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

function PasswordGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    password,
  } = state;
  const passwordRef = useRef(null);

  const generatePassword = useCallback(() => {
    let characters = "";
    if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) characters += "0123456789";
    if (includeSymbols) characters += "!@#$%^&*()_+{}|:<>?-=[];,./";

    let generatedPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }
    dispatch({ type: "GENERATE_PASSWORD", payload: generatedPassword });
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const handlePasswordLengthChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 8 && value <= 50) {
      dispatch({ type: "SET_PASSWORD_LENGTH", payload: value });
    }
  };

  const copyPasswordToClipboard = useCallback(() => {
    if (passwordRef.current) {
      passwordRef.current.select();
      document.execCommand("copy");
    }
  }, []);

  return (
    <div className="password-generator">
      <h1>Password Generator</h1>
      <div>
        <label htmlFor="passwordLength">Password Length (8-50):</label>
        <input
          type="number"
          id="passwordLength"
          value={passwordLength}
          onChange={handlePasswordLengthChange}
        />
      </div>
      <div className="options">
        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) =>
              dispatch({
                type: "TOGGLE_INCLUDE_UPPERCASE",
                payload: e.target.checked,
              })
            }
          />
          Include Uppercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) =>
              dispatch({
                type: "TOGGLE_INCLUDE_LOWERCASE",
                payload: e.target.checked,
              })
            }
          />
          Include Lowercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) =>
              dispatch({
                type: "TOGGLE_INCLUDE_NUMBERS",
                payload: e.target.checked,
              })
            }
          />
          Include Numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) =>
              dispatch({
                type: "TOGGLE_INCLUDE_SYMBOLS",
                payload: e.target.checked,
              })
            }
          />
          Include Symbols
        </label>
      </div>
      <button onClick={generatePassword}>Generate Password</button>
      {password && (
        <div className="generated-password">
          <h2>Generated Password:</h2>
          <textarea
            rows="4"
            cols="50"
            value={password}
            readOnly
            ref={passwordRef}
          />
          <button onClick={copyPasswordToClipboard}>Copy Password</button>
        </div>
      )}
    </div>
  );
}

export default PasswordGenerator;
