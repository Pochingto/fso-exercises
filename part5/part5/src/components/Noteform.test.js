import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from './Noteform'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
    const mockHandler = jest.fn()
    render(<NoteForm createNote={mockHandler}/>)

    const input = screen.getByPlaceholderText('write note content here')
    const user = userEvent.setup()
    const button = screen.getByText('save')

    await user.type(input, 'new notes content...')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].content).toBe('new notes content...')
})