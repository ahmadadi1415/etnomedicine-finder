import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    // GET all the medicine herbs 
    if (req.method === "GET") {
        const herbs = await prisma.herbs.findMany({
            select: {
                id: true,
                image_url: true,
                local_name: true,
                ingredient: true
            }
        })

        const formatted = herbs.map(herb => {
            return {
                id: herb.id,
                name: herb.local_name,
                image: herb.image_url,
                category: (!herb.ingredient[0]) ? "" : herb.ingredient[0].parts_used
            }
        })

        return res.status(200).json(formatted)
    }
}