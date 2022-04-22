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
const tap_1 = require("tap");
const app_1 = __importDefault(require("../../src/app"));
(0, tap_1.test)('GET "/api/v1/auth"', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'GET',
        url: '/api/v1/auth',
    });
    t.equal(response.statusCode, 404, 'returns a status code of 404');
}));
(0, tap_1.test)('POST "/api/v1/auth/register" with bad payload', (t) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
    });
    t.equal(response.statusCode, 400, 'returns a status code of 400');
    response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
            email: 'sid@example.com',
            password: 'test1234',
            passwordConfirmation: 'test123',
        },
    });
    t.equal(response.statusCode, 400, 'returns a status code of 400');
}));
(0, tap_1.test)('POST "/api/v1/auth/register" with ok payload', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
            email: 'johndoe@example.com',
            password: 'test1234',
            passwordConfirmation: 'test1234',
        },
    });
    t.equal(response.statusCode, 201, 'returns a status code of 201');
    const { user: { email }, token, } = JSON.parse(response.body);
    t.equal(email, 'johndoe@example.com', 'got email');
    t.ok(token, 'got token');
}));
(0, tap_1.test)('POST "/api/v1/auth/login" with incorrect password', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
            email: 'johndoe@example.com',
            password: 'test',
        },
    });
    t.equal(response.statusCode, 400, 'returns a status code of 400');
}));
(0, tap_1.test)('POST "/api/v1/auth/login" with incorrect email', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
            email: 'johnd@example.com',
            password: 'test1234',
        },
    });
    t.equal(response.statusCode, 400, 'returns a status code of 400');
}));
(0, tap_1.test)('POST "/api/v1/auth/login" with ok payload', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
            email: 'johndoe@example.com',
            password: 'test1234',
        },
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    const { user: { email }, token, } = JSON.parse(response.body);
    t.equal(email, 'johndoe@example.com', 'got email');
    t.ok(token, 'got token');
}));
