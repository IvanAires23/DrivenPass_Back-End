import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function getDefaultUser() {
    return await prisma.user.findFirst({
        where: {
            email: "exemple@exemple.com"
        }
    })
}

async function createDefaultUser() {
    console.log("Creating default user")
    const user = await prisma.user.create({
        data: {
            email: "exemple@exemple.com",
            password: "Str0ngP@ssw0rd"
        }
    })
    return user
}

async function checkOrCreateDefaultUser() {
    const user = await getDefaultUser()
    if (!user) await createDefaultUser()
    else console.log("Default user already created")

    return user
}

async function main() {
    return checkOrCreateDefaultUser()
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1);
})