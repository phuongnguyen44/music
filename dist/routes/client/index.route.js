"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const user_route_1 = require("./user.route");
const user_middleware_1 = require("../../middleware/user.middleware");
const favorite_song_route_1 = require("./favorite-song.route");
const search_route_1 = require("./search.route");
const clientRoutes = (app) => {
    app.use(`/topics`, user_middleware_1.infoUser, topic_route_1.topicRoutes);
    app.use(`/songs`, user_middleware_1.infoUser, song_route_1.songRoutes);
    app.use(`/users`, user_route_1.usersRoutes);
    app.use(`/favorite-songs`, favorite_song_route_1.favoriteSongRoutes);
    app.use(`/search`, search_route_1.searchRoutes);
};
exports.default = clientRoutes;
