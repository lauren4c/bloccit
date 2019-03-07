const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;
    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Colorado is too crowded",
        description: "Go home. We are full."
      })
        .then(topic => {
          this.topic = topic;

          Post.create({
            title: "I got here as soon as I could",
            body: "I can't imagine living anywhere else",
            topicId: this.topic.id
          }).then(post => {
            this.post = post;

            Flair.create({
              name: "Hot Topic",
              color: "Red",
              postId: this.post.id
            }).then(flair => {
              this.flair = flair;
              done();
            });
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#create()", () => {
    it("should add a flair object to the post", done => {
      Flair.create({
        name: "Slow Mover",
        color: "Yellow",
        postId: this.post.id
      })
        .then(flair => {
          expect(flair.name).toBe("Slow Mover");
          expect(flair.color).toBe("Yellow");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a flair with missing name, color or assigned post", done => {
      Flair.create({
        color: "purple"
      })
        .then(flair => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Flair.name cannot be null");
          expect(err.message).toContain("Flair.postId cannot be null");
          done();
        });
    });
  });

  describe("#setPost()", () => {
    it("should associate a post and a flair together", done => {
      // #1
      Topic.create({
        title: "New Topic",
        description: "Best new topic ever."
      }).then(topic => {
        this.topic = topic;

        Post.create({
          title: "Best topic's first post!",
          body: "#1 FTW!",
          topicId: this.topic.id
        }).then(newFlair => {
          expect(this.flair.postId).toBe(this.post.id);
          this.flair.setPost(newFlair).then(flair => {
            expect(flair.postId).toBe(newFlair.id);
            done();
          });
        });
      });
    });
  });
  describe("#getPost()", () => {
    it("should return the associated post", done => {
      this.flair.getPost().then(associatedPost => {
        expect(associatedPost.title).toBe("I got here as soon as I could");
        done();
      });
    });
  });
});
