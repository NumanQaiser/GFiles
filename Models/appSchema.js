
const mongo = require("mongoose");
const s = mongo.Schema;
const model = s({
    //either by email or phone number
    link: {
        type: String
    },

    User_id: {
        type: mongo.Types.ObjectId
    },

}, {
    timestamps: true
});

const Link = mongo.model("links", model);

const modelSchema = s({
    //either by email or phone number
    Name: {
        type: String
    },

    Password: {
        type: String
    },

}, {
    timestamps: true
});

const User = mongo.model("user", modelSchema);

module.exports = {
    Link,
    User
}