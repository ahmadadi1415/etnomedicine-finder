import { prisma } from "lib/prisma";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { useState } from "react"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { disease } = req.body

    try {
        const data = await prisma.medic.findMany({
            where: {
                disease: disease
            }
        })
        
        res.status(200).json(data)

    } catch (error) {
        console.error(error);
    }

}