import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const herbs = await prisma.medic.findMany()
    console.log(res)
    res.status(200).json(herbs)
}