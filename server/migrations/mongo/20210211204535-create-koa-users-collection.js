// See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
module.exports = {
    async up(db) {
        // Remove collection that was created initially for testing in 'mongo-init.js'
        await db.collection('init').drop();
        // Create new collection
        await db.createCollection("users", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["username", "password"],
                    properties: {
                        username: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        status: {
                            enum: ["active", "blocked"],
                            description: "can only be one of the enum values"
                        }
                    }
                }
            }
        });
        await db.collection('users').insertOne({
            "username": "koa",
            "password": "koa-pass",
            "status": "active"
        });
        await db.collection('users').insertOne({
            "username": "nimda",
            "password": "nimda-123",
            "status": "blocked"
        });
    },

    async down(db) {
        await db.collection('users').drop();
    }
};
