import React from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const useAutoResizeTextArea = () => {
  const adjustHeight = React.useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    // Reset height temporarily to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height directly with a small buffer to prevent scrollbar flicker
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, []);

  return { adjustHeight };
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder
}) => {
  const { adjustHeight } = useAutoResizeTextArea();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Adjust height when value changes
  React.useEffect(() => {
    adjustHeight(textareaRef.current);
  }, [value, adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustHeight(e.target);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        style={{
          resize: 'none',
          minHeight: '60px',
          overflow: 'hidden', // This prevents the scrollbar
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};
