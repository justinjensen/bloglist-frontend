import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      let blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedInBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('login successful')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogappUser')
    setUser(null)
  }

  const incrementLikes = async (blog) => {
    let updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })
    updatedBlog = { ...updatedBlog, user: blog.user }
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    )
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        setSuccessMessage(`Blog ${blog.title} by ${blog.author} removed`)
      } catch (exception) {
        console.error('error removing blog')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
          errorMessage={errorMessage}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {successMessage && <div>{successMessage}</div>}
      {errorMessage && <div>{errorMessage}</div>}
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <div>
        <h2>create new</h2>
        <Togglable showButtonLabel="New blog" hideButtonLabel="cancel">
          <BlogForm blogs={blogs} user={user} />
        </Togglable>
      </div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          incrementLikes={incrementLikes}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default App
