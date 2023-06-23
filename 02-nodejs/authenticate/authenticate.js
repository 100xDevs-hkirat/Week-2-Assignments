let authDb = []

module.exports = {
    signup: async (req, res) => {
        let { email = null, password = null, firstName = null, lastName = null } = req.body
        if (email) {
            for (let entry of authDb) {
                if (entry.email === email) {
                    return res.status(400).send("email already present")
                }
            }
            authDb.push({ email, password, firstName, lastName, id: Date.now() })
            return res.status(201).send("Signup successful")
        }
        return res.status(400).send("email already present")
    },
    login: async (req, res) => {
        let { email = null, password = null } = req.body
        if (email && password) {
            for (let entry of authDb) {
                if (email === entry.email && password === entry.password) {
                    return res.status(200).json({
                        email,
                        firstName: entry.firstName,
                        lastName: entry.lastName
                    })
                }
            }
            return res.status(400).send("user not found")
        }
        return res.status(400).send("email and password is required")
    },
    data: async (req, res) => {
        let users = authDb.map(m => {
            const { password, ...rest } = m
            return rest
        })
        return res.status(200).json({ users })
    },
    authCheck: async (req, res, next) => {
        let { email = null, password = null } = req.headers
        if (email && password) {
            for (let entry of authDb) {
                if (email === entry.email && password === entry.password) {
                    next()
                    return
                }
            }
        }
        return res.status(401).send("Unauthorized")
    }
}