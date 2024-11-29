import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'How to train your human',
    author: 'Mr. Cat',
    url: 'http://catblog.com/how-to-train-your-human',
    likes: 9
  }

  const { container } = render(<Blog blog={blog} />)

  const title = container.querySelector('.title')
  expect(title).toHaveTextContent('How to train your human')

  const author = container.querySelector('.author')
  expect(author).toHaveTextContent('Mr. Cat')
})
