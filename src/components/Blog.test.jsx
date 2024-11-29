import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('renders blog details when button is clicked', async () => {
  const mockUser = {
    username: 'testuser',
    name: 'Test User'
  }
  const blog = {
    title: 'How to train your human',
    author: 'Mr. Cat',
    url: 'http://catblog.com/how-to-train-your-human',
    likes: 9,
    user: mockUser
  }
  const { container } = render(<Blog blog={blog} user={mockUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const url = container.querySelector('.url')
  expect(url).toHaveTextContent('http://catblog.com/how-to-train-your-human')
})
