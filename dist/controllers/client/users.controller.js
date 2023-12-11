"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../helper/generate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/register", {
        pageTitle: "Register",
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        res.redirect("/topics");
    }
    else {
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.token = (0, generate_1.generateRandomString)(30);
        const user = new user_model_1.default(req.body);
        const data = yield user.save();
        const token = data.token;
        res.cookie("tokenUser", token);
        res.redirect("/topics");
    }
});
exports.registerPost = registerPost;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/login", {
        pageTitle: "Login",
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        res.redirect("/topics");
        return;
    }
    if ((0, md5_1.default)(password) !== user.password) {
        res.redirect("/topics");
        return;
    }
    const token = user.token;
    res.cookie("tokenUser", token);
    res.redirect("/topics");
});
exports.loginPost = loginPost;
