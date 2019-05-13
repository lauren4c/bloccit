"use strict";
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {}
  );
  Topic.associate = function(models) {
    Topic.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners"
    });
    Topic.hasMany(models.Post, {
      foreignKey: "topicId",
      as: "posts"
    });
  };
  return Topic;
};
