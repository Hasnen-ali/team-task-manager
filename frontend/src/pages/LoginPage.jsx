import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

// Demo accounts shown on login page
const DEMO_ACCOUNTS = [
  {
    name: 'Alice Admin',
    email: 'alice@taskflow.com',
    password: 'password123',
    role: 'Admin',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badge: 'bg-purple-600',
    initial: 'A',
  },
  {
    name: 'Frank Manager',
    email: 'frank@taskflow.com',
    password: 'password123',
    role: 'Admin',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    badge: 'bg-indigo-600',
    initial: 'F',
  },
  {
    name: 'Bob Builder',
    email: 'bob@taskflow.com',
    password: 'password123',
    role: 'Member',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badge: 'bg-blue-500',
    initial: 'B',
  },
  {
    name: 'Carol Designer',
    email: 'carol@taskflow.com',
    password: 'password123',
    role: 'Member',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    badge: 'bg-pink-500',
    initial: 'C',
  },
  {
    name: 'David Dev',
    email: 'david@taskflow.com',
    password: 'password123',
    role: 'Member',
    color: 'bg-green-100 text-green-700 border-green-200',
    badge: 'bg-green-500',
    initial: 'D',
  },
  {
    name: 'Eva Engineer',
    email: 'eva@taskflow.com',
    password: 'password123',
    role: 'Member',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    badge: 'bg-orange-500',
    initial: 'E',
  },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  // Fill credentials AND immediately submit
  const handleDemoLogin = async (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast.loading(`Logging in as ${account.name}...`, { id: 'demo-login' });
    try {
      const res = await loginUser({ email: account.email, password: account.password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}!`, { id: 'demo-login' });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', { id: 'demo-login' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6 items-start justify-center">

        {/* ── Left: Login Form ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl w-full lg:max-w-md p-8 flex-shrink-0">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* ── Right: Demo Credentials ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl w-full lg:max-w-xs p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-gray-900">Demo Accounts</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              Click to login
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Password for all accounts:{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
              password123
            </code>
          </p>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] cursor-pointer text-left ${account.color}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full ${account.badge} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {account.initial}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{account.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                        account.role === 'Admin'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {account.role}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 truncate mt-0.5">{account.email}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 opacity-50 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Hint */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">💡 Tip:</span> Run{' '}
              <code className="bg-amber-100 px-1 rounded font-mono">npm run seed</code> in the
              backend folder to populate demo data first.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
