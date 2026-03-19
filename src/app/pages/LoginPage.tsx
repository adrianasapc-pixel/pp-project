import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, Heart, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isHydrated } = useAuth();
  const redirectPath =
    typeof (location.state as { from?: string } | null)?.from === 'string'
      ? (location.state as { from: string }).from
      : '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        navigate(redirectPath);
      } else {
        toast.error('No matching account was found on this device. Create one or use the demo login.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setIsLoading(true);

    try {
      const success = await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      if (success) {
        toast.success('Signed in with the demo account');
        navigate(redirectPath);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
        <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-900">Preparing sign-in...</p>
          <p className="mt-1 text-sm text-slate-500">Loading your saved account information.</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-3 rounded-xl">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VitaLock</h1>
          </div>
          <p className="text-gray-600">Secure Medical Bracelet System</p>
        </div>

        <Card className="shadow-xl border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your secure medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white p-2 text-teal-600 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-teal-950">Demo access</p>
                  <p className="text-sm text-teal-900">
                    This prototype stores accounts in the browser. Use the seeded demo account or create one on this
                    device first.
                  </p>
                  <div className="rounded-xl bg-white/80 px-3 py-2 text-sm text-teal-950">
                    <div>Email: {DEMO_CREDENTIALS.email}</div>
                    <div>Password: {DEMO_CREDENTIALS.password}</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-teal-300 bg-white text-teal-700 hover:bg-teal-100"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Use Demo Account
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <p className="text-xs text-gray-500">
                Accounts created here are saved locally in this browser for the prototype demo.
              </p>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Local demo data stays in your browser</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Live emergency workflow simulation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span>Bracelet pairing and profile demo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
