import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBlog = await blogService.create({
      title,
      author,
      url
    })
    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
