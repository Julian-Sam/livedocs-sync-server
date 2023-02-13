const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


export const isHubspotResponse = (service: Services, response: unknown): response is HubspotResponseType => {
    return service === 'hubspot'
}

export const saveHubspotResponseToDB = async (name: string, response: HubspotResponseType) => {
    // Get or create the user
    const user = await prisma.user.upsert({
        where: {
            name: name
        },
        update: {},
        create: {
            name: name
        },
    })

    // Delete existing contacts for user
    await prisma.contact.deleteMany({
        where: {
            userId: user.id
        },
    })

    // Create new contacts for user
    response.results.forEach(async data => {
        const { properties } = data
        await prisma.contact.create({
            data: {
                email: properties.email,
                userId: user.id,
                data: properties
            },
        })
    });
}