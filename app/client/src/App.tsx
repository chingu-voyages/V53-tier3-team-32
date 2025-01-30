import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin.tsx";
import Signup from "./pages/Signup.tsx";
import Layout from "./components/sidebar/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AllergiesPage from "./pages/AllergiesPage.tsx";
import SchedulesPage from "./pages/SchedulesPage.tsx";
import DishAssignmentPage from "./pages/DishAssignmentPage.tsx";
import AllergenRestrictionsPage from "./pages/AllergenRestrictionsPage.tsx";
import OrderPreparationsPage from "./pages/OrderPreparationsPage.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes without Sidebar */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private or main routes wrapped with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/allergies"
          element={
            <Layout>
              <AllergiesPage />
            </Layout>
          }
        />
        <Route
          path="/schedules"
          element={
            <Layout>
              <SchedulesPage />
            </Layout>
          }
        />
        <Route
          path="/dish-assignment"
          element={
            <Layout>
              <DishAssignmentPage />
            </Layout>
          }
        />
        <Route
          path="/allergen-restrictions"
          element={
            <Layout>
              <AllergenRestrictionsPage />
            </Layout>
          }
        />
        <Route
          path="/order-preparations"
          element={
            <Layout>
              <OrderPreparationsPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
