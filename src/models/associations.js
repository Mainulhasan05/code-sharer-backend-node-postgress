const User = require("./User");
const Snippet = require("./Snippet");
const Subscription = require("./Subscription");

// Associations
User.hasMany(Snippet, { foreignKey: "userId", as: "snippets" });
Snippet.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { User, Snippet, Subscription };
