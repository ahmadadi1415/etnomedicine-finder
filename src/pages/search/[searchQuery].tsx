import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { prisma } from "lib/prisma";

interface Props {
    medics: MedicData[]
}

interface MedicData {
    id: number
    disease: String
    parts_used: String
    recipe: String
    scientific_name: String
    how_to_use: String
    url: String
    local_name: String
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    console.log(context.query)
    const searchQuery = context.query.searchQuery

    const medics = await prisma.medic.findMany({
        where: {
            OR: [
                {
                    disease: {
                        contains: searchQuery as string
                    }
                },
                {
                    local_name: {
                        contains: searchQuery as string
                    }
                }

            ]
        }
    })

    console.log(medics)

    return {
        props: {
            medics,
        }
    }
}

export default function SearchResults({ medics }: Props) {

    console.log(medics)
    const router = useRouter()

    function redirect(id: number) {
        router.push(`/medicine/${id}`)
    }

    return (
        <>
            <main className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="container">

                    <div className="table w-full border-separate border border-spacing-3 table-auto">
                        <div className="table-header-group">
                            <div className="table-row">
                                <div className="table-cell text-center">Id</div>
                                <div className="table-cell text-center">Nama Lokal</div>
                                <div className="table-cell text-center">Nama Ilmiah</div>
                                <div className="table-cell text-center">Penyakit</div>
                            </div>
                        </div>
                        <div className="table-row-group">
                            {medics.map(medic => (
                                <div className="table-row" key={medic.id} onClick={() => redirect(medic.id)}>
                                    <div className="table-cell text-center">{medic.id}</div>
                                    <div className="table-cell text-center">{medic.local_name}</div>
                                    <div className="table-cell text-center">{medic.scientific_name}</div>
                                    <div className="table-cell text-center">{medic.disease}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div>

                    </div>
                </div>
            </main>
        </>
    )
}
