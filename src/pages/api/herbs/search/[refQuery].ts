import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

interface SearchData {
    herb_id: number,
    local_name: string,
    scientific_name: string,
    efficacy: string
    image_url: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { refQuery } = req.query

    if (req.method === "GET") {

        let data: SearchData[] = []
        let searchRes = null


        // Search by local name or scientific name of a herb
        searchRes = await prisma.herbs.findMany({
            where: {
                OR: [
                    {
                        local_name: {
                            contains: refQuery as string
                        }
                    },
                    {
                        scientific_name: {
                            contains: refQuery as string
                        }
                    }
                ]
            },
            select: {
                id: true,
                efficacy: true,
                image_url: true,
                local_name: true,
                scientific_name: true
            }
        })

        if (searchRes.length > 0) {
            data = [...searchRes].map((res) => ({
                herb_id: res.id as number,
                efficacy: res.efficacy as string,
                image_url: res.image_url as string,
                local_name: res.local_name as string,
                scientific_name: res.scientific_name as string
            }))
        }

        // If there is no response, search by disease
        if (searchRes.length === 0) {
            searchRes = await prisma.medicRecipe.findMany({
                where: {
                    disease: {
                        contains: refQuery as string,
                    }
                },
                select: {
                    ingredient: {
                        select: {
                            herbs: true
                        }
                    }
                }
            })

            data = searchRes.flatMap(resp => {
                const obj = resp.ingredient.map(ing => {
                    const flatten = {
                        // recipe_id: ing.recipe.id,
                        // disease: ing.recipe.disease,
                        herb_id: ing.herbs.id as number,
                        local_name: ing.herbs.local_name as string,
                        scientific_name: ing.herbs.scientific_name as string,
                        efficacy: ing.herbs.efficacy as string,
                        image_url: (!ing.herbs.image_url) ? "/img/herbs/" + ing.herbs.local_name?.toUpperCase() + ".png" : ing.herbs.image_url as string
                    }
                    return flatten
                })
                return obj
            })

        }

        // Filter the response, so there is no duplicate data inside array
        const filteredData = data.filter((item, index) => {
            return index === data.findIndex(obj => obj.herb_id === item.herb_id);
        });

        return res.status(200).json(filteredData)
    }
}