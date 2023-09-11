// dto - Data Transfer Object

module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id; // mongo adds _ by default  (be aware)
    this.isActivated = model.isActivated;
  }
};
