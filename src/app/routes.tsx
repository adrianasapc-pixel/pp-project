import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicalRecordsPage } from "./pages/MedicalRecordsPage";
import { EmergencyContactsPage } from "./pages/EmergencyContactsPage";
import { BraceletPage } from "./pages/BraceletPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
      {
        path: "dashboard",
        Component: ProtectedRoute,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: "medical-records",
            Component: MedicalRecordsPage,
          },
          {
            path: "emergency-contacts",
            Component: EmergencyContactsPage,
          },
          {
            path: "bracelet",
            Component: BraceletPage,
          },
        ],
      },
    ],
  },
]);