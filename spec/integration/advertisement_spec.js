const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/ads/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
  beforeEach(done => {
    this.advertisement;
    sequelize.sync({ force: true }).then(res => {
      Advertisement.create({
        title: "React.io",
        description: "Build your Front-end with React."
      })
        .then(advertisement => {
          this.advertisement = advertisement;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("GET /ads", () => {
    it("should return a status code 200 and all ads", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("React.io");
        expect(body).toContain("Build your Front-end with React.");
        done();
      });
    });
  });
  describe("GET /ads/new", () => {
    it("should render a new ad", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Ad");
        done();
      });
    });
  });
  describe("POST /ads/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Apple Music",
        description: "Listen to any song you want, whenever you want."
      }
    };

    it("should create a new ad and redirect", done => {
      request.post(
        options,

        (err, res, body) => {
          Advertisement.findOne({ where: { title: "Apple Music" } })
            .then(advertisement => {
              expect(res.statusCode).toBe(303);
              expect(advertisement.title).toBe("Apple Music");
              expect(advertisement.description).toBe(
                "Listen to any song you want, whenever you want."
              );
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        }
      );
    });
  });
  describe("GET /ads/:id", () => {
    it("should render a view with the selected ad", done => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("React.io");
        done();
      });
    });
  });
  describe("POST /ads/:id/destroy", () => {
    it("should delete the adc with the associated ID", done => {
      Advertisement.findAll().then(ads => {
        const adCountBeforeDelete = ads.length;

        expect(adCountBeforeDelete).toBe(1);

        request.post(
          `${base}${this.advertisement.id}/destroy`,
          (err, res, body) => {
            Advertisement.findAll().then(ads => {
              expect(err).toBeNull();
              expect(ads.length).toBe(adCountBeforeDelete - 1);
              done();
            });
          }
        );
      });
    });
  });
  describe("GET /ads/:id/edit", () => {
    it("should render a view with an edit Ad form", done => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Ad");
        expect(body).toContain("React.io");
        done();
      });
    });
  });
  describe("POST /ads/:id/update", () => {
    it("should update the ad with the given values", done => {
      const options = {
        url: `${base}${this.advertisement.id}/update`,
        form: {
          title: "React Framework",
          description: "It is awesome."
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Advertisement.findOne({
          where: { id: this.advertisement.id }
        }).then(advertisement => {
          expect(advertisement.title).toBe("React Framework");
          done();
        });
      });
    });
  });
});
