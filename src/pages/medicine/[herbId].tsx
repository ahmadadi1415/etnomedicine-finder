import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { prisma } from "lib/prisma";
import Image from "next/image";

interface Props {
    details: MedicData
}

interface MedicData {
    id: number
    disease:String
    parts_used: String
    recipe: String
    scientific_name: String
    how_to_use: String
    url: String
    local_name: String
}

export default function MedicineDetails({details} : Props) {

    console.log(details)

    return (
        <>
        <main className="bg-slate-500">
            <div className="container">
                <div className="">
                    <h1 className="text-center font-bold">{details.local_name}</h1>
                    <p className="text-lg">{details.scientific_name}</p>
                    <Image  width={200} height={200} src={`/img/herbs/${details.url}`}></Image>
                </div>
                <div className="columns-1">
                    <p className="text-lg">{details.disease}</p>
                    <p className="text-xl">{details.parts_used}</p>
                    <p className="text-base"> {details.how_to_use}</p>
                    <p className="text-base"> { details.recipe}</p>
                </div>
            </div>
        </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async(context) => {
    
    const herbId = context.query.herbId

    const details = await prisma.medic.findUnique({
        where: {
            id: parseInt(herbId as string)
        }
    })
    

    return {
        props: {
            details
        }
    }
}
