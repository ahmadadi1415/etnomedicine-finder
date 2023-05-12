import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // GET all Medicine Recipe
    if (req.method === "GET") {
        const response = await prisma.medicRecipe.findMany({
            include: {
                ingredient: {
                    select: {
                        parts_used: true,
                        herb_id: true,
                        herbs: {
                            select: {
                                local_name: true,
                                image_url: true
                            }
                        }
                    }
                }
            }
        })

        const formatted = response.map((recipe) => {
            let recipeName
            if (recipe.disease !== null) {
                recipeName = `Obat ${recipe.disease.toLowerCase()}`
            }

            return {
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
        })

        return res.status(200).json(formatted)
    }
}