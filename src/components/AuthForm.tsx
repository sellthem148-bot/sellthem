'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { LogoMark } from './Logo';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const t = useTranslations('auth');
  const locale = useLocale();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function messageForError(code: string): string {
    switch (code) {
      case 'email_taken':
        return t('errorEmailTaken');
      case 'invalid_credentials':
        return t('errorInvalid');
      case 'password_too_short':
        return t('errorShortPassword');
      default:
        return t('errorGeneric');
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { name, email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(messageForError(data?.error ?? 'server_error'));
        setLoading(false);
        return;
      }
      // Rechargement complet pour rafraîchir l'état connecté (en-tête, etc.)
      window.location.assign(`/${locale}`);
    } catch {
      setError(t('errorGeneric'));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-gray-100 p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <LogoMark size={48} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h1>
        </div>

        <div className="space-y-3">
          <SocialButton label={t('google')} onClick={() => setInfo(t('socialSoon'))} />
          <SocialButton label={t('apple')} dark onClick={() => setInfo(t('socialSoon'))} />
        </div>
        {info && <p className="mt-2 text-center text-xs text-gray-400">{info}</p>}

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-100" />
          {t('orContinue')}
          <span className="h-px flex-1 bg-gray-100" />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === 'register' && (
            <Field
              label={t('name')}
              type="text"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={setName}
            />
          )}
          <Field
            label={t('email')}
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={setEmail}
          />
          <Field
            label={t('password')}
            type="password"
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p className="rounded-lg bg-accent-500/10 px-3 py-2 text-center text-xs font-medium text-accent-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t('loading') : mode === 'login' ? t('loginBtn') : t('registerBtn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
          <Link
            href={mode === 'login' ? '/register' : '/login'}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            {mode === 'login' ? t('registerBtn') : t('loginBtn')}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function SocialButton({
  label,
  dark,
  onClick
}: {
  label: string;
  dark?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        dark
          ? 'bg-gray-900 text-white hover:bg-gray-800'
          : 'border border-gray-200 text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
