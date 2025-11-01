import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-container">
      <nav className="navbar">
        <h1>RBAC MERN App - Admin Dashboard</h1>
        <div className="nav-right">
          <span className="user-info">
            {user?.username} ({user?.role})
          </span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="admin-content">
        <div className="admin-card">
          <h2>Admin Dashboard</h2>
          <p>Welcome to the Admin Dashboard. This page is only accessible to users with the Admin role.</p>
          
          <div className="admin-info">
            <h3>Your Permissions:</h3>
            <ul>
              <li>✅ View all posts</li>
              <li>✅ Create posts</li>
              <li>✅ Edit any post (including posts you don't own)</li>
              <li>✅ Delete any post</li>
              <li>✅ Access admin-only pages</li>
            </ul>
          </div>

          <div className="role-comparison">
            <h3>Role Permissions Comparison:</h3>
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Viewer</th>
                  <th>Editor</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>View Posts</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Create Posts</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Edit Own Posts</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Edit Any Post</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Delete Posts</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Admin Dashboard</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Link to="/posts" className="back-link">
            ← Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

