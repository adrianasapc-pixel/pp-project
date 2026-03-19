import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  file?: string;
  fileName?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface SensorData {
  heartRate: string;
  bloodOxygen: string;
  temperature: string;
  fallDetection: string;
  gpsLocation: string;
  lastUpdated: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  deleteMedicalRecord: (id: string) => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  deleteEmergencyContact: (id: string) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  sensorData: SensorData;
  updateSensorData: (data: Partial<SensorData>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>({
    heartRate: '',
    bloodOxygen: '',
    temperature: '',
    fallDetection: '',
    gpsLocation: '',
    lastUpdated: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('medBracelet_user');
    const savedRecords = localStorage.getItem('medBracelet_records');
    const savedContacts = localStorage.getItem('medBracelet_contacts');
    const savedSensorData = localStorage.getItem('medBracelet_sensorData');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedRecords) {
      setMedicalRecords(JSON.parse(savedRecords));
    }
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
    if (savedSensorData) {
      setSensorData(JSON.parse(savedSensorData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('medBracelet_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medBracelet_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('medBracelet_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    localStorage.setItem('medBracelet_sensorData', JSON.stringify(sensorData));
  }, [sensorData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = localStorage.getItem('medBracelet_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name });
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = localStorage.getItem('medBracelet_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };

    users.push(newUser);
    localStorage.setItem('medBracelet_users', JSON.stringify(users));
    
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name });
    return true;
  };

  const logout = () => {
    setUser(null);
    setMedicalRecords([]);
    setEmergencyContacts([]);
    setSensorData({
      heartRate: '',
      bloodOxygen: '',
      temperature: '',
      fallDetection: '',
      gpsLocation: '',
      lastUpdated: '',
    });
    localStorage.removeItem('medBracelet_user');
    localStorage.removeItem('medBracelet_records');
    localStorage.removeItem('medBracelet_contacts');
    localStorage.removeItem('medBracelet_sensorData');
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setMedicalRecords([...medicalRecords, newRecord]);
  };

  const deleteMedicalRecord = (id: string) => {
    setMedicalRecords(medicalRecords.filter(r => r.id !== id));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  const updateEmergencyContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setEmergencyContacts(emergencyContacts.map(c => 
      c.id === id ? { ...c, ...updatedContact } : c
    ));
  };

  const updateSensorData = (data: Partial<SensorData>) => {
    setSensorData({ ...sensorData, ...data });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        medicalRecords,
        addMedicalRecord,
        deleteMedicalRecord,
        emergencyContacts,
        addEmergencyContact,
        deleteEmergencyContact,
        updateEmergencyContact,
        sensorData,
        updateSensorData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}