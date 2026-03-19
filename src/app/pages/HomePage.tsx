import { useState } from 'react';
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
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-teal-600 transition-colors">
                About
              </button>
              <a href="/login" className="text-gray-700 hover:text-teal-600 transition-colors">
                Sign in
              </a>
              <a href="/signup">
                <Button className="bg-teal-600 hover:bg-teal-700">Sign up</Button>
              </a>
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
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                About
              </button>
              <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Sign in
              </a>
              <a href="/signup" className="block px-4">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Sign up</Button>
              </a>
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
                <a href="/signup">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-6 w-full sm:w-auto">
                    Get Started
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 w-full sm:w-auto border-teal-600 text-teal-600 hover:bg-teal-50"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  Learn More
                </Button>
              </div>

              {/* App Store Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
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
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                <div className="bg-teal-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Trusted by</div>
                  <div className="text-xl font-bold text-gray-900">10,000+ users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 bg-teal-50 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700 font-medium">FDA Approved Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700 font-medium">24/7 Emergency Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700 font-medium">HIPAA Compliant</span>
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
                Receive your smart medical bracelet with QR code. The bracelet monitors your vitals 24/7 and detects emergencies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Protected</h3>
              <p className="text-gray-600">
                In an emergency, first responders scan your QR code for instant access to your medical info. Contacts are alerted automatically.
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
                Continuous tracking of heart rate, blood oxygen, and body temperature
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Military-grade encryption protects your sensitive medical data
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Auto Emergency Call</h3>
              <p className="text-gray-600">
                Automatic 911 contact and family notification when critical readings detected
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">
                QR code provides immediate access to medical records for first responders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1687757660310-6077c761f034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYnJhY2VsZXQlMjBoZWFsdGglMjBlbWVyZ2VuY3l8ZW58MXx8fHwxNzczODY2MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical bracelet technology"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Your Health Information, Always Within Reach
              </h2>
              <p className="text-lg text-gray-600">
                VitaLock was created by healthcare professionals and tech innovators who understand that 
                seconds matter in medical emergencies. Our mission is to bridge the gap between patients 
                and first responders with instant, accurate medical information.
              </p>
              <p className="text-lg text-gray-600">
                Whether you have allergies, chronic conditions, or simply want peace of mind, VitaLock 
                ensures your vital information is accessible when you need it most.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">10,000+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">500+</div>
                  <div className="text-gray-600">Lives Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">24/7</div>
                  <div className="text-gray-600">Monitoring</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Protect Your Health?
          </h2>
          <p className="text-xl text-teal-50 mb-8">
            Join thousands of users who trust VitaLock to keep them safe. Get started today with a free 30-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto">
                Start Free Trial
              </Button>
            </a>
            <a href="/login">
              <Button 
                variant="outline" 
                className="text-lg px-8 py-6 w-full sm:w-auto border-white text-white hover:bg-teal-700"
              >
                Sign In
              </Button>
            </a>
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
                <li><a href="#" className="hover:text-teal-500">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-teal-500">About</button></li>
                <li><a href="#" className="hover:text-teal-500">Contact</a></li>
                <li><a href="#" className="hover:text-teal-500">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-500">Terms of Service</a></li>
                <li><a href="#" className="hover:text-teal-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-teal-500">HIPAA Compliance</a></li>
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
