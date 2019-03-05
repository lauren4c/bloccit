const Advertisement = require("./models").Advertisement;

module.exports = {
  getAllAds(callback) {
    return Advertisement.findAll()
      .then(advertisements => {
        callback(null, advertisements);
      })
      .catch(err => {
        callback(err);
      });
  },
  addAd(newAd, callback) {
    return Advertisement.create({
      title: newAd.title,
      description: newAd.description
    })
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
        console.log("Problem in queries.ads.");
      });
  },

  getAd(id, callback) {
    return Advertisement.findByPk(id)
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
      });
  },
  deleteAd(id, callback) {
    return Advertisement.destroy({
      where: { id }
    })
      .then(advertisement => {
        callback(null, advertisement);
      })
      .catch(err => {
        callback(err);
      });
  },
  updateAd(id, updatedAd, callback) {
    return Advertisement.findByPk(id).then(advertisement => {
      if (!advertisement) {
        return callback("Ad not found");
      }
      advertisement
        .update(updatedAd, {
          fields: Object.keys(updatedAd)
        })
        .then(() => {
          callback(null, advertisement);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
