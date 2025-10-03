import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../services/api"; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers(); 
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("Error", "Failed to load user list.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //  Delete user 
  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/users/${userId}`);
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "Failed to delete user.", "error");
        }
      }
    });
  };

  return (
    <div className="container user-management">
      {/*  Page Header  */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>
          <i className="fa fa-users"></i> User Management
        </h2>
        
      </div>

      {/*  User Table  */}
      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`role-badge ${
                          user.role === "Admin" ? "role-admin" : "role-user"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.active ? (
                        <span className="status-badge status-active">
                          <i className="fa fa-check-circle"></i> Active
                        </span>
                      ) : (
                        <span className="status-badge status-inactive">
                          <i className="fa fa-times-circle"></i> Inactive
                        </span>
                      )}
                    </td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <i className="fa fa-info-circle"></i> No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
