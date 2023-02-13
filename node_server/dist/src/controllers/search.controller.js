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
exports.search = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const search = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let customers = [];
    let contacts = [];
    if (query && query.length >= 3) {
        customers = yield prisma.customer.findMany({
            where: {
                email: {
                    startsWith: query
                }
            },
        });
        contacts = yield prisma.contact.findMany({
            where: {
                email: {
                    startsWith: query
                }
            },
        });
    }
    return {
        customers: customers,
        contacts: contacts
    };
});
exports.search = search;
