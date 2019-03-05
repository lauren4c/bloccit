const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach(done => {
    //#1
    this.topic;
    this.post;
    sequelize.sync({ force: true }).then(res => {
      //#2
      Topic.create({
        title: "Water: It doesn't have electrolites",
        description: "Discussions on how much water the body needs."
      })
        .then(topic => {
          this.topic = topic;
          //#3
          Post.create({
            title: "Is 128oz enough?",
            body: "I think I drink enough water, but my body always wants more",
            //#4
            topicId: this.topic.id
          }).then(post => {
            this.post = post;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("#create()", () => {
    it("should create a topic object with a title and body", done => {
      //#1
      Topic.create({
        title: "Who would win: dogs or cats?",
        description: "Discuss an age-old question."
        //topicId: this.topic.id
      })
        .then(topic => {
          //#2
          expect(topic.title).toBe("Who would win: dogs or cats?");
          expect(topic.description).toBe("Discuss an age-old question.");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a topic with missing title or body", done => {
      Topic.create({
        title: "Smart watches are neat."
      })
        .then(topic => {
          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();
        })
        .catch(err => {
          expect(err.message).toContain("Topic.description cannot be null");
          //expect(err.message).toContain("Topic.topicId cannot be null");
          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return the associated posts to the topic", done => {
      this.topic.getPosts().then(associatedPosts => {
        expect(associatedPosts[0].title).toBe("Is 128oz enough?");
        done();
      });
    });
  });
});
