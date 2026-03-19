import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Shield, Heart, Phone, Clock, CheckCircle, Menu, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-teal-600" />
              <span className="text-2xl font-bold text-gray-900">VitaLock</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-teal-600 transition-colors">
                How it works
              </button>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-teal-600 transition-colors">
                Features
              </button>
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-200">
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                How it works
              </button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                Features
              </button>
              <div className="block px-4">
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Protect your health,{' '}
                  <span className="text-teal-600">save your life</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  VitaLock combines smart bracelet technology with instant emergency response. 
                  Your medical information, always accessible when seconds matter most.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-6 w-full sm:w-auto">
                  <Link to="/signup">
                    Get Started
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 w-full sm:w-auto border-teal-600 text-teal-600 hover:bg-teal-50"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  Learn More
                </Button>
              </div>

            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691463610-3c2ecf5fb3fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwc21pbGluZ3xlbnwxfHx8fDE3NzM4NTQ0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Healthcare professional using VitaLock"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 bg-teal-50 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700 font-medium">24/7 Bracelet Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How VitaLock Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple setup, powerful protection. Your health data, always ready when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and enter your medical information, allergies, medications, and emergency contacts. It takes just 5 minutes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wear Your Bracelet</h3>
              <p className="text-gray-600">
                Enter the connection code from your bracelet to pair it with your profile. Once linked, it starts syncing to the system.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Protected</h3>
              <p className="text-gray-600">
                If the bracelet detects an emergency, the system can surface your medical profile and notify your emergency contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay safe and give your loved ones peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Health Monitoring</h3>
              <p className="text-gray-600">
                Continuous tracking of heart rate, oxygen, temperature, breathing, and blood pressure baselines
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Demo data stays isolated per user in the current browser
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Simulation</h3>
              <p className="text-gray-600">
                Demonstrate how alerts, contact escalation, and bracelet incidents appear in the app
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">
                Pairing code links your bracelet to the right medical profile in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-teal-500" />
                <span className="text-xl font-bold text-white">VitaLock</span>
              </div>
              <p className="text-sm">
                Protecting lives with intelligent medical technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-teal-500">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-teal-500">How it works</button></li>
                <li><Link to="/pricing" className="hover:text-teal-500">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-teal-500">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-teal-500">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-teal-500">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-teal-500">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-teal-500">Demo Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 VitaLock. All rights reserved. This is a prototype demonstration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
