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
exports.listen = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.findOne({
        slug: req.params.slugTopic,
        status: "active",
        deleted: false
    });
    const songs = yield song_model_1.default.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("avatar title slug singerId like");
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const token = req.cookies.tokenUser;
    const user = yield user_model_1.default.findOne({
        token: token,
        deleted: false
    });
    const song = yield song_model_1.default.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });
    const singer = yield singer_model_1.default.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId,
        deleted: false
    }).select("title");
    if (user) {
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            userId: user.id,
            songId: song.id
        });
        song["isFavoriteSong"] = favoriteSong ? true : false;
    }
    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const token = req.cookies.tokenUser;
    if (!token) {
        res.json({
            code: 400,
            message: "Khong co Token!"
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
        token: token,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Khong ton tai user!"
        });
        return;
    }
    const song = yield song_model_1.default.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    });
    if (song.like.includes(user.id)) {
        const newArr = song.like.filter(item => item != user.id);
        yield song_model_1.default.updateOne({
            _id: song.id
        }, {
            like: newArr
        });
    }
    else {
        const newArr = song.like;
        newArr.push(user.id);
        yield song_model_1.default.updateOne({
            _id: song.id
        }, {
            like: newArr
        });
    }
    const lastSong = yield song_model_1.default.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    });
    res.json({
        code: 200,
        message: "Thành công!",
        like: lastSong.like.length
    });
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const token = req.cookies.tokenUser;
    const user = yield user_model_1.default.findOne({
        token: token,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "De nghi dang ky de them vao bai hat yeu thich!"
        });
        return;
    }
    const existFavoriteSong = yield favorite_song_model_1.default.findOne({
        songId: idSong,
        userId: user.id
    });
    if (!existFavoriteSong) {
        const record = new favorite_song_model_1.default({
            userId: user.id,
            songId: idSong
        });
        yield record.save();
    }
    else {
        yield favorite_song_model_1.default.deleteOne({
            songId: idSong,
            userId: user.id
        });
    }
    res.json({
        code: 200,
        message: "Thành công!"
    });
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const song = yield song_model_1.default.findOne({
        _id: idSong
    });
    const listen = song.listen + 1;
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        listen: listen
    });
    const songNew = yield song_model_1.default.findOne({
        _id: idSong
    });
    res.json({
        code: 200,
        message: "Thành công!",
        listen: songNew.listen
    });
});
exports.listen = listen;
