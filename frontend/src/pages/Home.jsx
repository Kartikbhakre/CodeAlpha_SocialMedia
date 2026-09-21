import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const loadPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await API.post("/posts", {
        content,
      });

      setContent("");
      loadPosts();

    } catch (error) {
      console.log(error);
    }
  };

  const searchUsers = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      const res = await API.get(
        `/users/search?q=${value}`
      );

      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">

        <aside className="sidebar">

          <div className="profile-mini">

            <div className="big-avatar">
              {user.name?.charAt(0)}
            </div>

            <h3>{user.name}</h3>

            <p>@{user.username}</p>

            <Link
              to={`/profile/${user.username}`}
            >
              View Profile
            </Link>

          </div>

          <div className="side-menu">

            <Link to="/home">
              🏠 Home
            </Link>

            <Link
              to={`/profile/${user.username}`}
            >
              👤 Profile
            </Link>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              🚪 Logout
            </button>

          </div>

        </aside>

        <main className="feed">

          <div className="search-box">

            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                searchUsers(e.target.value)
              }
            />

            {users.length > 0 && (
              <div className="search-results">

                {users.map((item) => (
                  <Link
                    key={item._id}
                    to={`/profile/${item.username}`}
                  >
                    <strong>{item.name}</strong>
                    <span>
                      @{item.username}
                    </span>
                  </Link>
                ))}

              </div>
            )}

          </div>

          <div className="create-post">

            <h3>What's on your mind?</h3>

            <textarea
              placeholder="Share something..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
            />

            <button
              className="primary-btn"
              onClick={createPost}
            >
              Create Post
            </button>

          </div>

          <h2>Recent Posts</h2>

          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                refresh={loadPosts}
              />
            ))
          )}

        </main>

        <aside className="right-sidebar">

          <div className="side-card">
            <h3>SocialHub</h3>
            <p>
              Connect. Share. Grow.
            </p>
          </div>

          <div className="side-card">
            <h3>Trending</h3>
            <p>#React</p>
            <p>#NodeJS</p>
            <p>#MongoDB</p>
            <p>#JavaScript</p>
            <p>#AI</p>
          </div>

        </aside>

      </div>
    </>
  );
}

export default Home;