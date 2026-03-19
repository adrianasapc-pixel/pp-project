import { Link, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage';

const PAGE_CONTENT = {
  '/pricing': {
    eyebrow: 'Demo Plans',
    title: 'Simple options for presenting the VitaLock demo',
    description: 'Use the free self-guided flow or position the product as a pilot for clinics and families.',
    cards: [
      { title: 'Self-Guided Demo', body: 'Free. Includes demo login, local browser data, bracelet pairing, and emergency simulation.' },
      { title: 'Care Team Walkthrough', body: 'Guided presentation flow for showing patient records, contacts, and bracelet monitoring to stakeholders.' },
      { title: 'Clinic Pilot Story', body: 'Use this narrative when presenting VitaLock as a future pilot for patient intake and incident response.' },
    ],
  },
  '/contact': {
    eyebrow: 'Contact',
    title: 'Reach the demo team',
    description: 'These options are intended for product demonstrations, walkthroughs, and feedback collection.',
    cards: [
      { title: 'Email', body: 'demo@vitalock.app' },
      { title: 'Demo Support Window', body: 'Monday to Friday, 9:00 AM to 5:00 PM local time.' },
      { title: 'Best Topics', body: 'Live demos, UX feedback, pairing issues, and medical record walkthroughs.' },
    ],
  },
  '/privacy': {
    eyebrow: 'Privacy',
    title: 'How this demo handles data',
    description: 'The VitaLock demo runs entirely in the browser so presenters can use it without a backend setup.',
    cards: [
      { title: 'Local Storage Only', body: 'Accounts, bracelet pairing, medical records, and contacts are stored in the current browser only.' },
      { title: 'No Real Emergency Dispatch', body: 'All alerts and escalations are simulated for demonstration purposes.' },
      { title: 'Reset Anytime', body: 'You can clear demo data by logging out or using browser storage tools between presentations.' },
    ],
  },
  '/terms': {
    eyebrow: 'Terms',
    title: 'Demo usage terms',
    description: 'This prototype is intended for presentations, design reviews, and product validation sessions.',
    cards: [
      { title: 'Presentation Only', body: 'Do not rely on this demo for real medical monitoring, emergency dispatch, or clinical decisions.' },
      { title: 'Mock Data Friendly', body: 'Use fictional or consented sample data when demonstrating medical records and contact information.' },
      { title: 'Prototype Limits', body: 'Features may change and data may be cleared between sessions as the demo evolves.' },
    ],
  },
} as const;

export function InfoPage() {
  const location = useLocation();
  const content = PAGE_CONTENT[location.pathname as keyof typeof PAGE_CONTENT];

  if (!content) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 p-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">{content.eyebrow}</div>
              <div className="text-2xl font-bold text-slate-900">VitaLock</div>
            </div>
          </Link>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link to="/signup">Open Demo</Link>
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl text-slate-900">{content.title}</CardTitle>
            <CardDescription className="max-w-3xl text-base text-slate-600">
              {content.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {content.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
          {location.pathname === '/contact' && (
            <Button asChild variant="outline">
              <a href="mailto:demo@vitalock.app">Email Demo Team</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
