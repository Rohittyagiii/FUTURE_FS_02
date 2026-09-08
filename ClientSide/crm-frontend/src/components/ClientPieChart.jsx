import "./ClientTable.css";

const ClientTable = ({ clients, onDelete }) => {
  return (
    <div className="client-table-container">
      <div className="table-header">
        <h2>Recent Clients</h2>
      </div>

      {clients.length === 0 ? (
        <p className="no-clients">
          No clients found.
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="client-table">
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
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>

                  <td>{client.email}</td>

                  <td>{client.mobile}</td>

                  <td>{client.address}</td>

                  <td>
                    <span
                      className={`status-badge ${client.status}`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(client._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientTable;