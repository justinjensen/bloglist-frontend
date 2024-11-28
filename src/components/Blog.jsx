import { useState } from 'react'
import BlogDetails from './BlogDetails'

const Blog = ({ blog, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      {visible && (
        <BlogDetails blog={blog} user={user} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default Blog
