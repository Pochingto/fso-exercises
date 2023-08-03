import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog', () => {
  const blog = {
    title: 'title 1',
    author: 'author1',
    url: 'url1',
    likes: 2
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('title 1')
  expect(element).toBeDefined()
})