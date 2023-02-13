const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const search = async (query: string | undefined) => {
    let customers = []
    let contacts = []
    if (query && query.length >= 3) {
        customers = await prisma.customer.findMany({
            where: {
                email: {
                    startsWith: query
                }
            },
        })
        contacts = await prisma.contact.findMany({
            where: {
                email: {
                    startsWith: query
                }
            },
        })
    }
    return {
        customers: customers,
        contacts: contacts
    }
}