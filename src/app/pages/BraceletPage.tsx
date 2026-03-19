import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Watch, Activity, AlertTriangle, CheckCircle, Bell, Link2, RefreshCw, Unplug } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { SensorReadingBar } from '../components/SensorReadingBar';

export function BraceletPage() {
  const { user, medicalRecords, emergencyContacts, sensorData } = useAuth();
  const navigate = useNavigate();
  const [simulateEmergency, setSimulateEmergency] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');
  const [pairedCode, setPairedCode] = useState('');
  const [simulatedReadings, setSimulatedReadings] = useState({
    heartRate: 0,
    bloodOxygen: 0,
    temperature: 0,
  });
  const pairingStorageKey = user ? `medBracelet_pairingCode_${user.id}` : null;

  // Simulate live sensor readings based on average values
  useEffect(() => {
    if (sensorData.heartRate && sensorData.bloodOxygen && sensorData.temperature) {
      // Start with values close to average
      setSimulatedReadings({
        heartRate: parseInt(sensorData.heartRate),
        bloodOxygen: parseInt(sensorData.bloodOxygen),
        temperature: parseFloat(sensorData.temperature),
      });
    }
  }, [sensorData]);

  useEffect(() => {
    if (!pairingStorageKey) {
      setConnectionCode('');
      setPairedCode('');
      return;
    }

    const savedCode = localStorage.getItem(pairingStorageKey) ?? '';
    setConnectionCode(savedCode);
    setPairedCode(savedCode);
  }, [pairingStorageKey]);

  const handlePairBracelet = () => {
    const normalizedCode = connectionCode.trim().toUpperCase();

    if (!/^[A-Z0-9-]{6,16}$/.test(normalizedCode)) {
      toast.error('Enter a valid bracelet connection code, for example VTLK-2048.');
      return;
    }

    setConnectionCode(normalizedCode);
    setPairedCode(normalizedCode);
    if (pairingStorageKey) {
      localStorage.setItem(pairingStorageKey, normalizedCode);
    }
    toast.success('Bracelet paired successfully.');
  };

  const handleRemovePairing = () => {
    setConnectionCode('');
    setPairedCode('');
    if (pairingStorageKey) {
      localStorage.removeItem(pairingStorageKey);
    }
    toast.success('Bracelet pairing removed.');
  };

  const handleSimulateEmergency = () => {
    setSimulateEmergency(true);
    toast.error('Emergency detected! Contacting emergency services...', {
      duration: 5000,
    });

    setTimeout(() => {
      if (emergencyContacts.length > 0) {
        const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];
        toast.success(`Primary contact ${primaryContact.name} has been notified`, {
          duration: 5000,
        });
      }
      setTimeout(() => {
        toast.info('911 has been contacted with your location and medical information', {
          duration: 5000,
        });
        setTimeout(() => {
          setSimulateEmergency(false);
        }, 3000);
      }, 2000);
    }, 2000);
  };

  const handleRefreshReadings = () => {
    if (!sensorData.heartRate || !sensorData.bloodOxygen || !sensorData.temperature) {
      toast.error('Please set your average health values in Medical Records first');
      return;
    }

    const avgHR = parseInt(sensorData.heartRate);
    const avgBO = parseInt(sensorData.bloodOxygen);
    const avgTemp = parseFloat(sensorData.temperature);

    // Generate random readings that may vary from average
    const variance = Math.random();
    
    let newHeartRate, newBloodOxygen, newTemp;

    if (variance < 0.7) {
      // 70% chance - normal readings close to average
      newHeartRate = avgHR + Math.floor(Math.random() * 10 - 5);
      newBloodOxygen = avgBO + Math.floor(Math.random() * 4 - 2);
      newTemp = avgTemp + (Math.random() * 1 - 0.5);
    } else if (variance < 0.9) {
      // 20% chance - warning level readings
      newHeartRate = avgHR + (Math.random() > 0.5 ? 20 : -15);
      newBloodOxygen = avgBO + (Math.random() > 0.5 ? -5 : 2);
      newTemp = avgTemp + (Math.random() > 0.5 ? 2 : -1.5);
    } else {
      // 10% chance - critical readings
      newHeartRate = avgHR + (Math.random() > 0.5 ? 40 : -30);
      newBloodOxygen = avgBO - 10;
      newTemp = avgTemp + (Math.random() > 0.5 ? 3.5 : -2.5);
    }

    setSimulatedReadings({
      heartRate: Math.max(30, Math.min(200, Math.round(newHeartRate))),
      bloodOxygen: Math.max(70, Math.min(100, Math.round(newBloodOxygen))),
      temperature: Math.max(95, Math.min(105, parseFloat(newTemp.toFixed(1)))),
    });

    toast.success('Sensor readings updated');
  };

  const sensorReadings = sensorData.heartRate ? [
    {
      label: 'Heart Rate',
      average: parseInt(sensorData.heartRate),
      current: simulatedReadings.heartRate || parseInt(sensorData.heartRate),
      unit: 'bpm',
      lowThreshold: parseInt(sensorData.heartRate) - 10,
      highThreshold: parseInt(sensorData.heartRate) + 10,
      criticalLowThreshold: parseInt(sensorData.heartRate) - 25,
      criticalHighThreshold: parseInt(sensorData.heartRate) + 35,
    },
    {
      label: 'Blood Oxygen',
      average: parseInt(sensorData.bloodOxygen),
      current: simulatedReadings.bloodOxygen || parseInt(sensorData.bloodOxygen),
      unit: '%',
      lowThreshold: parseInt(sensorData.bloodOxygen) - 3,
      highThreshold: 100,
      criticalLowThreshold: parseInt(sensorData.bloodOxygen) - 8,
      criticalHighThreshold: 100,
    },
    {
      label: 'Body Temperature',
      average: parseFloat(sensorData.temperature),
      current: simulatedReadings.temperature || parseFloat(sensorData.temperature),
      unit: '°F',
      lowThreshold: parseFloat(sensorData.temperature) - 1,
      highThreshold: parseFloat(sensorData.temperature) + 1.5,
      criticalLowThreshold: parseFloat(sensorData.temperature) - 2,
      criticalHighThreshold: parseFloat(sensorData.temperature) + 3,
    },
  ] : [];
  const isPaired = pairedCode.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Bracelet</h1>
          <p className="text-gray-600 mt-2">Pair your bracelet and manage live device settings</p>
        </div>

        {/* Emergency Simulation Alert */}
        {simulateEmergency && (
          <Alert className="border-red-600 bg-red-50 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">EMERGENCY ALERT ACTIVE</AlertTitle>
            <AlertDescription className="text-red-800">
              Bracelet has detected an emergency. Contacting emergency services and contacts...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pairing Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Watch className="h-5 w-5" />
                Pair Your Bracelet
              </CardTitle>
              <CardDescription>
                Enter the connection code shown on the bracelet to link it with your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-3 ${isPaired ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {isPaired ? 'Bracelet paired' : 'Awaiting pairing'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {isPaired
                        ? `Connected with code ${pairedCode}.`
                        : 'Use the code from the bracelet package or device screen.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="connection-code" className="text-sm font-medium text-gray-700">
                  Connection Code
                </label>
                <Input
                  id="connection-code"
                  value={connectionCode}
                  onChange={(event) => setConnectionCode(event.target.value.toUpperCase())}
                  placeholder="VTLK-2048"
                  className="bg-white font-medium tracking-[0.2em] uppercase"
                />
                <p className="text-xs text-gray-500">
                  Example format: `VTLK-2048`
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handlePairBracelet} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link2 className="h-4 w-4 mr-2" />
                  Pair Bracelet
                </Button>
                <Button onClick={handleRemovePairing} className="flex-1" variant="outline" disabled={!isPaired && !connectionCode}>
                  <Unplug className="h-4 w-4 mr-2" />
                  Clear Code
                </Button>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                Pairing links this device to your medical profile so emergency alerts and live monitoring use the
                correct account.
              </div>
            </CardContent>
          </Card>

          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Device Status
              </CardTitle>
              <CardDescription>
                System monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between rounded-lg p-3 ${isPaired ? 'bg-green-50' : 'bg-amber-50'}`}>
                <span className={`font-medium ${isPaired ? 'text-green-900' : 'text-amber-900'}`}>Bracelet Status</span>
                <Badge className={isPaired ? 'bg-green-600' : 'bg-amber-500'}>
                  {isPaired ? 'Paired' : 'Awaiting code'}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Connection Code</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {isPaired ? pairedCode : 'Not paired'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Fall Detection</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {sensorData.fallDetection || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">GPS Location</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {sensorData.gpsLocation || 'Not set'}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Battery Level</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">85% - Approximately 3 days remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Sensor Readings */}
        {sensorReadings.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Sensor Readings
                  </CardTitle>
                  <CardDescription>
                    Bracelet automatically detects when readings are outside normal range
                  </CardDescription>
                </div>
                <Button onClick={handleRefreshReadings} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sensorReadings.map((reading) => (
                <SensorReadingBar key={reading.label} reading={reading} />
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>How it works:</strong> The bracelet continuously monitors your vitals. If readings enter the yellow
                  (warning) or red (critical) zones, it will automatically alert your emergency contacts. Critical readings
                  trigger immediate 911 contact.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-yellow-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <AlertTriangle className="h-5 w-5" />
                Set Your Average Health Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 mb-4">
                To see live sensor readings and enable automatic emergency detection, please set your average health
                values in the Medical Records page.
              </p>
              <Button onClick={() => navigate('/dashboard/medical-records')} className="bg-yellow-600 hover:bg-yellow-700">
                Go to Medical Records
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Emergency Button Simulation */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-5 w-5" />
              Emergency Alert System
            </CardTitle>
            <CardDescription>
              Test the emergency notification system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Your bracelet automatically detects emergencies such as falls, irregular heartbeat, or when you press the emergency button.
              Click below to simulate an emergency alert.
            </p>
            <Button
              onClick={handleSimulateEmergency}
              disabled={simulateEmergency}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Bell className="h-4 w-4 mr-2" />
              {simulateEmergency ? 'Emergency Alert Active...' : 'Simulate Emergency Alert'}
            </Button>
            {emergencyContacts.length === 0 && (
              <Alert className="border-yellow-300 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  You don't have any emergency contacts set up yet. Add contacts to receive emergency notifications.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>How to connect your bracelet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-blue-100 p-2 rounded-full h-fit">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Set Your Average Values</h4>
                  <p className="text-sm text-gray-600">
                    Go to Medical Records and enter your normal heart rate, blood oxygen, and temperature values.
                  </p>
                </div>
              </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-2 rounded-full h-fit">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Enter the Connection Code</h4>
                    <p className="text-sm text-gray-600">
                      Type the unique connection code printed on your bracelet or packaging, then pair the device.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-2 rounded-full h-fit">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Confirm Pairing</h4>
                    <p className="text-sm text-gray-600">
                      Once paired, the bracelet will stay linked to your profile on this device until you clear it.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                <div className="bg-blue-100 p-2 rounded-full h-fit">
                  <span className="font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Wear and Monitor</h4>
                  <p className="text-sm text-gray-600">
                    The bracelet continuously monitors your vitals. If readings deviate significantly, emergency contacts are alerted automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Medical Profile Summary</CardTitle>
            <CardDescription>Readiness summary for your paired bracelet and emergency profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Medical Records</p>
                <p className="text-2xl font-bold text-blue-900">{medicalRecords.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Emergency Contacts</p>
                <p className="text-2xl font-bold text-green-900">{emergencyContacts.length}</p>
              </div>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">
                ✓ Your bracelet links to this profile through a unique connection code
              </p>
              <p className="text-sm text-gray-600">
                ✓ Pairing keeps your emergency profile connected to the right device
              </p>
              <p className="text-sm text-gray-600">
                ✓ Automatic emergency detection and notification system active
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
