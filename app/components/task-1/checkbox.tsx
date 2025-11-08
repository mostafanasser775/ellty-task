import { CheckBoxCheckedIcon } from "../../icons";

interface CheckboxProps {
  checked?: boolean;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({ 
  checked = false, 
  id,
  disabled = false,
  className = ""
}: CheckboxProps) {
  return (
    <div className="inline-flex items-center">
      <label className="flex items-center cursor-pointer relative" htmlFor={id}>
        <input
          type="checkbox"
          defaultChecked={checked}
          disabled={disabled}
          className={`
            peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow 
            border-2 border-slate-300 
            
            focus:ring-blue-600/30
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          id={id}
        />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CheckBoxCheckedIcon />
        </span>
      </label>
    </div>
  );
}
