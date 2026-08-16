const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-white text-red-600 border border-red-300 hover:bg-red-50',
}

function Button({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Button
