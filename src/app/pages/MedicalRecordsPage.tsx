import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, FileText, AlertCircle, Pill, Syringe, Heart, Activity, X, Paperclip, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

const EMPTY_SENSOR_FORM = {
  heartRate: '',
  bloodOxygen: '',
  temperature: '',
  respiratoryRate: '',
  systolicPressure: '',
  diastolicPressure: '',
  fallDetection: 'Active',
  gpsLocation: 'Enabled',
};

const NUMERIC_SENSOR_KEYS = [
  'heartRate',
  'bloodOxygen',
  'temperature',
  'respiratoryRate',
  'systolicPressure',
  'diastolicPressure',
] as const;

const MAX_ATTACHMENT_SIZE = 1024 * 1024;

function createEmptyRecordForm() {
  return {
    type: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    file: '',
    fileName: '',
  };
}

function toRecordDateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

export function MedicalRecordsPage() {
  const { medicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord, sensorData, updateSensorData } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [formData, setFormData] = useState(createEmptyRecordForm());

  // Medical conditions state
  const [conditions, setConditions] = useState<string[]>(['']);

  // Sensor data form state
  const [sensorFormData, setSensorFormData] = useState(EMPTY_SENSOR_FORM);

  useEffect(() => {
    setSensorFormData({
      ...EMPTY_SENSOR_FORM,
      heartRate: sensorData.heartRate,
      bloodOxygen: sensorData.bloodOxygen,
      temperature: sensorData.temperature,
      respiratoryRate: sensorData.respiratoryRate || '',
      systolicPressure: sensorData.systolicPressure || '',
      diastolicPressure: sensorData.diastolicPressure || '',
      fallDetection: sensorData.fallDetection || 'Active',
      gpsLocation: sensorData.gpsLocation || 'Enabled',
    });
  }, [sensorData]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingRecordId(null);
    setFormData(createEmptyRecordForm());
  };

  const openCreateDialog = () => {
    setEditingRecordId(null);
    setFormData(createEmptyRecordForm());
    setIsDialogOpen(true);
  };

  const openEditDialog = (recordId: string) => {
    const record = medicalRecords.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    setEditingRecordId(recordId);
    setFormData({
      type: record.type,
      title: record.title,
      description: record.description,
      date: record.date,
      file: record.file || '',
      fileName: record.fileName || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingRecordId) {
      updateMedicalRecord(editingRecordId, formData);
      toast.success('Medical record updated successfully!');
    } else {
      addMedicalRecord(formData);
      toast.success('Medical record added successfully!');
    }

    closeDialog();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_ATTACHMENT_SIZE) {
        toast.error('Attachments must be 1 MB or smaller for the demo.');
        return;
      }

      try {
        const fileDataUrl = await readFileAsDataUrl(file);
        setFormData((currentData) => ({ ...currentData, fileName: file.name, file: fileDataUrl }));
        toast.success(`File "${file.name}" attached`);
      } catch {
        toast.error('Unable to attach this file. Please try another one.');
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteMedicalRecord(id);
    toast.success('Medical record deleted');
  };

  // Medical conditions handlers
  const addConditionField = () => {
    setConditions([...conditions, '']);
  };

  const removeConditionField = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions.length === 0 ? [''] : newConditions);
  };

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = value;
    setConditions(newConditions);
  };

  const saveConditions = () => {
    const validConditions = conditions.filter(c => c.trim() !== '');
    if (validConditions.length === 0) {
      toast.error('Please enter at least one medical condition');
      return;
    }

    validConditions.forEach(condition => {
      addMedicalRecord({
        type: 'condition',
        title: condition,
        description: condition,
        date: new Date().toISOString().split('T')[0],
      });
    });

    toast.success('Medical conditions saved successfully!');
    setConditions(['']);
  };

  // Sensor data handler
  const saveSensorData = () => {
    const hasAtLeastOneMetric = NUMERIC_SENSOR_KEYS.some((key) => sensorFormData[key].trim() !== '');

    if (!hasAtLeastOneMetric) {
      toast.error('Enter at least one average health value before saving.');
      return;
    }

    updateSensorData({
      ...sensorFormData,
      lastUpdated: new Date().toLocaleString(),
    });

    toast.success('Sensor data updated! Check the Bracelet page to see the changes.');
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-blue-600" />;
      case 'condition':
        return <Heart className="h-5 w-5 text-purple-600" />;
      case 'vaccination':
        return <Syringe className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'allergy':
        return 'bg-red-100 text-red-800';
      case 'medication':
        return 'bg-blue-100 text-blue-800';
      case 'condition':
        return 'bg-purple-100 text-purple-800';
      case 'vaccination':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-2">Manage your medical information securely</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingRecordId ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
                <DialogDescription>
                  {editingRecordId
                    ? 'Update the details for this medical record'
                    : 'Add important medical information to your profile'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allergy">Allergy</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="condition">Medical Condition</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="procedure">Procedure/Surgery</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Penicillin Allergy"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about this medical record..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Attach File (optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  {formData.fileName && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-slate-700">
                        <Paperclip className="h-4 w-4" />
                        {formData.fileName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setFormData((currentData) => ({ ...currentData, file: '', fileName: '' }))}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {editingRecordId ? 'Save Changes' : 'Add Record'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Medical Conditions Quick Entry */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Heart className="h-5 w-5" />
              Quick Add Medical Conditions
            </CardTitle>
            <CardDescription>Enter your medical conditions quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter medical condition (e.g., Diabetes, Asthma)"
                  value={condition}
                  onChange={(e) => updateCondition(index, e.target.value)}
                  className="flex-1 bg-white"
                />
                {conditions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeConditionField(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {index === conditions.length - 1 && (
                  <Button
                    type="button"
                    onClick={addConditionField}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={saveConditions} className="w-full bg-purple-600 hover:bg-purple-700">
              Save All Conditions
            </Button>
          </CardContent>
        </Card>

        {/* Sensor Data Entry Form */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Activity className="h-5 w-5" />
              Average Health Values
            </CardTitle>
            <CardDescription>
              Enter your normal health metrics. Core bracelet sensors plus optional vitals improve monitoring accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Average Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="e.g., 72"
                  value={sensorFormData.heartRate}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, heartRate: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodOxygen">Average Blood Oxygen (%)</Label>
                <Input
                  id="bloodOxygen"
                  type="number"
                  placeholder="e.g., 98"
                  value={sensorFormData.bloodOxygen}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, bloodOxygen: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Average Body Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 98.6"
                  value={sensorFormData.temperature}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, temperature: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Average Respiratory Rate (breaths/min)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="e.g., 16"
                  value={sensorFormData.respiratoryRate}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, respiratoryRate: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systolicPressure">Average Blood Pressure Systolic (mmHg)</Label>
                <Input
                  id="systolicPressure"
                  type="number"
                  placeholder="e.g., 120"
                  value={sensorFormData.systolicPressure}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, systolicPressure: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolicPressure">Average Blood Pressure Diastolic (mmHg)</Label>
                <Input
                  id="diastolicPressure"
                  type="number"
                  placeholder="e.g., 80"
                  value={sensorFormData.diastolicPressure}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, diastolicPressure: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallDetection">Fall Detection</Label>
                <Select 
                  value={sensorFormData.fallDetection} 
                  onValueChange={(value) => setSensorFormData({ ...sensorFormData, fallDetection: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpsLocation">GPS Location</Label>
                <Select 
                  value={sensorFormData.gpsLocation} 
                  onValueChange={(value) => setSensorFormData({ ...sensorFormData, gpsLocation: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enabled">Enabled</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={saveSensorData} className="w-full bg-blue-600 hover:bg-blue-700">
              Save Average Values
            </Button>
            <p className="text-xs text-blue-700 text-center">
              The bracelet can compare heart rate, oxygen, temperature, breathing, and blood pressure baselines to spot abnormal changes
            </p>
            {sensorData.lastUpdated && (
              <p className="text-sm text-blue-700 text-center font-medium">
                Last updated: {sensorData.lastUpdated}
              </p>
            )}
          </CardContent>
        </Card>

        {medicalRecords.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Start by adding your allergies, medications, and medical conditions
              </p>
              <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medicalRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        {getRecordIcon(record.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{record.title}</CardTitle>
                        <Badge className={`mt-1 ${getRecordColor(record.type)}`}>
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(record.id)}
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{record.description}</p>
                  {record.fileName && record.file && (
                    <a
                      href={record.file}
                      download={record.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <Paperclip className="h-4 w-4" />
                      {record.fileName}
                    </a>
                  )}
                  <p className="text-sm text-gray-500">
                    Date: {toRecordDateLabel(record.date)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Critical Information Card */}
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-red-800">
            <p>• Always keep your medical records up to date</p>
            <p>• Include all allergies, especially drug allergies</p>
            <p>• List current medications with dosages</p>
            <p>• Note any chronic conditions or recent surgeries</p>
            <p>• Update sensor data regularly for accurate monitoring</p>
            <p>• This information can save your life in an emergency</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
