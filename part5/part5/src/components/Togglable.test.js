import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
    let container

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel='show...'>
                <div className="testDiv">
                    togglable content
                </div>
            </Togglable>
        ).container
    })

    test('renders its children', async () => {
        await screen.findAllByText('togglable content')
        // container.querySelector('.testDiv')
    })

    test('at start the children are not displayed', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async () => {
        const button = screen.getByText('show...')
        const user = userEvent.setup()
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', async () => {
        const button = screen.getByText('show...')
        const user = userEvent.setup()
        await user.click(button)

        const cancelButton = screen.getByText('cancel')
        await user.click(cancelButton)

        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})