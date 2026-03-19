import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { FileText, Users, Watch, AlertCircle, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export function DashboardPage() {
  const { user, medicalRecords, emergencyContacts } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Medical Records',
      value: medicalRecords.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: () => navigate('/dashboard/medical-records'),
    },
    {
      title: 'Emergency Contacts',
      value: emergencyContacts.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      action: () => navigate('/dashboard/emergency-contacts'),
    },
    {
      title: 'Bracelet Status',
      value: 'Active',
      icon: Watch,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      action: () => navigate('/dashboard/bracelet'),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your medical information and bracelet settings</p>
        </div>

        {/* Alert for incomplete setup */}
        {(medicalRecords.length === 0 || emergencyContacts.length === 0) && (
          <Alert className="border-yellow-300 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">Complete Your Profile</AlertTitle>
            <AlertDescription className="text-yellow-800">
              {medicalRecords.length === 0 && 'Add your medical records to ensure first responders have critical information. '}
              {emergencyContacts.length === 0 && 'Add emergency contacts so we can reach your loved ones in case of emergency.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={stat.action}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">Click to manage</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/dashboard/medical-records')}
            >
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add Medical Record</div>
                <div className="text-sm text-gray-500">Upload a new document or note</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/dashboard/emergency-contacts')}
            >
              <Users className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add Emergency Contact</div>
                <div className="text-sm text-gray-500">Add a family member or friend</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/dashboard/bracelet')}
            >
              <Watch className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Bracelet QR Code</div>
                <div className="text-sm text-gray-500">Generate QR code for your device</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              onClick={() => navigate('/dashboard/bracelet')}
            >
              <Activity className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Health Metrics</div>
                <div className="text-sm text-gray-500">Open live bracelet readings</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Your VitaLock bracelet system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Store Your Medical Information</h4>
                <p className="text-sm text-gray-600">
                  Add allergies, medications, conditions, and emergency contacts to your secure profile.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Link Your Bracelet</h4>
                <p className="text-sm text-gray-600">
                  Generate a QR code that connects to your profile. First responders can scan it for instant access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Automatic Emergency Detection</h4>
                <p className="text-sm text-gray-600">
                  Bracelet sensors detect falls, irregular heartbeat, or emergency button press and alert contacts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
