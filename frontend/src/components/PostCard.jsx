import { useState } from "react";
import API from "../api";

function PostCard({ post, refresh }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const likePost = async () => {
    try {
      await API.put(`/posts/${post._id}/like`);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const loadComments = async () => {
    try {
      const res = await API.get(
        `/comments/posts/${post._id}/comments`
      );

      setComments(res.data.comments);
      setShowComments(!showComments);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await API.post(
        `/comments/posts/${post._id}/comments`,
        {
          text: comment,
        }
      );

      setComment("");

      const res = await API.get(
        `/comments/posts/${post._id}/comments`
      );

      setComments(res.data.comments);
      setShowComments(true);

    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const isOwner =
    post.author?._id === user.id;

  return (
    <div className="post-card">

      <div className="post-header">

        <div className="avatar">
          {post.author?.name?.charAt(0)}
        </div>

        <div>
          <strong>{post.author?.name}</strong>
          <p>@{post.author?.username}</p>
        </div>

      </div>

      <p className="post-content">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
        />
      )}

      <div className="post-actions">

        <button onClick={likePost}>
          ❤️ {post.likes?.length || 0}
        </button>

        <button onClick={loadComments}>
          💬 Comments
        </button>

        {isOwner && (
          <button onClick={deletePost}>
            🗑 Delete
          </button>
        )}

      </div>

      {showComments && (
        <div className="comments">

          {comments.map((item) => (
            <div
              className="comment"
              key={item._id}
            >
              <strong>
                {item.author?.username}
              </strong>

              <span>{item.text}</span>
            </div>
          ))}

          <form onSubmit={addComment}>
            <input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />

            <button>
              Send
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default PostCard;