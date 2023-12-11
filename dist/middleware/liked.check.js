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
exports.Liked = void 0;
const song_model_1 = __importDefault(require("../models/song.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const Liked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugSong = req.params.slugSong;
        const token = req.cookies.tokenUser;
        const user = yield user_model_1.default.findOne({
            token: token,
            deleted: false
        });
        if (user) {
            const song = yield song_model_1.default.findOne({
                slug: slugSong,
                deleted: false
            });
            let checked = false;
            if (song.like.includes(user.id)) {
                checked = true;
            }
            res.locals.checked = checked;
        }
        next();
    }
    catch (error) {
        res.redirect("/topics");
    }
});
exports.Liked = Liked;
