const ApplicationPolicy = require("./application");

module.exports = class CommentPolicy extends ApplicationPolicy {
  create() {
    return !!this.user;
  }

  destroy() {
    return !!this.user && this.record && (this._isOwner() || this._isAdmin());
  }
};
