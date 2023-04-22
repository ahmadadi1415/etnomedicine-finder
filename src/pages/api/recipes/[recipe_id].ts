import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {recipe_id} = req.query
    // console.log(recipe_id)

    if (req.method === "GET") {
        const response = await prisma.medicRecipe.findUnique({
            where: {
                id: parseInt(recipe_id as string)
            },
            select: {
                id: true,
                how_to_make: true,
                how_to_use: true,
                ingredient: {
                    select: {
                        parts_used: true,
                        quantity: true
                    }
                }
            }
        })

        // const data = response?.ingredient.flatMap(ing => {
        //     const flatten = {
        //         id: response.id,
        //         how_to_make: response.how_to_make,
        //         how_to_use: response.how_to_use,
        //         parts_used: ing.parts_used,
        //         quantity: ing.quantity    
        //     }
        //     return flatten
        // })

        console.log(response)

        // console.log(data)
        res.status(200).json(response)
    }
}