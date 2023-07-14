const dummy = () => 1

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (most, blog) => {
        if (most === null || blog.likes > most.likes) {
            most = blog
        }
        return most
    }

    return blogs.reduce(reducer, null)
}

const mostBlogs = (blogs) => {
    const reducer = (counter, blog) => {
        const authorCount = counter.get(blog.author)
        counter.set(blog.author, authorCount ? authorCount + 1 : 1)
        return counter
    }
    const counter = blogs.reduce(reducer, new Map())

    const mostAuthor = [...counter.entries()].reduce((most, current) => {
        return current[1] > most[1] ? current : most
    })
    return {
        author: mostAuthor[0],
        blogs: mostAuthor[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}