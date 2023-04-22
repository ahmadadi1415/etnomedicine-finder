import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const herb_id = req.query.herb_id

    console.log(req.query)

    if (req.method === "GET") {

        if (herb_id) {

            const response = await prisma.medicRecipe.findMany({
                where: {
                    ingredient: {
                        every: {
                            herb_id: parseInt(herb_id as string)
                        }
                    }
                },
                include: {
                    ingredient: true
                }
            })

            // console.log(response)
            return res.status(200).json(response)
        }
    }
}