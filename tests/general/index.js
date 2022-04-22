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
(0, tap_1.test)('requests the "/" route', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'GET',
        url: '/',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
}));
(0, tap_1.test)('requests the "/ping" route', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield app_1.default.inject({
        method: 'GET',
        url: '/ping',
    });
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    t.equal(response.body, 'pong', 'returns "pong"');
}));
