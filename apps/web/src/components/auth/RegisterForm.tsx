'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  turnstileToken: z.string().min(1, 'Token de Turnstile requerido'),
});

type RegisterFormSchema = z.infer<typeof registerSchema>;

export function RegisterForm(): JSX.Element {
  const { registerLocal, isLoading, error, data } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      turnstileToken: 'scaffolded-token',
    },
  });

  const onSubmit = async (formValues: RegisterFormSchema): Promise<void> => {
    await registerLocal(formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
          Correo
        </label>
        <input
          id="register-email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          {...register('password')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="register-turnstile" className="block text-sm font-medium text-slate-700">
          Turnstile Token (placeholder)
        </label>
        <input
          id="register-turnstile"
          type="text"
          {...register('turnstileToken')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        {errors.turnstileToken ? <p className="text-xs text-red-600">{errors.turnstileToken.message}</p> : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? <p className="text-sm text-emerald-700">{data.message}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {isLoading ? 'Procesando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
