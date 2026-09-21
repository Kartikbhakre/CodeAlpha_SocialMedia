import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const loadProfile = async () => {
    try {
      const res = await API.get(
        `/users/${username}`
      );

      setProfile(res.data.user);
      setPosts(res.data.posts);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const toggleFollow = async () => {
    try {
      await API.put(
        `/users/${profile._id}/follow`
      );

      loadProfile();

    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  const isMe =
    currentUser.username === profile.username;

  const isFollowing =
    profile.followers?.some(
      (item) => item._id === currentUser.id
    );

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-card">

          <div className="profile-avatar">
            {profile.name?.charAt(0)}
          </div>

          <h1>{profile.name}</h1>

          <p>@{profile.username}</p>

          <p className="bio">
            {profile.bio ||
              "No bio added yet."}
          </p>

          <div className="profile-stats">

            <div>
              <strong>
                {posts.length}
              </strong>
              <span>Posts</span>
            </div>

            <div>
              <strong>
                {profile.followers?.length || 0}
              </strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>
                {profile.following?.length || 0}
              </strong>
              <span>Following</span>
            </div>

          </div>

          {!isMe && (
            <button
              className="primary-btn"
              onClick={toggleFollow}
            >
              {isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
          )}

        </div>

        <h2>{profile.name}'s Posts</h2>

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            refresh={loadProfile}
          />
        ))}

      </div>
    </>
  );
}

export default Profile;