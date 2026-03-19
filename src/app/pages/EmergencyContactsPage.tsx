import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, Users, Phone, Star, Pencil, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';

const MIN_PHONE_DIGITS = 7;

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, '');
}

function getPhoneHrefValue(phone: string) {
  const trimmedPhone = phone.trim();
  const digits = getPhoneDigits(trimmedPhone);

  if (digits.length < MIN_PHONE_DIGITS) {
    return '';
  }

  return trimmedPhone.startsWith('+') ? `+${digits}` : digits;
}

export function EmergencyContactsPage() {
  const { emergencyContacts, addEmergencyContact, deleteEmergencyContact, updateEmergencyContact } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false,
  });

  const resetForm = () => {
    setEditingContactId(null);
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      isPrimary: false,
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (id: string) => {
    const contact = emergencyContacts.find((item) => item.id === id);
    if (!contact) {
      return;
    }

    setEditingContactId(id);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      isPrimary: contact.isPrimary,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate phone number format
    const normalizedPhone = formData.phone.trim().replace(/\s+/g, ' ');
    const phoneRegex = /^[\d\s\-+().]+$/;
    if (!phoneRegex.test(normalizedPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (getPhoneDigits(normalizedPhone).length < MIN_PHONE_DIGITS) {
      toast.error('Phone numbers should include at least 7 digits');
      return;
    }

    const contactPayload = {
      ...formData,
      phone: normalizedPhone,
    };

    const currentContact = editingContactId
      ? emergencyContacts.find((contact) => contact.id === editingContactId)
      : null;

    if (currentContact?.isPrimary && !contactPayload.isPrimary) {
      if (emergencyContacts.length === 1) {
        toast.error('At least one primary contact is required.');
      } else {
        toast.info('Choose another contact as primary before turning this one off.');
      }
      return;
    }

    if (editingContactId) {
      updateEmergencyContact(editingContactId, contactPayload);
      toast.success('Emergency contact updated successfully!');
    } else {
      addEmergencyContact(contactPayload);
      toast.success('Emergency contact added successfully!');
    }

    closeDialog();
  };

  const handleDelete = (id: string) => {
    deleteEmergencyContact(id);
    toast.success('Emergency contact deleted');
  };

  const togglePrimary = (id: string, isPrimary: boolean) => {
    if (!isPrimary) {
      if (emergencyContacts.length === 1) {
        toast.error('At least one primary contact is required.');
        return;
      }

      toast.info('Choose another contact to make them primary.');
      return;
    }

    updateEmergencyContact(id, { isPrimary });
    toast.success('Set as primary contact');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
            <p className="text-gray-600 mt-2">People to contact in case of emergency</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingContactId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</DialogTitle>
                <DialogDescription>
                  {editingContactId
                    ? 'Update who should be notified in the demo emergency flow'
                    : 'Add someone who should be notified in case of emergency'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select value={formData.relationship} onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="primary">Primary Contact</Label>
                    <p className="text-sm text-gray-500">This person will be contacted first</p>
                  </div>
                  <Switch
                    id="primary"
                    checked={formData.isPrimary}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {editingContactId ? 'Save Changes' : 'Add Contact'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {emergencyContacts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No emergency contacts yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Add trusted people who should be notified in case of emergency
              </p>
              <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact) => {
              const phoneHrefValue = getPhoneHrefValue(contact.phone);
              const canUsePhoneActions = phoneHrefValue !== '';

              return (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {contact.name}
                            {contact.isPrimary && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(contact.id)}
                          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {canUsePhoneActions ? (
                        <a href={`tel:${phoneHrefValue}`} className="hover:underline">
                          {contact.phone}
                        </a>
                      ) : (
                        <span>{contact.phone}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {canUsePhoneActions ? (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <a href={`tel:${phoneHrefValue}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      {canUsePhoneActions ? (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <a href={`sms:${phoneHrefValue}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Text
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Text
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Primary Contact</span>
                      <Switch
                        checked={contact.isPrimary}
                        onCheckedChange={(checked) => togglePrimary(contact.id, checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">How Emergency Contacts Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-800">
            <p>• Your bracelet sensors detect falls, irregular vitals, or emergency button press</p>
            <p>• The primary contact is surfaced first in the demo emergency workflow</p>
            <p>• Call and text shortcuts work directly from this screen on supported devices</p>
            <p>• You can edit contact details at any time for the live demo</p>
            <p>• Emergency alerts are simulated in-app for presentation purposes</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
