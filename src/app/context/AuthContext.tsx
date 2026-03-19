import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
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
  isHydrated: boolean;
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

const STORAGE_KEYS = {
  currentUser: 'medBracelet_user',
  users: 'medBracelet_users',
} as const;

const EMPTY_SENSOR_DATA: SensorData = {
  heartRate: '',
  bloodOxygen: '',
  temperature: '',
  fallDetection: '',
  gpsLocation: '',
  lastUpdated: '',
};

export const DEMO_CREDENTIALS = {
  email: 'demo@vitalock.app',
  password: 'demo12345',
} as const;

const DEMO_USER: StoredUser = {
  id: 'demo-user',
  name: 'Demo User',
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUserStorageKey(userId: string, key: 'records' | 'contacts' | 'sensorData') {
  return `medBracelet_${key}_${userId}`;
}

function ensureSeededUsers() {
  const storedUsers = readStorage<StoredUser[]>(STORAGE_KEYS.users, []);
  if (storedUsers.some((user) => user.email === DEMO_USER.email)) {
    return storedUsers;
  }

  const seededUsers = [...storedUsers, DEMO_USER];
  writeStorage(STORAGE_KEYS.users, seededUsers);
  return seededUsers;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>(EMPTY_SENSOR_DATA);

  useEffect(() => {
    ensureSeededUsers();
    const savedUser = readStorage<User | null>(STORAGE_KEYS.currentUser, null);
    setUser(savedUser);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user) {
      setMedicalRecords([]);
      setEmergencyContacts([]);
      setSensorData(EMPTY_SENSOR_DATA);
      setLoadedUserId(null);
      return;
    }

    setMedicalRecords(readStorage(getUserStorageKey(user.id, 'records'), []));
    setEmergencyContacts(readStorage(getUserStorageKey(user.id, 'contacts'), []));
    setSensorData(readStorage(getUserStorageKey(user.id, 'sensorData'), EMPTY_SENSOR_DATA));
    setLoadedUserId(user.id);
  }, [user, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (user) {
      writeStorage(STORAGE_KEYS.currentUser, user);
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }, [user, isHydrated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = ensureSeededUsers();
    const foundUser = users.find(
      (storedUser) => storedUser.email.toLowerCase() === normalizedEmail && storedUser.password === password,
    );

    if (foundUser) {
      setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name });
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = ensureSeededUsers();

    if (users.find((storedUser) => storedUser.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      email: normalizedEmail,
      password,
      name: name.trim(),
    };

    users.push(newUser);
    writeStorage(STORAGE_KEYS.users, users);
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name });
    return true;
  };

  const logout = () => {
    setUser(null);
    setMedicalRecords([]);
    setEmergencyContacts([]);
    setSensorData(EMPTY_SENSOR_DATA);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setMedicalRecords((currentRecords) => [...currentRecords, newRecord]);
  };

  const deleteMedicalRecord = (id: string) => {
    setMedicalRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setEmergencyContacts((currentContacts) => {
      if (!newContact.isPrimary) {
        return [...currentContacts, newContact];
      }

      return [...currentContacts.map((existingContact) => ({ ...existingContact, isPrimary: false })), newContact];
    });
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts((currentContacts) => currentContacts.filter((contact) => contact.id !== id));
  };

  const updateEmergencyContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setEmergencyContacts((currentContacts) => {
      const nextContacts = updatedContact.isPrimary
        ? currentContacts.map((contact) => ({ ...contact, isPrimary: false }))
        : currentContacts;

      return nextContacts.map((contact) => (contact.id === id ? { ...contact, ...updatedContact } : contact));
    });
  };

  const updateSensorData = (data: Partial<SensorData>) => {
    setSensorData((currentSensorData) => ({ ...currentSensorData, ...data }));
  };

  useEffect(() => {
    if (!user || !isHydrated || loadedUserId !== user.id) {
      return;
    }

    writeStorage(getUserStorageKey(user.id, 'records'), medicalRecords);
  }, [medicalRecords, user, isHydrated, loadedUserId]);

  useEffect(() => {
    if (!user || !isHydrated || loadedUserId !== user.id) {
      return;
    }

    writeStorage(getUserStorageKey(user.id, 'contacts'), emergencyContacts);
  }, [emergencyContacts, user, isHydrated, loadedUserId]);

  useEffect(() => {
    if (!user || !isHydrated || loadedUserId !== user.id) {
      return;
    }

    writeStorage(getUserStorageKey(user.id, 'sensorData'), sensorData);
  }, [sensorData, user, isHydrated, loadedUserId]);

  const contextValue: AuthContextType = {
    user,
    isHydrated,
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
