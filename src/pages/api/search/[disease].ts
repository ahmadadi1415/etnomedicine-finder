import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { disease } = req.query
    const data = await prisma?.medic.findMany({
        where:
        {
            disease: 'tes'
        }
    })
    res.json(data)
}
