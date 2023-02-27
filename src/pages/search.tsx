import { prisma } from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
    medics: MedicData[]
}

interface MedicData {
    id: number,
    herb_name: string,
    parts_used: string,
    origin_loc: string,
    scientific_name: string
    disease: string
    recipe: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { query } = context
    const { disease } = query

    // sk-JuJ463fb77863871a124
    //qGUo63fb7c474a74c124
    const medics = await prisma.medic.findMany({
        where: {
            disease: { contains: disease as string }
        }
    })

    return { props: { medics } }
}

export default function SearchResults({ medics }: Props) {
    const router = useRouter()

    const { herbId } = router.query

    // const [medicines, setMedicines] = useState<MedicData[]>([])
    const [oneMedicine, setOneMedicine] = useState<MedicData>()

    useEffect(() => {
        if (herbId) {
            fetchOneMedicine(herbId)
        } else {
            // fetchMedicines();
            setOneMedicine(undefined)
        }
    }, [herbId])

    // async function fetchMedicines() {
    //     const res = await fetch("/api/herbs")
    //     const data = await res.json()
    //     setMedicines(data)
    //     console.log(data)
    // }

    async function fetchOneMedicine(herbId: any) {
        const res = await fetch(`/api/herbs/${herbId}`)
        const data = await res.json()

        // const query = 'aloevera'
        // const plants = await fetch(`/api/serpapi-google/${query}`)
        // const dataPlants = await plants.json()
        // console.log(dataPlants)

        setOneMedicine(data)
        console.log(data)
    }

    let appendQuery = (id: any) => {
        router.query.herbId = id;
        router.push(router)
    }

    return (
        <>
            <main className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="container">
                    {oneMedicine?.id ? (
                        <div>
                            <h1 className="text-3xl p-4">{oneMedicine.herb_name}</h1>
                            <h2 className=""></h2>
                        </div>
                    ) : null}

                    <div className="table w-full border-separate border border-spacing-3 table-auto">
                        <div className="table-header-group">
                            <div className="table-row">
                                <div className="table-cell text-center">Id</div>
                                <div className="table-cell text-center">Bagian yang Dimanfaatkan</div>
                                <div className="table-cell text-center">Nama Lokal</div>
                                <div className="table-cell text-center">Nama Ilmiah</div>
                                <div className="table-cell text-center">Wilayah</div>
                                <div className="table-cell text-center">Jenis Ramuan Untuk Penyakit</div>
                                <div className="table-cell text-center">Resep</div>
                            </div>
                        </div>
                        <div className="table-row-group">
                            {medics.map(result => (
                                <div className="table-row" key={result.id} onClick={() => appendQuery(result.id)}>
                                    <div className="table-cell text-center">{result.id}</div>
                                    <div className="table-cell text-center">{result.parts_used}</div>
                                    <div className="table-cell text-center">{result.herb_name}</div>
                                    <div className="table-cell text-center">{result.scientific_name}</div>
                                    <div className="table-cell text-center">{result.origin_loc}</div>
                                    <div className="table-cell text-center">{result.disease}</div>
                                    <div className="table-cell text-center">{result.recipe}</div>
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