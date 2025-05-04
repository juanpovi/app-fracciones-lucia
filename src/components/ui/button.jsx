export function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  const baseStyle = "rounded px-4 py-2 font-medium transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  const sizes = {
    sm: "text-sm py-1 px-2",
    md: "text-base",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
