const { test, expect, beforeEach, describe } = require('@playwright/test')
const { before, afterEach } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('h2')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User',
          username: 'testuser',
          password: 'testpassword'
        }
      })

      await page.goto('http://localhost:5173')
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByTestId('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByTestId('error')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User',
          username: 'testuser',
          password: 'testpassword'
        }
      })
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User 2',
          username: 'testuser2',
          password: 'testpassword2'
        }
      })

      await page.goto('http://localhost:5173')
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('input#title').fill('Test Blog')
      await page.locator('input#author').fill('Test Author')
      await page.locator('input#url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('a new blog Test Blog by Test Author added')
      ).toBeVisible()
      await expect(page.locator('span.title')).toContainText('Test Blog')
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('input#title').fill('Test Blog')
      await page.locator('input#author').fill('Test Author')
      await page.locator('input#url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByText('0 likes')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('input#title').fill('Test Blog')
      await page.locator('input#author').fill('Test Author')
      await page.locator('input#url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'show' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(
        page.getByText('Blog Test Blog by Test Author removed')
      ).toBeVisible()
      await expect(page.locator('span.title')).not.toBeVisible()
    })

    test('a blog can only be deleted by the user who created it', async ({
      page
    }) => {
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('input#title').fill('Test Blog')
      await page.locator('input#author').fill('Test Author')
      await page.locator('input#url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByTestId('username').fill('testuser2')
      await page.getByTestId('password').fill('testpassword2')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'show' }).click()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('input#title').fill('First Blog')
      await page.locator('input#author').fill('First Author')
      await page.locator('input#url').fill('http://first.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'Show' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await page.waitForTimeout(500)

      await page.locator('input#title').fill('Second Blog')
      await page.locator('input#author').fill('Second Author')
      await page.locator('input#url').fill('http://second.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'Show' }).click()

      const secondBlog = page.locator('.blog', { hasText: 'Second Blog' })
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      await page.locator('input#title').fill('Third Blog')
      await page.locator('input#author').fill('Third Author')
      await page.locator('input#url').fill('http://third.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'Show' }).click()

      const thirdBlog = page.locator('.blog', { hasText: 'Third Blog' })
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      const blogs = await page.locator('.blog').all()
      const likes = await Promise.all(
        blogs.map(async (blog) => {
          const likesText = await blog.locator('.likes').textContent()
          return parseInt(likesText.replace(/[^0-9]/g, ''), 10)
        })
      )

      expect(likes).toEqual([3, 2, 1])
    })
  })
})
