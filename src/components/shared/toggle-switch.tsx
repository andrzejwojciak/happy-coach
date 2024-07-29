import React from "react";

interface ToggleSwitchProps {
  onChange?: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

export default function ToggleSwitch({
  onChange,
  checked,
  disabled = false,
}: ToggleSwitchProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!onChange) return;
    onChange(event.target.checked);
  }

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          onChange={handleChange}
          checked={checked}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 bg-gray-200 rounded-full peer 
          peer-focus:ring-4 peer-focus:ring-blue-300 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all 
          peer-checked:bg-blue-600
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        ></div>
      </div>
      <span
        className={`ml-3 text-sm font-medium text-gray-900 ${
          disabled ? "opacity-50" : ""
        }`}
      ></span>
    </label>
  );
}
