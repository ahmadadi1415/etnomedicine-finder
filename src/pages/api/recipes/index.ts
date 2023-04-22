import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

interface MedicIngredient {
    herb_id: number,
    local_name?: string,
    parts_used: string,
    quantity: string,
}

interface Recipe {
    ingredients: MedicIngredient[]
    disease: string
    how_to_make: string
    how_to_use: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === "POST") {
        const {disease, how_to_make, how_to_use, ingredients} : Recipe = req.body
        console.log(req.body)
        ingredients.map(ingr => delete ingr.local_name)

        if (!disease || !how_to_make || !how_to_use || !ingredients) {
            
            return res.status(400).json({ error: "Missing required value" })
        }

        const response = await prisma.medicRecipe.create({
            data: {
                disease: disease,
                how_to_make: how_to_make,
                how_to_use: how_to_use,
                ingredient: {
                    createMany: {
                        data: ingredients,
                        skipDuplicates: true
                    }
                }
            }
        })

        return res.status(201).json({message: `Resep untuk ${disease} berhasil ditambahkan`})
    }
}