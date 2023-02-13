const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


export const isStripeResponse = (service: Services, response: unknown): response is StripeResponseType => {
    return service === 'stripe'
}

export const saveStripeResponseToDB = async (name: string, response: StripeResponseType) => {
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

    // Delete existing customers for user
    await prisma.customer.deleteMany({
        where: {
            userId: user.id
        },
    })

    // Create new customers for user
    response.data.forEach(async data => {
        const { email } = data
        await prisma.customer.create({
            data: {
                email: email,
                userId: user.id,
                data: data
            },
        })
    });
}