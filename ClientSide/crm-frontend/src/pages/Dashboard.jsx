import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ClientPieChart from "../components/ClientPieChart";
import ClientTable from "../components/ClientTable";

import "./Dashboard.css";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/clients"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch clients"
        );
      }

      setClients(data.clients || data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const newClients = clients.filter(
    (client) => client.status === "new"
  ).length;

  const contactedClients = clients.filter(
    (client) => client.status === "contacted"
  ).length;

  const convertedClients = clients.filter(
    (client) => client.status === "converted"
  ).length;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete client"
        );
      }

      setClients((prevClients) =>
        prevClients.filter(
          (client) => client._id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading">
          Loading dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome to your Client Management System
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Clients"
            value={clients.length}
            icon="👥"
          />

          <StatCard
            title="New Clients"
            value={newClients}
            icon="🆕"
          />

          <StatCard
            title="Contacted"
            value={contactedClients}
            icon="📞"
          />

          <StatCard
            title="Converted"
            value={convertedClients}
            icon="✅"
          />
        </div>

        <div className="dashboard-grid">
          <ClientPieChart clients={clients} />

          <div className="dashboard-summary">
            <h2>Client Summary</h2>

            <div className="summary-item">
              <span>New Clients</span>
              <strong>{newClients}</strong>
            </div>

            <div className="summary-item">
              <span>Contacted Clients</span>
              <strong>{contactedClients}</strong>
            </div>

            <div className="summary-item">
              <span>Converted Clients</span>
              <strong>{convertedClients}</strong>
            </div>
          </div>
        </div>

        <ClientTable
          clients={clients}
          onDelete={handleDelete}
        />
      </main>
    </>
  );
};

export default Dashboard;