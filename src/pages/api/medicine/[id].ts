import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // GET Medicine Recipe by id
    if (req.method === "GET") {
        const { id } = req.query

        const recipe = await prisma.medicRecipe.findUnique({
            where: {
                id: parseInt(id as string)
            },
            include: {
                ingredient: {
                    select: {
                        herb_id: true,
                        parts_used: true,
                        herbs: {
                            select: {
                                local_name: true,
                                image_url: true,
                            }
                        }
                    },
                    
                }
            }
        })

        if (!recipe) {
            return res.status(404).json({message: `Medicine with id ${id} doesnt exist`})
        }

        let recipeName
        if (recipe.disease !== null) {
            recipeName = `Obat ${recipe.disease.toLowerCase()}`
        }

        const formatted =  {
            id: recipe.id,
            name: recipeName,
            image: "https://res.cloudinary.com/dcgd4vnz5/image/upload/v1682174735/katherine-hanlon-9-Hgi9w9bDM-unsplash_fet7e1.jpg",
            description: "",
            usage_rules: recipe.how_to_make,
            ways_to_use: recipe.how_to_use,
            ingredients: recipe.ingredient.map(ingredient => {
                return {
                    id: ingredient.herb_id,
                    name: ingredient.herbs.local_name,
                    image: ingredient.herbs.image_url,
                    category: ingredient.parts_used
                }
            })
        }

        return res.status(200).json(formatted)
    }
}