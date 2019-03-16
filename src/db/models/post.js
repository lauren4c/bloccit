"use strict";
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },

      //#2
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Post.associate = function(models) {
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };

  Post.prototype.getPoints = function() {
    if (this.votes.length === 0) return 0;

    return this.votes
      .map(v => {
        return v.value;
      })
      .reduce((prev, next) => {
        return prev + next;
      });
  };

  Post.prototype.hasUpvoteFor = function(thisUserId) {
    let hasVote = false;
    this.votes.forEach(vote => {
      if (vote.userId === thisUserId && vote.value === 1) {
        hasVote = true;
      }
    });
    return hasVote;
  };
  Post.prototype.hasDownvoteFor = function(thisUserId) {
    let hasVote = false;
    this.votes.forEach(vote => {
      if (vote.userId === thisUserId && vote.value === -1) {
        hasVote = true;
      }
    });
    return hasVote;
  };
  return Post;
};
