const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      // #2
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user; //store the user

        // #3
        Topic.create(
          {
            title: "Expeditions to Alpha Centauri",
            description:
              "A compilation of reports from recent visits to the star system.",

            // #4
            posts: [
              {
                title: "My first visit to Proxima Centauri b",
                body: "I saw some rocks.",
                userId: this.user.id
              }
            ]
          },
          {
            // #5
            include: {
              model: Post,
              as: "posts"
            }
          }
        ).then(topic => {
          this.topic = topic; //store the topic
          this.post = topic.posts[0]; //store the post
          done();
        });
      });
    });
  });
  describe("#create()", () => {
    it("should create a topic object with a title and description,", done => {
      //#1
      Topic.create({
        title: "Pros of Cryosleep during the long journey",
        description: "List of advantages of Cryosleep"
      })
        .then(topic => {
          //#2
          expect(topic.title).toBe("Pros of Cryosleep during the long journey");
          expect(topic.description).toBe("List of advantages of Cryosleep");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create a topic with missing title, or description", done => {
      Topic.create({
        title: "Pros of Cryosleep during the long journey"
      })
        .then(topic => {
          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();
        })
        .catch(err => {
          expect(err.message).toContain("Topic.description cannot be null");

          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return all the posts associated with this topic", done => {
      this.topic.getPosts().then(associatedPosts => {
        expect(associatedPosts[0].title).toBe(
          "My first visit to Proxima Centauri b"
        );
        done();
      });
    });
  });
});
