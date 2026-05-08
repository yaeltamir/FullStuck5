import { useEffect, useState } from "react";

import {
  apiGet,
  apiPost,
  apiDelete,
  apiPut,
} from "../api/api";

export default function Posts() {

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] =
    useState(null);

  const [comments, setComments] = useState([]);

  const [search, setSearch] = useState("");

  const [newTitle, setNewTitle] =
    useState("");

  const [newBody, setNewBody] =
    useState("");

  const [newComment, setNewComment] =
    useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  useEffect(() => {

    loadPosts();

  }, []);

  async function loadPosts() {

    const data = await apiGet(
      "/posts"
    );

    setPosts(data);
  }

  async function selectPost(post) {

    setSelectedPost(post);

    const data = await apiGet(
      `/comments?postId=${post.id}`
    );

    setComments(data);
  }

  async function addPost() {

    if (
      !newTitle.trim() ||
      !newBody.trim()
    ) {
      return;
    }

    const post = {
      userId: currentUser.id,
      title: newTitle,
      body: newBody,
    };

    const savedPost = await apiPost(
      "/posts",
      post
    );

    setPosts((prev) => [
      savedPost,
      ...prev,
    ]);

    setNewTitle("");
    setNewBody("");
    await loadPosts();
  }

  async function deletePost(id) {

    await apiDelete(
      `/posts/${id}`
    );

    setPosts((prev) =>
      prev.filter((p) => p.id !== id)
    );

    if (selectedPost?.id === id) {
      setSelectedPost(null);
      setComments([]);
    }
  }

  async function updatePost(id) {

    const post = posts.find(
      (p) => p.id === id
    );

    const title = prompt(
      "New title:",
      post.title
    );

    const body = prompt(
      "New body:",
      post.body
    );

    if (
      !title?.trim() ||
      !body?.trim()
    ) {
      return;
    }

    const updatedPost = {
      ...post,
      title,
      body,
    };

    await apiPut(
      `/posts/${id}`,
      updatedPost
    );

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? updatedPost
          : p
      )
    );

    setSelectedPost(updatedPost);
  }

  async function addComment() {

    if (
      !newComment.trim() ||
      !selectedPost
    ) {
      return;
    }

    const comment = {
      postId: selectedPost.id,
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      body: newComment,
    };

    const savedComment =
      await apiPost(
        "/comments",
        comment
      );

    setComments((prev) => [
      savedComment,
      ...prev,
    ]);

    setNewComment("");
    await selectPost(selectedPost);  // refresh comments - only when doing something 
  }

  async function deleteComment(id) {

    await apiDelete(
      `/comments/${id}`
    );

    setComments((prev) =>
      prev.filter((c) => c.id !== id)
    );
  }

  async function updateComment(id) {

    const comment = comments.find(
      (c) => c.id === id
    );

    const body = prompt(
      "New comment:",
      comment.body
    );

    if (!body?.trim()) {
      return;
    }

    const updatedComment = {
      ...comment,
      body,
    };

    await apiPut(
      `/comments/${id}`,
      updatedComment
    );

    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? updatedComment
          : c
      )
    );
  }

  const filteredPosts =
    posts.filter((post) => {

      const text =
        search.toLowerCase();

      return (
        post.title
          .toLowerCase()
          .includes(text) ||

        String(post.id)
          .includes(text)
      );
    });

  const myPosts =
    filteredPosts.filter(
      (p) =>
        p.userId === currentUser.id
    );

  const communityPosts =
    filteredPosts.filter(
      (p) =>
        p.userId !== currentUser.id
    );

  return (
    <div>

      <h1>Posts</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <hr />

      <h2>Add Post</h2>

      <input
        placeholder="Title"
        value={newTitle}
        onChange={(e) =>
          setNewTitle(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Body"
        value={newBody}
        onChange={(e) =>
          setNewBody(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={addPost}>
        Add Post
      </button>

      <hr />

      <h2>My Posts</h2>

      {myPosts.map((post) => (

        <div key={post.id}>

          <button
            onClick={() =>
              selectPost(post)
            }
          >
            {post.id} - {post.title}
          </button>

          <button
            onClick={() =>
              updatePost(post.id)
            }
          >
            Edit
          </button>

          <button
            onClick={() =>
              deletePost(post.id)
            }
          >
            Delete
          </button>

        </div>
      ))}

      <hr />

      <h2>Community Posts</h2>

      {communityPosts.map((post) => (

        <div key={post.id}>

          <button
            onClick={() =>
              selectPost(post)
            }
          >
            {post.id} - {post.title}
          </button>

        </div>
      ))}

      <hr />

      {selectedPost && (

        <div>

          <h2>
            {selectedPost.title}
          </h2>

          <p>
            {selectedPost.body}
          </p>

          <hr />

          <h3>Comments</h3>

          <input
            placeholder="Add comment..."
            value={newComment}
            onChange={(e) =>
              setNewComment(
                e.target.value
              )
            }
          />

          <button
            onClick={addComment}
          >
            Add Comment
          </button>

          <br />
          <br />

          {comments.map((comment) => (

            <div
              key={comment.id}
              style={{
                border:
                  "1px solid lightgray",
                padding: "10px",
                marginBottom: "10px",
              }}
            >

              <p>
                <b>
                  {comment.name}
                </b>
              </p>

              <p>
                {comment.body}
              </p>

              {comment.userId ===
                currentUser.id && (

                <>

                  <button
                    onClick={() =>
                      updateComment(
                        comment.id
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteComment(
                        comment.id
                      )
                    }
                  >
                    Delete
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