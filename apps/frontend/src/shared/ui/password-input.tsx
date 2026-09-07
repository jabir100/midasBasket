import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput(props: PasswordInputProps): ReactNode {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input {...props} type={isVisible ? "text" : "password"} />
      <button
        type="button"
        className="password-toggle-button"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        onClick={() => {
          setIsVisible((current) => !current);
        }}
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
