db.createUser(
    {
        user: "token",
        pwd: "token",
        roles: [
            {
                role: "readWrite",
                db: "ilv-token"
            }
        ]
    }
)
