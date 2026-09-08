// import { useEffect, useState } from "react";

// import Navbar from "../components/Navbar";
// import StatCard from "../components/StatCard";
// import ClientPieChart from "../components/ClientPieChart";
// import ClientTable from "../components/ClientTable";

// import "./Dashboard.css";

// const Dashboard = () => {
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchClients = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/clients"
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to fetch clients"
//         );
//       }

//       setClients(data.clients || data.data || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const newClients = clients.filter(
//     (client) => client.status === "new"
//   ).length;

//   const contactedClients = clients.filter(
//     (client) => client.status === "contacted"
//   ).length;

//   const convertedClients = clients.filter(
//     (client) => client.status === "converted"
//   ).length;

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this client?"
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/clients/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to delete client"
//         );
//       }

//       setClients((prevClients) =>
//         prevClients.filter(
//           (client) => client._id !== id
//         )
//       );
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />

//         <div className="loading">
//           Loading dashboard...
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />

//       <main className="dashboard">
//         <div className="dashboard-header">
//           <div>
//             <h1>Dashboard</h1>

//             <p>
//               Welcome to your Client Management System
//             </p>
//           </div>
//         </div>

//         <div className="stats-grid">
//           <StatCard
//             title="Total Clients"
//             value={clients.length}
//             icon="👥"
//           />

//           <StatCard
//             title="New Clients"
//             value={newClients}
//             icon="🆕"
//           />

//           <StatCard
//             title="Contacted"
//             value={contactedClients}
//             icon="📞"
//           />

//           <StatCard
//             title="Converted"
//             value={convertedClients}
//             icon="✅"
//           />
//         </div>

//         <div className="dashboard-grid">
//           <ClientPieChart clients={clients} />

//           <div className="dashboard-summary">
//             <h2>Client Summary</h2>

//             <div className="summary-item">
//               <span>New Clients</span>
//               <strong>{newClients}</strong>
//             </div>

//             <div className="summary-item">
//               <span>Contacted Clients</span>
//               <strong>{contactedClients}</strong>
//             </div>

//             <div className="summary-item">
//               <span>Converted Clients</span>
//               <strong>{convertedClients}</strong>
//             </div>
//           </div>
//         </div>

//         <ClientTable
//           clients={clients}
//           onDelete={handleDelete}
//         />
//       </main>
//     </>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/clients"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();

      setClients(data.clients || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // COUNTS
  const totalClients = clients.length;

  const newClients = clients.filter(
    (client) => client.status === "new"
  ).length;

  const contactedClients = clients.filter(
    (client) => client.status === "contacted"
  ).length;

  const convertedClients = clients.filter(
    (client) => client.status === "converted"
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

  const chartColors = [
    "#2563eb",
    "#10b981",
    "#8b5cf6",
  ];

  // SEARCH
  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      client.name?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.mobile?.toLowerCase().includes(searchText)
    );
  });

  // DELETE
  const deleteClient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setClients((prev) =>
        prev.filter((client) => client._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete client");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
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

          <a href="/clients" className="nav-item">
            <span>👤</span>
            Clients
          </a>

          <a href="/add-client" className="nav-item">
            <span>⊕</span>
            Add Client
          </a>

        </nav>

        <div className="logout">
          <span>⇥</span>
          Logout
        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="topbar-right">

            <div className="notification">
              🔔
              <span></span>
            </div>

            <div className="admin-profile">

              <div className="admin-avatar">
                👤
              </div>

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

              <p>
                Overview of your clients and their status
              </p>
            </div>

            <div className="date">
              📅 Sep 8, 2026
            </div>

          </div>


          {/* ================= STAT CARDS ================= */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <div className="stat-icon">
                👥
              </div>

              <div>
                <p>Total Clients</p>
                <h2>{totalClients}</h2>

                <span className="growth">
                  ↑ Clients in system
                </span>
              </div>

            </div>


            <div className="stat-card green">

              <div className="stat-icon">
                ＋
              </div>

              <div>
                <p>New Clients</p>
                <h2>{newClients}</h2>

                <span className="growth">
                  ↑ New clients
                </span>
              </div>

            </div>


            <div className="stat-card orange">

              <div className="stat-icon">
                📞
              </div>

              <div>
                <p>Contacted</p>
                <h2>{contactedClients}</h2>

                <span className="growth">
                  ↑ Contacted clients
                </span>
              </div>

            </div>


            <div className="stat-card purple">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <p>Converted</p>
                <h2>{convertedClients}</h2>

                <span className="growth">
                  ↑ Converted clients
                </span>
              </div>

            </div>

          </div>


          {/* ================= CHART SECTION ================= */}

          <div className="chart-grid">

            {/* PIE CHART */}

            <div className="card chart-card">

              <h2>
                Client Status Distribution
              </h2>

              <div className="pie-container">

                <ResponsiveContainer
                  width="100%"
                  height={330}
                >

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

                      {chartData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              chartColors[index]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>


            {/* STATUS SUMMARY */}

            <div className="card summary-card">

              <h2>
                Client Status Summary
              </h2>

              <div className="summary-list">

                <div className="summary-item">

                  <div>
                    <span className="dot blue-dot"></span>
                    New
                  </div>

                  <strong>
                    {newClients}
                  </strong>

                </div>


                <div className="summary-item">

                  <div>
                    <span className="dot green-dot"></span>
                    Contacted
                  </div>

                  <strong>
                    {contactedClients}
                  </strong>

                </div>


                <div className="summary-item">

                  <div>
                    <span className="dot purple-dot"></span>
                    Converted
                  </div>

                  <strong>
                    {convertedClients}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* ================= CLIENT TABLE ================= */}

          <div className="card clients-card">

            <div className="table-heading">

              <h2>
                Recent Clients
              </h2>

              <a href="/clients">
                View All
              </a>

            </div>


            {filteredClients.length === 0 ? (

              <div className="empty">
                No clients found.
              </div>

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

                    {filteredClients
                      .slice(0, 6)
                      .map((client) => (

                        <tr key={client._id}>

                          <td>
                            {client.name}
                          </td>

                          <td>
                            {client.email}
                          </td>

                          <td>
                            {client.mobile}
                          </td>

                          <td>
                            {client.address}
                          </td>

                          <td>

                            <span
                              className={`status-badge ${client.status}`}
                            >
                              {client.status}
                            </span>

                          </td>

                          <td>

                            <div className="actions">

                              <button
                                className="edit-btn"
                                title="Edit client"
                                onClick={() =>
                                  alert(
                                    "Edit functionality will be added next"
                                  )
                                }
                              >
                                ✎
                              </button>

                              <button
                                className="delete-btn"
                                title="Delete client"
                                onClick={() =>
                                  deleteClient(
                                    client._id
                                  )
                                }
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

    </div>
  );
};

export default Dashboard;