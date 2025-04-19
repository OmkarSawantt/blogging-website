import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'
import { UserContext } from '../context/userContext'
import axios from 'axios'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingComment, setIsDeletingComment] = useState(null)
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPost();
  }, [id])

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/comment/${id}`)
        setComments(response.data)
      } catch (error) {
        setCommentError("Failed to load comments")
      }
    }
    if (id) {
      getComments();
    }
  }, [id])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const commentData={
        postId: id,
        text: newComment
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts/comment`,
        { postId: id,
          text: newComment },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      )

      // Add the new comment to the comments array
      setComments([...comments, response.data])
      setNewComment('') // Clear the input field
      setCommentError(null)
    } catch (error) {
      console.log(error);

      setCommentError("Failed to add comment. Please try again.")
    }
    setIsSubmitting(false)
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeletingComment(commentId)
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      )

      // Remove the deleted comment from state
      setComments(comments.filter(comment => comment._id !== commentId))
    } catch (error) {
      setCommentError("Failed to delete comment. Please try again.")
    }
    setIsDeletingComment(null)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className='post-detail'>
      {error && <p className='error'>{error}</p>}
      {post && <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
          {currentUser?.id === post?.creator && <div className="post-detail__buttons">
            <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
            <DeletePost postId={id} />
          </div>
          }
        </div>
        <h1>{post.title}</h1>
        <div className="post-detail__thumbnail">
          <img src={`${post.thumbnail}`} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{ __html: post.description }}></p>

        {/* Comments Section */}
        <div className="post-comments">
          <h2>Comments</h2>

          {commentError && <p className="error">{commentError}</p>}

          {/* Comment submission form for logged in users */}
          {currentUser ? (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                rows="3"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
              <button type="submit" className="btn primary" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="comment-login-message">
              <Link to="/login">Log in</Link> to add a comment
            </p>
          )}

          {/* Comments list */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <PostAuthor authorID={comment.userId} createdAt={comment.createdAt} />
                    {currentUser && currentUser.id === comment.userId && (
                      <button
                        className="btn sm danger"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={isDeletingComment === comment._id}
                      >
                        {isDeletingComment === comment._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <p className="comment-content">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>}
    </section>
  )
}

export default PostDetail