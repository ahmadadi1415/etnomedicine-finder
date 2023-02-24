import { prisma } from "lib/prisma";
import { GetServerSideProps } from "next";

interface FormData {
    disease: string
}

export default function Home() {
    return (
        <>
        
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async() => {
    const medics = await prisma?.medic.findMany({
        select: {
            id: true,
            name: true
        }
    })

    return {
        props: {
            medics
        }
    }
}