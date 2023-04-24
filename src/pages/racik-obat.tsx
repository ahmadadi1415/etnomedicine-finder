import WebHead from "@/components/head";
import NavigationBar from "@/components/navigationBar";
import NotificationModal from "@/components/notificationModal";
import { resizeImage } from "@/utils/image-resizer";
import { Container, Grid, Text, Spacer, Card, Image, Row, Col, Input, Button, Loading, Textarea, Modal, Pagination, Collapse, FormElement, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, Danger, Delete, Plus, Search, TickSquare } from "react-iconly";

interface Herbs {
    local_name: string,
    scientific_name: string,
    efficacy: string,
    image: string
}

interface MedicIngredient {
    herb_id: number,
    local_name?: string,
    parts_used: string,
    quantity: string,
}

interface Recipe {
    id: number
    ingredient: MedicIngredient[]
    disease: string
    how_to_make: string
    how_to_use: string
}

interface SearchResults {
    efficacy: string
    herb_id: number
    image_url: string
    local_name: string
    scientific_name: string
}

interface HerbDetails extends SearchResults {
    recipes: Recipe[]
}

export default function RacikObat() {
    const [image, setImage] = useState<string | ArrayBuffer>();
    const [visible, setVisible] = useState(false)
    const [notify, setNotify] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState({
        type: "",
        message: ""
    })
    const [refQuery, setRefQuery] = useState("")
    const [searching, setSearching] = useState(false)
    const [herbSubmitting, setHerbSubmitting] = useState(false)

    const [searchRes, setSearchRes] = useState<SearchResults[]>()
    const [pageIndex, setPageIndex] = useState(1)

    const [herbDetail, setHerbDetail] = useState<HerbDetails>()
    const [ingredients, setIngredients] = useState<MedicIngredient[]>([])
    const [ingrListIndex, setIngrListIndex] = useState(1)
    const [addHerbRes, setAddHerbRes] = useState<{ status: number, message: string }>()

    const [herbsFormData, setHerbsFormData] = useState({
        local_name: "",
        scientific_name: "",
        efficacy: "",
        image: ""
    })

    const [recipeFormData, setRecipeFormData] = useState({
        ingredients: [] as MedicIngredient[],
        disease: "",
        how_to_make: "",
        how_to_use: ""
    })

    // Herbs searching functionality 
    async function search() {
        if (!refQuery) {
            return
        }

        setSearching(true)
        const response = await axios.get(`/api/herbs/search/${refQuery}`)
            .then((response) => {
                setSearching(false)
                setSearchRes(response.data)
                console.log(response.data)
            })
    }

    // Look for a detailed information of the herbs by getting the recipe by the herb_id
    async function lookDetails(herbData: SearchResults) {
        const response = await axios.get(`/api/recipes/search?herb_id=${herbData.herb_id}`)
        const recipeList: Recipe[] = await response.data

        const herbDetails: HerbDetails = {
            ...herbData,
            recipes: recipeList
        }

        setHerbDetail(herbDetails)
        // console.log(response.data)
        // console.log(recipeList)
    }

    // Adding ingredient for a medic recipe 
    const addIngredient = (local_name: string, herb_id: number) => {
        const included = ingredients.some((ingr) => ingr.local_name === local_name as string && ingr.herb_id === herb_id as number)

        if (!included) {
            setIngredients((prevIngr): MedicIngredient[] => [...prevIngr, { local_name, herb_id, parts_used: "", quantity: "" }])
        }
        // console.log(ingredients.length)
    }

    // Removing an ingredient of a medic recipe 
    const removeIngredient = (ingrIndex: number) => {
        setIngredients((prevIngr): MedicIngredient[] => prevIngr.filter((_, index) => index !== ingrIndex))
        console.log(ingredients.length - 1)
        if (((ingredients.length - 1) % 3 === 0) && (ingrIndex % 3 === 0) && ingrIndex !== 0) {
            // console.log("back to last index")
            setIngrListIndex(ingrListIndex - 1)
        }
    }

    // Adding a new herb functionality
    const addNewHerb = async () => {

        // HerbsFormData validation
        if (herbsFormData.efficacy === "" || herbsFormData.local_name === "" || herbsFormData.scientific_name === "" || herbsFormData.image === "") {
            setNotify(true)
            setNotificationMessage({
                type: "warning",
                message: "Kolom rincian bahan dan gambarnya tidak boleh kosong"
            })
            return
        }

        setAddHerbRes(undefined)
        setHerbSubmitting(true)

        try {
            const response = await axios.post("/api/herbs", herbsFormData)
            setAddHerbRes({ status: response.status, message: response.data.message })
            if (response.status !== 201) {
                // Reset HerbsFormData and Image
                setImage("")
                setHerbsFormData({
                    efficacy: "",
                    image: "",
                    local_name: "",
                    scientific_name: ""
                })
            }
        } catch (error) {
            setAddHerbRes({ status: 500, message: error as string })
            console.log(error)
        }
        setHerbSubmitting(false)
        // console.log(addHerbRes)

        // console.log(herbsFormData)
    }

    // Adding a new recipe functionality
    const addNewRecipe = async () => {

        // Set the RecipeFormData so it includes the ingredients the user inputed before
        setRecipeFormData((prevRecipeData) => ({
            ...prevRecipeData,
            ingredients: ingredients
        }))

        // RecipeFormData validation
        if (recipeFormData.disease === "" || recipeFormData.how_to_make === "" || recipeFormData.how_to_use === "" || recipeFormData.ingredients.length === 0) {
            setNotify(true)
            setNotificationMessage({
                type: "warning",
                message: "Kolom resep untuk racik obat tidak boleh kosong"
            })
            return
        }

        // POST the RecipeFormData to the Server
        const response = await axios.post("/api/recipes", recipeFormData)
            .then((response) => {

                if (response.status === 201) {
                    setNotificationMessage({
                        type: "success",
                        message: response.data.message
                    })
                } else {
                    setNotificationMessage({
                        type: "error",
                        message: response.data.error
                    })
                }

                // Reset the RecipeFormData so its empty
                setRecipeFormData({
                    disease: "",
                    how_to_make: "",
                    how_to_use: "",
                    ingredients: []
                })

                setNotify(true)
            })

    }

    const hiddenImageInput: any = useRef(null);

    useEffect(() => {
        // console.log(herbsFormData)
    }, [herbsFormData, recipeFormData, addHerbRes, ingredients, searchRes]);

    // Handling image input from the user
    const handleImage = async (e: any) => {
        const reader = new FileReader();
        // Resizing user image to max width 512 and max height 512
        await resizeImage(e.target.files[0], 512, 512).then((blob) => {
            // setLocalImg(blob as any);
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                setImage(reader.result as any);

                // Setting the HerbsFormData.image so it has the same as user input
                setHerbsFormData((prevHerbData) => ({
                    ...prevHerbData,
                    image: reader.result as string
                }))
            };
        });
    };

    // Handling Recipe Input Form from the user
    const handleRecipeInput = (e: any) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value

        setRecipeFormData((prevData) => ({
            ...prevData,
            [fieldName]: fieldValue
        }))
    }

    // Handling Herb Input Form from the user
    const handleHerbInput = (e: any) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value

        setHerbsFormData((prevData) => ({
            ...prevData,
            [fieldName]: fieldValue
        }))
    }

    // Handling user edit detail of an ingredient (User editing the quantity and parts_used input)
    const handleIngrInput = (e: ChangeEvent<FormElement>, ingrIndex: number) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value

        const newIngr: any = [...ingredients]
        newIngr[ingrIndex][fieldName] = fieldValue

        setIngredients(newIngr)
    }

    // Herbs Input Modal Handler
    const openModalHandler = () => {
        setVisible(true)
    }

    const closeModalHandler = () => {
        setVisible(false)
    }

    return (
        <>
            <WebHead />
            <NavigationBar />
            <Container fluid css={{ py: "$15" }}>
                <Grid.Container gap={1} justify="center">
                    <Grid xs={12} sm={4} md={6} lg={3} justify="center">
                        <Col span={11} hidden={(!herbDetail) ? true : false}>
                            <Card>
                                <Card.Header css={{ position: "absolute", zIndex: 1, top: 4, px: 0, mx: 0 }}>
                                    <Container>
                                        <Row wrap="wrap">
                                            <Text size={23} weight="bold" transform="uppercase" css={{ color: "$gray900", background: "$primaryLight", borderRadius: "$pill", opacity: "85%", mt: 1, px: 10 }} span>
                                                {(herbDetail) && herbDetail.local_name}
                                            </Text>
                                        </Row>
                                        <Row>
                                            <Text size={12} css={{ color: "$gray900", background: "$primaryLight", borderRadius: "$pill", opacity: "80%", p: 3, px: 10, mt: 2 }} i>
                                                {(herbDetail) && herbDetail.scientific_name}
                                            </Text>
                                        </Row>
                                    </Container>
                                </Card.Header>
                                <Card.Body css={{ p: 0 }}>
                                    <Card.Image
                                        loading="lazy"
                                        src={`${herbDetail?.image_url}`}
                                        showSkeleton
                                        objectFit="cover"
                                        width={"100%"}
                                        height={"100%"}
                                    />
                                </Card.Body>
                                <Card.Footer>
                                    <Container>
                                        <Text weight={"semibold"}>
                                            Khasiat untuk
                                        </Text>
                                        <Text size={14}>
                                            {(herbDetail) && herbDetail.efficacy}
                                        </Text>
                                        <Spacer y={0.3} />
                                        <Collapse.Group>
                                            {
                                                (herbDetail) && herbDetail.recipes.map((recipe, index) => (
                                                    <Collapse title={`Obat untuk ${recipe.disease}`} key={index} css={{ textSizeAdjust: "10" }}>

                                                        <Text weight={"semibold"}>
                                                            Bahan yang dibutuhkan
                                                        </Text>
                                                        {
                                                            (recipe) && recipe!.ingredient.map((ingredient) => (
                                                                <Row justify="space-between">
                                                                    <Text size={14}>{ingredient.parts_used}</Text>
                                                                    <Text size={12}>{ingredient.quantity}</Text>
                                                                </Row>
                                                            ))
                                                        }
                                                        <Text weight={"semibold"}>
                                                            Cara Pembuatan
                                                        </Text>
                                                        <Text size={14}>
                                                            {(recipe) && recipe.how_to_make}
                                                        </Text>
                                                        <Spacer y={0.3} />
                                                        <Text weight={"semibold"}>
                                                            Cara Pakai
                                                        </Text>
                                                        <Text size={14}>
                                                            {(recipe) && recipe.how_to_use}
                                                        </Text>
                                                    </Collapse>
                                                ))
                                            }

                                        </Collapse.Group>
                                        <Spacer y={0.3} />

                                    </Container>
                                </Card.Footer>
                            </Card>
                            <Spacer x={3} />
                        </Col>

                    </Grid>

                    {/* Search Bar and Results */}
                    <Grid xs={12} sm={8} md={6} lg={5}>
                        <Col>
                            <Container>
                                <Row>
                                    <Text h2>
                                        Racik Obatmu
                                    </Text>
                                </Row>

                                <Spacer y={0.5} />
                                <Row>
                                    <Text size={"$sm"}>
                                        Cari Bahan yang Dibutuhkan
                                    </Text>
                                </Row>
                                <Row gap={0.3}>
                                    <Col span={10}>
                                        <Input placeholder="Tulis nama penyakit atau bahan"
                                            name="search"
                                            type="search"
                                            fullWidth
                                            onChange={(e) => setRefQuery(e.target.value)}
                                        />
                                    </Col>
                                    <Col span={2}>
                                        <Button auto onPress={() => {
                                            console.log(refQuery)
                                            search()
                                        }}>
                                            {searching ? (<Loading size="xs" color={"currentColor"} />) : <Search size={"small"}></Search>}
                                        </Button>
                                    </Col>
                                </Row>
                                <Spacer y={1.5} />
                                <Row>
                                    <Spacer x={0.5} />
                                    <Grid.Container gap={1}>
                                        {
                                            (searchRes?.slice((pageIndex * 3 - 3), (pageIndex * 3)).map((searchData) => (
                                                <Grid xs={4}>
                                                    <Card isPressable onPress={() => {
                                                        // console.log("pressed")
                                                        lookDetails(searchData)
                                                    }}>
                                                        <Card.Body css={{ p: 0 }}>
                                                            <Card.Image
                                                                loading="lazy"
                                                                showSkeleton
                                                                src={`${searchData.image_url}`}
                                                                objectFit="cover"
                                                                height={"135px"}
                                                                width={"100%"}

                                                            />
                                                            <Card.Footer css={{ justifyItems: "flex-start", bottom: 0 }}>
                                                                <Col>
                                                                    <Row wrap="wrap" css={{ height: "75px" }}>
                                                                        <Col span={12}>
                                                                            <Text b>{searchData.local_name}</Text>
                                                                        </Col>
                                                                        <Col span={12} >
                                                                            <Text size={"$sm"} i>
                                                                                {searchData.scientific_name}
                                                                            </Text>
                                                                        </Col>
                                                                    </Row>
                                                                    <Spacer y={0.5}></Spacer>
                                                                    <Row align="flex-end" justify="center">
                                                                        <Button auto css={{ width: "100%" }}
                                                                            disabled={ingredients.some((ingr) => ingr.herb_id === searchData.herb_id)}
                                                                            onPress={() => {
                                                                                addIngredient(searchData.local_name, searchData.herb_id)
                                                                            }}>

                                                                            {
                                                                                (ingredients.some((ingr) => ingr.herb_id === searchData.herb_id)) ? (
                                                                                    <TickSquare filled />
                                                                                ) : (
                                                                                    <Plus filled />
                                                                                )
                                                                            }
                                                                        </Button>
                                                                    </Row>
                                                                </Col>
                                                            </Card.Footer>
                                                        </Card.Body>
                                                    </Card>
                                                </Grid>
                                            ))
                                            )
                                        }
                                    </Grid.Container>
                                </Row>
                                <Spacer y={1.5}></Spacer>
                                <Row justify="center">
                                    {(searchRes && searchRes.length !== 0) ? (
                                        <Pagination
                                            loop
                                            page={pageIndex}
                                            total={
                                                Math.ceil(searchRes.length / 3)
                                            }
                                            onChange={(index) => {
                                                setPageIndex(index)
                                                // console.log(index)
                                            }}
                                        ></Pagination>

                                    ) : (searchRes?.length === 0) ? (
                                        <Row>
                                            <Text small>Tidak menemukan bahan yang kamu cari? Tambahkan saja bahan yang kamu maksud.</Text>
                                            <Spacer x={1} />
                                            <Button auto onPress={openModalHandler}>
                                                Tambahkan Bahan
                                            </Button>
                                        </Row>
                                    ) : (
                                        <Text>Silakan cari bahan yang kamu perlukan</Text>
                                    )
                                    }
                                </Row>
                            </Container>
                        </Col>
                    </Grid>

                    {/* Add New Recipe Form */}
                    <Grid xs={12} md={6} lg={4} justify="center">
                        <Col span={12}>
                            <Spacer y={1} />
                            <Row>
                                <Text h3>
                                    Mulai Meracik
                                </Text>
                            </Row>
                            <Row>
                                <Input name="disease" label="Obat untuk?" onChange={(e) => handleRecipeInput(e)} />
                            </Row>
                            <Spacer y={1.5} />
                            <Row>
                                <Text>
                                    Komposisi Bahan
                                </Text>
                            </Row>
                            <Row>
                                <Text>
                                    {(ingredients.length === 0) && ("Belum ada bahan yang ditambahkan")}
                                </Text>
                            </Row>
                            <Row>
                                {
                                    (ingredients.length !== 0) &&
                                    (<Grid.Container gap={1} >
                                        {
                                            (ingredients.slice((ingrListIndex * 3 - 3), (ingrListIndex * 3)).map((ingr, index) => (
                                                <Grid xs={4}>
                                                    <Card>
                                                        <Card.Header css={{ background: "$success" }}>
                                                            <Text color="white" weight={"medium"} size={15} css={{ textAlign: "start" }} span>
                                                                {ingr.local_name}
                                                            </Text>
                                                        </Card.Header>
                                                        <Card.Divider />
                                                        <Card.Body css={{ px: "0.5" }}>
                                                            <Tooltip trigger="click" content={"Bagian tumbuhan yang akan dimanfaatkan. Contohnya daun, buah, batang, atau ekstraknya."}>
                                                                <Input
                                                                    required
                                                                    width="6rem"
                                                                    size="xs"
                                                                    label="Bagian tumbuhan"
                                                                    name="parts_used"
                                                                    onChange={
                                                                        (e) => {
                                                                            handleIngrInput(e, index)
                                                                        }
                                                                    }
                                                                />
                                                            </Tooltip>
                                                            <Tooltip trigger="click" content={"Banyak atau takaran bahan yang diperlukan untuk membuatnya."}>
                                                                <Input
                                                                    width="6rem"
                                                                    size="xs"
                                                                    label="Jumlah (satuan)"
                                                                    name="quantity"
                                                                    onChange={
                                                                        (e) => {
                                                                            handleIngrInput(e, index)
                                                                        }
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </Card.Body>
                                                        <Card.Footer>
                                                            <Row justify="flex-end">
                                                                <Button color={"error"} auto onPress={() => {
                                                                    removeIngredient(index)

                                                                }}>
                                                                    <Delete filled size={"small"}></Delete>
                                                                </Button>
                                                            </Row>
                                                        </Card.Footer>
                                                    </Card>
                                                </Grid>
                                            )))
                                        }
                                    </Grid.Container>)
                                }
                            </Row>
                            <Spacer y={0.5}></Spacer>
                            <Row justify="center">
                                {
                                    (ingredients.length > 0) && (
                                        <Pagination
                                            loop
                                            onlyDots
                                            size={"md"}
                                            page={ingrListIndex}
                                            total={
                                                Math.ceil(ingredients.length / 3)
                                            }
                                            onChange={(index) => {
                                                setIngrListIndex(index)
                                            }} />)
                                }
                            </Row>
                            <Spacer y={1.1} />
                            <Row>
                                <Textarea name="how_to_make" label="Cara pembuatan" fullWidth onChange={(e) => handleRecipeInput(e)} />
                            </Row>
                            <Spacer y={1.1} />
                            <Row>
                                <Textarea name="how_to_use" label="Cara pemakaian" fullWidth onChange={(e) => handleRecipeInput(e)} />
                            </Row>
                            <Spacer y={1} />
                            <Row justify="center">
                                <Button onPress={() => {
                                    addNewRecipe()
                                }}>
                                    Tambahkan Resep
                                </Button>
                            </Row>
                        </Col>
                    </Grid>
                </Grid.Container>

                {/* Add Herbs Modal */}
                <Modal
                    closeButton
                    preventClose
                    aria-labelledby="modal-title"
                    width="700px"
                    open={visible}
                    onClose={closeModalHandler}
                >
                    <Modal.Header>
                        <Text id="modal-title" size={18}>
                            Tambahkan <b>Bahan</b>
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col span={8}>
                                <Input
                                    css={{ mb: "$5" }}
                                    clearable
                                    bordered
                                    fullWidth
                                    color="primary"
                                    size="lg"
                                    placeholder="Orthosiphon aristatus Bl"
                                    label="Nama Ilmiah"
                                    name="scientific_name"
                                    onChange={(e) => handleHerbInput(e)}
                                />
                                <Input
                                    css={{ mb: "$5" }}
                                    clearable
                                    bordered
                                    fullWidth
                                    color="primary"
                                    size="lg"
                                    placeholder="Kumis kucing"
                                    label="Nama Lokal"
                                    name="local_name"
                                    onChange={(e) => handleHerbInput(e)}
                                />
                                <Textarea
                                    bordered
                                    fullWidth
                                    color="primary"
                                    size="lg"
                                    placeholder="Khasiat dari bahan ini"
                                    label="Khasiat"
                                    name="efficacy"
                                    onChange={(e) => handleHerbInput(e)}
                                />
                            </Col>
                            <Spacer x={1.5} />
                            <Col span={4}>
                                <Row justify="flex-start">
                                    <Button
                                        auto
                                        onClick={() => { hiddenImageInput?.current?.click() }}
                                        icon={<Camera filled></Camera>}
                                    >
                                    </Button>
                                    <Spacer x={0.5}></Spacer>
                                    {
                                        (image) && (
                                            <Button
                                                auto
                                                onClick={() => setImage("")}
                                                color={"error"}
                                                icon={<Delete filled></Delete>}
                                            >
                                            </Button>
                                        )
                                    }

                                </Row>
                                <input
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleImage}
                                    hidden={true}
                                    ref={hiddenImageInput}
                                />
                                {
                                    (image) && (
                                        <Image
                                            showSkeleton
                                            css={{ borderRadius: "$lg", my: "$10" }}
                                            src={image as string}
                                            objectFit="cover"
                                            height={"100%"}
                                        />
                                    )
                                }

                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row justify="space-between" >
                            <Col>
                                {
                                    (addHerbRes) && (

                                        <Row css={{ background: (addHerbRes.status === 201) ? "$success" : "$error", p: 5, paddingLeft: 23, borderRadius: "$lg" }}>
                                            <Text span size={"$sm"} color="white" css={{ verticalAlign: "middle" }}>
                                                <b>
                                                    {addHerbRes.status === 201 ? "Berhasil! " : "Gagal! "}
                                                </b>
                                                {
                                                    addHerbRes.message
                                                }
                                            </Text>
                                        </Row>
                                    )
                                }
                            </Col>
                            <Col span={7}>
                                <Row justify="flex-end">
                                    <Button auto bordered color="error"
                                        onPress={(e) => {
                                            setHerbsFormData({
                                                scientific_name: "",
                                                local_name: "",
                                                efficacy: "",
                                                image: "",
                                            })
                                            setImage("")
                                            setAddHerbRes(undefined)
                                            closeModalHandler()
                                        }}>
                                        Batal
                                    </Button>
                                    <Spacer x={0.5} />
                                    <Button
                                        auto
                                        icon={(!herbSubmitting) ? <Plus filled></Plus> : <Loading size="xs" color={"currentColor"} />}
                                        disabled={herbSubmitting}
                                        onPress={(e) => {
                                            addNewHerb()
                                        }}>
                                        Tambah
                                    </Button>

                                </Row>
                            </Col>

                        </Row>

                    </Modal.Footer>
                </Modal>
                <NotificationModal closeHandler={() => { setNotify(false) }} open={notify} notification={notificationMessage} />
            </Container>
        </>
    )
}