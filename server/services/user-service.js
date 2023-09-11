const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const ApiError = require("../exceptions/api-error");
const UserDto = require("../dtos/user-dto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    // to check if the user already exist with provided email
    if (candidate) {
      throw ApiError.BadRequest(`User with this email ${email} already exist`);
    }
    // hashing user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // generating activation link
    const activationLink = uuid.v4();
    // creating new user
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });

    // saving refresh token in database
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  // account activation service

  async activate(activationLink) {
    // search user in db by activation link
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }
    // if user was found, setting activation link
    user.isActivated = true;
    await user.save();
  }

  // login service

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User with this email doesn't exist");
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      throw ApiError.BadRequest("Incorrect password");
    }
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  // logout

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  // refresh

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id); // to get info about user, in case some information was changed after 7 days (life of refresh token)
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  // get All Users

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
