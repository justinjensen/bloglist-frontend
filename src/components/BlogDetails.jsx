import { useState } from 'react'
import blogService from '../services/blogs'

const BlogDetails = ({ blog, user, removeBlog }) => {
  const [likes, setLikes] = useState(blog.likes)

  const handleLike = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1
    }
    await blogService.update(blog.id, updatedBlog)
    setLikes(likes + 1)
  }

  const handleRemove = async () => {
    await removeBlog(blog)
  }

  return (
    <div>
      <div>{blog.url}</div>
      <div>
        {likes} likes <button onClick={handleLike}>like</button>
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
