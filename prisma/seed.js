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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const tedis_1 = require("tedis");
const prisma = new client_1.PrismaClient();
const redis = new tedis_1.Tedis({
    host: '127.0.0.1',
    port: process.env.REDIS_PORT,
});
function createUser(email, password, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordHash = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
        const user = yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.create({
                data: {
                    email,
                    password: passwordHash,
                    username,
                },
            });
            yield prisma.collection.create({
                data: {
                    name: 'general',
                    user_id: user.id,
                },
            });
            yield prisma.collection.create({
                data: {
                    name: 'profile-page',
                    user_id: user.id,
                },
            });
            return user;
        }));
        return user;
    });
}
function clearDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield redis.command('FLUSHALL');
        yield prisma.analytics.deleteMany({});
        yield prisma.link.deleteMany({});
        yield prisma.collection.deleteMany({});
        yield prisma.user.deleteMany({});
    });
}
function createCollection(name, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = yield prisma.collection.create({
            data: {
                name: name,
                user_id: user_id,
            },
        });
        return collection;
    });
}
function createLink(url, collection_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const short_url = (0, nanoid_1.nanoid)(10);
        yield redis.set(short_url, url);
        const link = yield prisma.link.create({
            data: {
                url: url,
                collection_id: collection_id,
                user_id: user_id,
                short_url,
            },
        });
        return link;
    });
}
function createAnalytics(referer, path, ip, browser, browserLang, os, osVer, device, deviceModel, deviceType, countryCode, countryName, linkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const analytics = yield prisma.analytics.create({
            data: {
                referer: referer,
                path: path,
                ip: ip,
                browser: browser,
                browserLang: browserLang,
                os: os,
                osVer: osVer,
                device: device,
                deviceModel: deviceModel,
                deviceType: deviceType,
                countryCode: countryCode,
                countryName: countryName,
                link_id: linkId,
            },
        });
        return analytics;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield clearDB();
        const user = yield createUser('user@test.com', '123456', 'randomname');
        const collection = yield createCollection('instagram', user.id);
        const link = yield createLink('www.instagram.com', collection.id, user.id);
        const analytics = yield createAnalytics('direct', '', '142.250.192.142', 'Edge', 'en-US', 'Windows', '10', '', '', 'desktop', 'USA', 'United States', link.id);
        const analytics1 = yield createAnalytics('direct', '', '142.250.125.111', 'Firefox', 'en-US', 'Windows', '10', '', '', 'mobile', 'IND', 'India', link.id);
        redis.close();
    });
}
main();
