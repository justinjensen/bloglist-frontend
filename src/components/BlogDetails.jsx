const BlogDetails = ({ blog }) => {
  return (
    <div>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes <button>like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  )
}

export default BlogDetails
