module.exports = (models) => {
    const { User, Snippet } = models;
  
    // Define associations
    User.hasMany(Snippet, { foreignKey: "userId", as: "snippets" });
    Snippet.belongsTo(User, { foreignKey: "userId", as: "user" });
  };
  