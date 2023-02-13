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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHubspotResponseToDB = exports.isHubspotResponse = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isHubspotResponse = (service, response) => {
    return service === 'hubspot';
};
exports.isHubspotResponse = isHubspotResponse;
const saveHubspotResponseToDB = (name, response) => __awaiter(void 0, void 0, void 0, function* () {
    // Get or create the user
    const user = yield prisma.user.upsert({
        where: {
            name: name
        },
        update: {},
        create: {
            name: name
        },
    });
    // Delete existing contacts for user
    yield prisma.contact.deleteMany({
        where: {
            userId: user.id
        },
    });
    // Create new contacts for user
    response.results.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
        const { properties } = data;
        yield prisma.contact.create({
            data: {
                email: properties.email,
                userId: user.id,
                data: properties
            },
        });
    }));
});
exports.saveHubspotResponseToDB = saveHubspotResponseToDB;
