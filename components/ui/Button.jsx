export default function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 text-white rounded-full bg-primary hover:bg-hoverButton transition-all ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }