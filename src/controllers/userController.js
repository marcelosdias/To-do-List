const db = require('../database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 8600
    })
}

module.exports = {
    async register(req, res) {
        const {
            name,
            email,
            password
        } = req.body

        if (!password || password.lenght < 3) {
            return res.status(400).json({ error: true, error_message: 'Invalid Password' })
        }

        await db.select('*').from('users')
        .where({ email })
        .then(result => {
            if (result.length > 0) {
                return res.status(400).json({ error: true, error_message: 'Email already exists' })
            }
            
            bcrypt.hash(password, 10, async (error, hash) => {
                if (!error) {
                    await db.insert({
                        name,
                        email: email.toLowerCase(),
                        password: hash,
                        theme: 'light'
                    })
                    .into('users')
                    .returning(['id', 'name', 'email', 'theme'])
                    .then(user => {
                        return res.json({ error: false, ...user[0], ...{ token: generateToken({ id: user[0].id }) } })
                    })
                    .catch(() => {
                        return res.status(400).json({ error: true , error_message: 'Create user error' })
                    })
                } else {
                    return res.status(400).json({ error: true, error_message: 'Create hash error' }) 
                }
            })
        })
        .catch(() => {
            return res.status(400).json({ error: true , error_message: 'Query error' })
        })
    },

    async login(req, res) {
        const { email, password } = req.body

        await db.select('*').from('users')
        .where({ email })
        .then(user => {
            if (user.length === 0) {
                return res.status(400).json({ error: true, error_message: 'Email does not exist' })
            }

            bcrypt.compare(password, user[0].password, (error, status) => {
                if (status) {
                    user[0].password = undefined
                        return res.json({ error: false, ...user[0], ...{ token: generateToken({ id: user[0].id }) } })
                } else {
                    return res.status(400).json({ error: true, error_message: 'Invalid password' })
                }
            })
        })
        .catch(() => {
            return res.status(400).json({ error: true , error_message: 'Query error' })
        })
    },

    async update(req, res) {
        const { userId } = req.params

        const {
            name,
            email,
            password
        } = req.body

        if (!password || password.lenght < 3) {
            return res.status(400).json({ error: true, error_message: 'Invalid Password' })
        }

        await db.select('*').from('users')
        .where({ email })
        .then(async user => {
            if (user.length > 0 && user[0].id !== userId) {
                return res.status(400).json({ error: true, error_message: 'Email already exists' })
            }

            bcrypt.hash(password, 10, async (error, hash) => {
                if (!error) {
                    await db.from('users')
                    .where({ id: userId })
                    .update({
                        name,
                        email: email.toLowerCase(),
                        password: hash
                     })
                    .then(updated => {
                        if (updated.length === 0) {
                            return res.json({ error: true, error_message: 'User not found'})
                        }

                        return res.json({ error: false, message: 'User updated'})
                    })
                    .catch(() => {
                        return res.status(400).json({ error: true , error_message: 'User update error' })
                    })
                } else {
                    return res.status(400).json({ error: true, error_message: 'Generate hash error' })
                }
            })
        })
        .catch(() => {
            return res.status(400).json({ error: true , error_message: 'Query error' })
        })
    },

    async delete(req, res) {
        const { userId } = req.params

        await db.from('users')
        .where({ id: userId })
        .del()
        .then(deleted => {
            if (deleted.length === 0) {
                return res.status(400).json({ error: true, error_message: 'User not found' })
            }
            
            return res.json({ error: false, message: 'User deleted' })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Delete user error' })
        })
    },
    async getAll(req, res) {
        await db.select('*').from('users')
        .then(users => {
            return res.json(users)
        })
        .catch(() => {
            return res.status(400).json({ error: true , error_message: 'Query error' })
        })
    },

    async updateTheme(req, res) {
        const { userId } = req.params
        const { theme } = req.body

        await db('users')
        .where({ id: userId })
        .update({ theme })
        .then(updated => {
            if (updated.length === 0) {
                return res.json({ error: true, error_message: 'User not found'})
            }

            return res.json({ error: false, message: 'Theme updated'})
        })
        .catch(() => {
            return res.json({ error_message: 'Update Theme error' })
        })
    }
}