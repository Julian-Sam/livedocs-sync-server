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
exports.saveStripeResponseToDB = exports.isStripeResponse = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isStripeResponse = (service, response) => {
    return service === 'stripe';
};
exports.isStripeResponse = isStripeResponse;
const saveStripeResponseToDB = (name, response) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Delete existing customers for user
    yield prisma.customer.deleteMany({
        where: {
            userId: user.id
        },
    });
    // Create new customers for user
    response.data.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = data;
        yield prisma.customer.create({
            data: {
                email: email,
                userId: user.id,
                data: data
            },
        });
    }));
});
exports.saveStripeResponseToDB = saveStripeResponseToDB;
