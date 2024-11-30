import { useState } from 'react'
import BlogDetails from './BlogDetails'

const Blog = ({ blog, user, incrementLikes, removeBlog }) => {
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
    <div className="blog" style={blogStyle}>
      <span className="title">{blog.title}</span>{' '}
      <span className="author">{blog.author}</span>{' '}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      {visible && (
        <BlogDetails
          blog={blog}
          user={user}
          incrementLikes={incrementLikes}
          removeBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default Blog
