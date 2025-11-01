import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './PostList.css';

const PostList = () => {
  const { user, logout, isAdmin, isEditor } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Configure axios
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}`, {
        title: editTitle,
        content: editContent
      });
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update post');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', {
        title: newTitle,
        content: newContent
      });
      setNewTitle('');
      setNewContent('');
      setShowCreateForm(false);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create post');
    }
  };

  const canEdit = (post) => {
    return isAdmin || (isEditor && post.authorId?._id === user?.id);
  };

  const canDelete = () => {
    return isAdmin;
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1>RBAC MERN App</h1>
        <div className="nav-right">
          {isAdmin && (
            <Link to="/admin" className="admin-link">
              Admin Dashboard
            </Link>
          )}
          <span className="user-info">
            {user?.username} ({user?.role})
          </span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="content">
        <div className="header-section">
          <h2>Posts</h2>
          {(isAdmin || isEditor) && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="create-btn"
            >
              {showCreateForm ? 'Cancel' : '+ Create Post'}
            </button>
          )}
        </div>

        {showCreateForm && (isAdmin || isEditor) && (
          <div className="create-form">
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Post Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Post Content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                rows="4"
              />
              <button type="submit" className="submit-post-btn">
                Create Post
              </button>
            </form>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {editingPost === post._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="edit-textarea"
                    rows="4"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleSaveEdit(post._id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <p className="post-author">
                    By: {post.authorId?.username || 'Unknown'} |{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="post-actions">
                    {canEdit(post) ? (
                      <button
                        onClick={() => handleEdit(post)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="edit-btn disabled"
                        title={
                          isEditor
                            ? 'Only the owner can edit this post'
                            : 'Requires Editor or Admin role'
                        }
                        disabled
                      >
                        Edit
                      </button>
                    )}

                    {canDelete() ? (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="delete-btn disabled"
                        title="Requires Admin role"
                        disabled
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="empty-state">
            <p>No posts yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;

