"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const search_route_1 = __importDefault(require("./src/routes/search.route"));
const sync_route_1 = __importDefault(require("./src/routes/sync.route"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3030;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.get('/', (req, res) => {
    res.json({ 'message': 'ok' });
});
app.use('/search', search_route_1.default);
app.use('/sync', sync_route_1.default);
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ 'message': err.message });
    return;
});
app.listen(port, () => {
    console.log(`Node Server is running at http://localhost:${port}`);
});
