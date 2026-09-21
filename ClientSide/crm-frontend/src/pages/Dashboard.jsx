import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faPhone,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import "./Dashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states for status update
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [statusValue, setStatusValue] = useState("Contacted");

  // Modal states for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients`);

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();

      setClients(data.clients || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // COUNTS (Case-insensitive check for reliability)
  const totalClients = clients.length;

  const newClients = clients.filter(
    (client) => client.status?.toLowerCase() === "new"
  ).length;

  const contactedClients = clients.filter(
    (client) => client.status?.toLowerCase() === "contacted"
  ).length;

  const convertedClients = clients.filter(
    (client) => client.status?.toLowerCase() === "converted"
  ).length;

  // PIE CHART DATA
  const chartData = [
    {
      name: "New",
      value: newClients,
    },
    {
      name: "Contacted",
      value: contactedClients,
    },
    {
      name: "Converted",
      value: convertedClients,
    },
  ];

  const chartColors = ["#2563eb", "#10b981", "#8b5cf6"];

  // SEARCH
  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      client.name?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.mobile?.toLowerCase().includes(searchText)
    );
  });

  // DELETE CLIENT API INTEGRATION VIA POPUP
  const deleteClient = async () => {
    if (!clientToDeleteId) return;

    try {
      const response = await fetch(`${API_URL}/api/clients/${clientToDeleteId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        setClients((prev) => prev.filter((client) => client._id !== clientToDeleteId));
        toast.success(result.msg || "Client deleted successfully!");
        setShowDeleteModal(false);
        setClientToDeleteId(null);
      } else {
        toast.error(result.msg || "Failed to delete client");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting client");
    }
  };

  // CHANGE USER STATUS API INTEGRATION
  const changeUserStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/changeStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: selectedClientId,
          status: statusValue,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setClients((prev) =>
          prev.map((client) =>
            client._id === selectedClientId
              ? { ...client, status: statusValue }
              : client
          )
        );
        toast.success(result.msg || "Status updated successfully!");
        setShowModal(false);
      } else {
        toast.error(result.msg || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong while updating status.");
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">👥</div>
          <div>
            <h2>CRM</h2>
            <p>Client Management System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <span>⌂</span>
            Dashboard
          </a>
        </nav>

        <div className="logout" onClick={handleLogout}>
          <span>⇥</span>
          Logout
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <div className="notification">
              🔔
              <span></span>
            </div>

            <div className="admin-profile">
              <div className="admin-avatar">👤</div>
              <strong>Admin</strong>
              <span>⌄</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="content">
          {/* TITLE */}
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Overview of your clients and their status</p>
            </div>

            <div className="date">
              📅{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {/* ================= STAT CARDS ================= */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div>
                <p>Total Clients</p>
                <h2>{totalClients}</h2>
                <span className="growth">↑ Clients in system</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div>
                <p>New Clients</p>
                <h2>{newClients}</h2>
                <span className="growth">↑ New clients</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <p>Contacted</p>
                <h2>{contactedClients}</h2>
                <span className="growth">↑ Contacted clients</span>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div>
                <p>Converted</p>
                <h2>{convertedClients}</h2>
                <span className="growth">↑ Converted clients</span>
              </div>
            </div>
          </div>

          {/* ================= CHART SECTION ================= */}
          <div className="chart-grid">
            <div className="card chart-card">
              <h2>Client Status Distribution</h2>
              <div className="pie-container">
                <ResponsiveContainer width="100%" height={330}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={115}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card summary-card">
              <h2>Client Status Summary</h2>
              <div className="summary-list">
                <div className="summary-item">
                  <div>
                    <span className="dot blue-dot"></span>
                    New
                  </div>
                  <strong>{newClients}</strong>
                </div>

                <div className="summary-item">
                  <div>
                    <span className="dot green-dot"></span>
                    Contacted
                  </div>
                  <strong>{contactedClients}</strong>
                </div>

                <div className="summary-item">
                  <div>
                    <span className="dot purple-dot"></span>
                    Converted
                  </div>
                  <strong>{convertedClients}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CLIENT TABLE ================= */}
          <div className="card clients-card">
            <div className="table-heading">
              <h2>Recent Clients</h2>
              <a href="/clients">View All</a>
            </div>

            {filteredClients.length === 0 ? (
              <div className="empty">No clients found.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.slice(0, 6).map((client) => (
                      <tr key={client._id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.mobile}</td>
                        <td>{client.address}</td>
                        <td>
                          <span className={`status-badge ${client.status?.toLowerCase()}`}>
                            {client.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="edit-btn"
                              title="Edit client status"
                              onClick={() => {
                                setSelectedClientId(client._id);
                                setStatusValue("Contacted");
                                setShowModal(true);
                              }}
                            >
                              ✎
                            </button>

                            <button
                              className="delete-btn"
                              title="Delete client"
                              onClick={() => {
                                setClientToDeleteId(client._id);
                                setShowDeleteModal(true);
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ================= STATUS UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", padding: "24px", borderRadius: "8px", width: "350px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <h3>Update Client Status</h3>
            <div style={{ margin: "20px 0" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Select Status:
              </label>
              <select
                className="form-control"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                style={{ padding: "6px 14px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={changeUserStatus}
                style={{ padding: "6px 14px", cursor: "pointer" }}
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "white", padding: "24px", borderRadius: "8px", width: "350px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <h3>Confirm Deletion</h3>
            <p style={{ margin: "15px 0", color: "#555" }}>
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: "6px 14px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteClient}
                style={{ padding: "6px 14px", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Dashboard;