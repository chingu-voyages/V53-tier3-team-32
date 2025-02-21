import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/auth/Signin.tsx";
import Signup from "./pages/auth/Signup.tsx";
import Layout from "./components/sidebar/Layout.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AllergiesPage from "./pages/AllergiesPage.tsx";
import SchedulesPage from "./pages/SchedulesPage.tsx";
import DishAssignmentPage from "./pages/DishAssignmentPage.tsx";
import AllergenRestrictionsPage from "./pages/AllergenRestrictionsPage.tsx";
import OrderPreparationsPage from "./pages/OrderPreparationsPage.tsx";
import AuthCallback from "./components/AuthCallback.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes without Sidebar */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Private or main routes wrapped with Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/allergies"
          element={
            <PrivateRoute>
              <Layout>
                <AllergiesPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <PrivateRoute>
              <Layout>
                <SchedulesPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dish-assignment"
          element={
            <PrivateRoute>
              <Layout>
                <DishAssignmentPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/allergen-restrictions"
          element={
            <PrivateRoute>
              <Layout>
                <AllergenRestrictionsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-preparations"
          element={
            <PrivateRoute>
              <Layout>
                <OrderPreparationsPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
