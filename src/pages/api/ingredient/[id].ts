import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Get medicine herbs by id
    if (req.method === "GET") {
        const { id } = req.query

        const herb = await prisma.herbs.findUnique({
            where: {
                id: parseInt(id as string)
            },
            select: {
                id: true,
                image_url: true,
                local_name: true,
                ingredient: {
                    select: {
                        parts_used: true
                    }
                }
            }
        })

        if (!herb) {
            return res.status(404).json({message: `Ingredient with id ${id} doesn't exist`})
        }

        const formatted = {
            id: herb.id,
            name: herb.local_name,
            image: herb.image_url,
            category: (!herb.ingredient[0]) ? "" : herb.ingredient[0].parts_used
        }

        return res.status(200).json(formatted)
    }
}