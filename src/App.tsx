import { ConfigProvider } from "antd";
import { MainLayout } from "./components/layout/MainLayout";
import { EmployeeDashboard } from "./components/dashboard/EmployeeDashboard";
import { EmployeeList } from "./components/employees/EmployeeList";
import { ShiftList } from "./components/shifts/ShiftList";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2f5fb3",
        },
      }}
    >
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/employees" />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route
              path="/employees/:id/dashboard"
              element={<EmployeeDashboard />}
            />
            <Route path="/shifts" element={<ShiftList />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
