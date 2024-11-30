import { useState } from 'react'
import blogService from '../services/blogs'

const BlogDetails = ({ blog, user, incrementLikes, removeBlog }) => {
  const handleLike = async () => {
    await incrementLikes(blog)
  }

  const handleRemove = async () => {
    await removeBlog(blog)
  }

  return (
    <div>
      <div className="url">{blog.url}</div>
      <div className="likes">
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
      {blog.user.username === user.username && (
        <div>
          <button onClick={handleRemove}>remove</button>
        </div>
      )}
    </div>
  )
}

export default BlogDetails
