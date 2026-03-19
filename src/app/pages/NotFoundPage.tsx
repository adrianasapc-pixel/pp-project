import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4">
      <Card className="w-full max-w-lg border-slate-200 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">404</div>
          <CardTitle className="text-3xl text-slate-900">Page not found</CardTitle>
          <CardDescription className="text-base text-slate-600">
            This demo route does not exist or may have moved during the prototype cleanup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Open Demo Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
