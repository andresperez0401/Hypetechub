# Skill: Next.js Responsive UI

## Purpose
Build clean, accessible, mobile-first UI components in Next.js using Tailwind CSS. Establishes component patterns, design tokens, and responsive breakpoint conventions.

## When to apply
- Building any UI component or page
- Reviewing frontend code for responsive or accessibility issues

## Principles
- Mobile-first: default styles target small screens, `md:` and `lg:` enhance for larger
- No inline styles — Tailwind utility classes only
- Semantic HTML: use correct elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`)
- Accessible: all interactive elements keyboard-reachable, aria labels where needed

## Breakpoint conventions
| Prefix | Min-width | Use for |
|--------|-----------|---------|
| (none) | 0px | Mobile, default |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop (use sparingly) |

## Component atom examples

### Button
```tsx
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className ?? ''}`}
      {...props}
    >
      {isLoading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
}
```

### Input
```tsx
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className ?? ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
```

## Page layout pattern
```tsx
// app/layout.tsx shell usage
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

## Form pattern (with React Hook Form + Zod)
```tsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // call API hook
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Email" id="email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" id="password" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isSubmitting}>Sign in</Button>
    </form>
  );
}
```

## Validation checklist
- [ ] Default styles target mobile, `md:`/`lg:` enhance layout
- [ ] No hardcoded pixel widths on content containers (use `max-w-*` + `mx-auto`)
- [ ] All form fields have associated `<label>`
- [ ] All buttons have descriptive text or `aria-label`
- [ ] No inline `style` attributes
- [ ] Loading states handled (spinner, disabled button)
