const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Winter Wonderland",
        description: "How Much snow did you get?"
      }).then(topic => {
        this.topic = topic;

        Post.create({
          title: "Summit County, Colorado",
          body: "Totally dumping, brah.",
          topicId: this.topic.id
        }).then(post => {
          this.post = post;

          Flair.create({
            name: "Snow",
            color: "blue",
            postId: this.post.id
          })
            .then(flair => {
              this.flair = flair;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
  });

  describe("GET /flairs/new", () => {
    it("should render a new flair form", done => {
      request.get(
        `${base}/posts/${this.post.id}/flairs/new`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Flair");
          done();
        }
      );
    });
  });
  describe("POST /posts/:postId/flairs/create", () => {
    it("should create a new Flair and redirect", done => {
      const options = {
        url: `${base}/posts/${this.post.id}/flairs/create`,
        form: {
          name: "Warning",
          color: "orange"
        }
      };
      request.post(options, (err, res, body) => {
        Flair.findOne({ where: { name: "Warning" } })
          .then(flair => {
            expect(flair).not.toBeNull();
            expect(flair.name).toBe("Warning");
            expect(flair.color).toBe("orange");
            expect(flair.postId).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });
  describe("POST /posts/:id/flairs/:id/destroy", () => {
    it("should delete the flair with the associated ID", done => {
      expect(this.flair.id).toBe(1);

      request.post(
        `${base}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`,
        (err, res, body) => {
          Flair.findByPk(1).then(flair => {
            expect(err).toBeNull();
            expect(flair).toBeNull();
            done();
          });
        }
      );
    });
  });
  describe("GET /posts/:id/flairs/:id/edit", () => {
    it("should render a view with an edit post form", done => {
      request.get(
        `${base}/posts/${this.post.id}/flairs/${this.flair.id}/edit`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Flair");
          expect(body).toContain("blue");
          done();
        }
      );
    });
  });
  describe("POST /posts/:id/flairs/:id/update", () => {
    it("should return a status code 302", done => {
      request.post(
        {
          url: `${base}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
          form: {
            name: "Wild",
            color: "aqua"
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        }
      );
    });

    it("should update the flair with the given values", done => {
      const options = {
        url: `${base}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
        form: {
          name: "Wild"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Flair.findOne({
          where: { id: this.flair.id }
        }).then(flair => {
          expect(flair.name).toBe("Wild");
          done();
        });
      });
    });
  });
});
