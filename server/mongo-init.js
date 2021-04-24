// Creates DB koa [insert is necessary to create it]
// In main migration init collection is removed
db.createUser(
    {
        user: "koa",
        pwd: "secret",
        roles: [
            {
                role: "readWrite",
                db: "koa"
            }
        ]
    }
);
db.init.insert({"initial": "data"});
