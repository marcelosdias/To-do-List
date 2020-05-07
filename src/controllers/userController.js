const db = require('../database')
const bcrypt = require('bcrypt')
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
                    await db('users').insert({
                        name,
                        email: email.toLowerCase(),
                        password: hash
                    })
                    .returning(['id', 'name', 'email'])
                    .then(user => {
                        return res.json({ error: false, ...user[0], token: generateToken({ id: user.id }) })
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
                        return res.json({ error: false, ...user[0], token: generateToken({ id: user.id }) })
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
        const { id } = req.params

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
            if (user.length > 0) {
                return res.status(400).json({ error: true, error_message: 'Email already exists' })
            }

            bcrypt.hash(password, 10, async (error, hash) => {
                if (!error) {
                    await db.from('users')
                    .where({ id })
                    .update({
                        name,
                        email: email.toLowerCase(),
                        password: hash
                     })
                    .then(updated => {
                        if (updated === 0) {
                            return res.json({ error: true, error_message: 'User not found'})
                        }

                        return res.json({ error: false, message: 'User updated'})
                    })
                    .catch(() => {
                        return res.status(400).json({ error: true , error_message: '' })
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
        const { id } = req.params

        await db.from('users')
        .where({ id })
        .del()
        .then(deleted => {
            if (deleted === 0) {
                return res.status(400).json({ error: true, error_message: 'User not found' })
            }
            
            return res.json({ error: false, message: 'User deleted' })
        })
        .catch(() => {
            return res.status(400).json({ error: true, error_message: 'Delete user error' })
        })
    }
}