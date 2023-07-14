const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const moreBlogs = [
    {
        title: 'blog1',
        author: 'author1',
        url: 'url1',
        likes: 1000
    },
    {
        title: 'blog2',
        author: 'author2',
        url: 'url2',
        likes: 2002
    },
    {
        title: 'blog3',
        author: 'author3',
        url: 'url3',
        likes: 3030
    },
    {
        title: 'blog4',
        author: 'author4',
        url: 'url4',
        likes: 4400
    }
]

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('when list has only one blog equal to the likes of that', () => {
        const blogs = [
            {
                title: 'blog1',
                author: 'author1',
                url: 'url1',
                likes: 1000
            }
        ]
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(1000)
    })

    test('of a bigger blog list', () => {
        const result = listHelper.totalLikes(moreBlogs)
        expect(result).toBe(10432)
    })
})

describe('favoriteBlog', () => {
    test('of a bigger blog list', () => {
        const result = listHelper.favoriteBlog(moreBlogs)
        expect(result).toEqual({
            title: 'blog4',
            author: 'author4',
            url: 'url4',
            likes: 4400
        })
    })
})

const moreAuthorsBlogs = [
    {
        title: 'blog1',
        author: 'author1',
        url: 'url1',
        likes: 1000
    },
    {
        title: 'blog2',
        author: 'author1',
        url: 'url2',
        likes: 2002
    },
    {
        title: 'blog3',
        author: 'author1',
        url: 'url3',
        likes: 3030
    },
    {
        title: 'blog4',
        author: 'author2',
        url: 'url4',
        likes: 14400
    }
]

describe('Author with the most blogs', () => {
    test('of a bigger blog list', () => {
        const result = listHelper.mostBlogs(moreAuthorsBlogs)
        expect(result).toEqual({
            author: 'author1',
            blogs: 3
        })
    })
})