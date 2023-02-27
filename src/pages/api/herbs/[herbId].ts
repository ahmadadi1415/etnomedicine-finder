import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { herbId } = req.query

    const herb = await prisma.medic.findUnique({
        where: {
            id: Number(herbId)
        }
    });
    res.status(200).json(herb)
}