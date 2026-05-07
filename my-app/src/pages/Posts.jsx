import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    loadPosts(user.id);
  }, []);

  async function loadPosts(userId) {
    const data = await apiGet(`/posts?userId=${userId}`);
    setPosts(data);
  }

  async function selectPost(post) {
    setSelectedPost(post);
    const data = await apiGet(`/comments?postId=${post.id}`);
    setComments(data);
  }

  function addPost() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!newTitle.trim() || !newBody.trim() || !user) return;

    const post = {
      userId: user.id,
      id: Date.now(),
      title: newTitle,
      body: newBody,
    };

    setPosts([post, ...posts]);
    setNewTitle("");
    setNewBody("");
  }

  function deletePost(id) {
    setPosts(posts.filter((p) => p.id !== id));

    if (selectedPost?.id === id) {
      setSelectedPost(null);
      setComments([]);
    }
  }

  function updatePost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const title = prompt("New title:", post.title);
    const body = prompt("New body:", post.body);

    if (!title?.trim() || !body?.trim()) return;

    const updated = { ...post, title, body };

    setPosts(posts.map((p) => (p.id === id ? updated : p)));

    if (selectedPost?.id === id) {
      setSelectedPost(updated);
    }
  }

  function addComment() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!newComment.trim() || !selectedPost || !user) return;

    const comment = {
      id: Date.now(),
      postId: selectedPost.id,
      userId: user.id,
      name: user.name,
      body: newComment,
      ownedByCurrentUser: true,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  }

  function deleteComment(id) {
    setComments(comments.filter((c) => c.id !== id));
  }

  function updateComment(id) {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    const body = prompt("New comment:", comment.body);
    if (!body?.trim()) return;

    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, body } : c
      )
    );
  }

  const filteredPosts = posts.filter((post) => {
    const text = search.toLowerCase();

    return (
      post.title.toLowerCase().includes(text) ||
      String(post.id).includes(text)
    );
  });

  return (
    <div>
      <h1>Posts</h1>

      <input
        placeholder="Search by id/title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />

      <h2>Add Post</h2>

      <input
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Body"
        value={newBody}
        onChange={(e) => setNewBody(e.target.value)}
      />

      <br />

      <button onClick={addPost}>Add Post</button>

      <hr />

      <h2>Posts List</h2>

      {filteredPosts.map((post) => (
        <div key={post.id}>
          <button onClick={() => selectPost(post)}>
            {post.id} - {post.title}
          </button>

          <button onClick={() => updatePost(post.id)}>Update</button>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}

      <hr />

      {selectedPost && (
        <div>
          <h2>Selected Post</h2>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>

          <h3>Comments</h3>

          <input
            placeholder="Add comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button onClick={addComment}>Add Comment</button>

          {comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.body}</p>

              {comment.ownedByCurrentUser && (
                <>
                  <button onClick={() => updateComment(comment.id)}>
                    Update Comment
                  </button>

                  <button onClick={() => deleteComment(comment.id)}>
                    Delete Comment
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}