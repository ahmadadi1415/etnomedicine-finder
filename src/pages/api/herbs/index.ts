import cloudinary from "@/utils/cloudinary";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface Herb {
    scientific_name: string,
    local_name: string,
    efficacy: string,
    image: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        const { local_name, scientific_name, efficacy, image }: Herb = req.body
        console.log(req.body)

        const herbExists = await prisma.herbs.findMany({
            where: {
                scientific_name: {
                    contains: scientific_name as string
                }
            }
        })
        // console.log(herbExists)

        if (herbExists.length > 0) {
            return res.status(200).json({message: "Bahan ini sudah pernah ditambahkan sebelumnya."})
        }

        let image_id, image_url

        try {
            const result = await cloudinary.uploader.upload(image, {
                upload_preset: "herb_images",
            })
            console.log(result)
            image_id = result.public_id
            image_url = result.secure_url
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

        const response = await prisma.herbs.create({
            data: {
                local_name: local_name,
                scientific_name: scientific_name,
                efficacy: efficacy,
                image_id: image_id,
                image_url: image_url
            }
        })

        return res.status(201).json({ message: `${scientific_name} berhasil ditambahkan.` })
    }

}