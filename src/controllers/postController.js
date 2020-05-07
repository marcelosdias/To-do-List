const db = require('../database')

module.exports = {
    async index(req, res) {
        const { userId } = req.params

        await db.from('posts')
        .where({ userId })
        .join('users', 'users.id', '=', 'posts.userId')
        .select('posts.*')
        .then(posts => {
            if (posts.length === 0) {
                return res.status(400).json({ error: true, error_message: 'To-do-List not found' })
            }

            return res.json({ error: false, posts })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Query error' })
        })
    },

    async create(req, res) {
        const { userId } = req.params
        const { title, status } = req.body
       
        await db.insert({ 
            title,
            status,
            userId  
        })
        .into('posts')
        .returning('*')
        .then(posts => {
            return res.json({ error: false, ...posts[0] })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Create To-do error' })
        })
    },

    async update(req, res) {
        const { title, status } = req.body
        const { id, userId } = req.params

        await db.from('posts')
        .where({ id, userId })
        .update({ title, status })
        .then(updated => {
            if (updated === 0) {
                return res.status(400).json({ error: true, error_message: 'Update To-do error' })
            }

            return res.json({ error: false, message: 'To-do Updated' })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Querry error' })
        })
    },

    async delete(req, res) {
        const { id, userId } = req.params

        db.from('posts')
        .where({ id, userId })
        .del()
        .then(deleted => {
            if (deleted === 0) {
                return res.status(400).json({ error: true, error_message: 'Delete To-do error' })
            }

            return res.json({ error: false, error_message: 'To-do Deleted' })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Query error' })
        })
    },

    async showAll(req, res) {
        await db.select('*').from('posts')
        .then(posts => {
            return res.json(posts)
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Query error' })
        })
    }
}