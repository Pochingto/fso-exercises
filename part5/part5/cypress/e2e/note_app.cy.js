describe('Note app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      const user = {
        username: 'pochingto',
        password: 'mypassword123',
        name: 'Ricky Cheng'
      }
      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
    })

    it('login form can be opened', function() {
        cy.contains('login').click()
    })

    it('user can login', function() {
        cy.contains('login').click()
        cy.get('#username').type('pochingto')
        cy.get('#password').type('mypassword123')

        cy.get('#login-button').click()
        cy.contains('Ricky Cheng')
    })

    describe('when logged in', function() {
      beforeEach(function() {
        cy.contains('login').click()
        cy.get('#username').type('pochingto')
        cy.get('#password').type('mypassword123')

        cy.get('#login-button').click()
        cy.contains('Ricky Cheng')
      })
      it('a new note can be created', function() {
        const newNoteContent = 'a note can be created by cypress'
        cy.contains('create new note').click()
        cy.get('#newNoteInput').type(newNoteContent)
        cy.get('#saveNewNoteButton').click()
        cy.contains(newNoteContent)
      })

      describe('and when a note exist', function() {
        beforeEach(function() {
          const newNoteContent = 'another note cypress'
          cy.contains('create new note').click()
          cy.get('#newNoteInput').type(newNoteContent)
          cy.get('#saveNewNoteButton').click()
          cy.contains(newNoteContent)
        })

        it('it can be made not important', function () {
          cy.contains('another note cypress').contains('make not important').click()
          cy.contains('another note cypress').contains('make important')
        })
      })
    })
})