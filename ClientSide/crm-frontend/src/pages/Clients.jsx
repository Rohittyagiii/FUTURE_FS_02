import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      client.name?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.mobile?.includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <main className="clients-page">
        <div className="clients-header">
          <div>
            <h1>All Clients</h1>
            <p>Manage your clients from one place.</p>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">
              Contacted
            </option>
            <option value="converted">
              Converted
            </option>
          </select>
        </div>

        {loading ? (
          <p>Loading clients...</p>
        ) : (
          <div className="clients-table-wrapper">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-row"
                    >
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.name}</td>

                      <td>{client.email}</td>

                      <td>{client.mobile}</td>

                      <td>{client.address}</td>

                      <td>
                        {client.description || "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${client.status}`}
                        >
                          {client.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(client._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default Clients;