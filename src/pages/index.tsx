import NavigationBar from "@/components/navigationBar";
import { Col, Container, Row, Spacer, Text, Image, Grid, Button, Link } from "@nextui-org/react";
import { ArrowRight } from "react-iconly";

export default function Home() {

    return (
        <>
        <NavigationBar/>
            <Container fluid >
                <Grid.Container gap={2}>
                    <Grid lg={7} justify="center">
                        <Col>
                            <Image
                                css={{ borderRadius: "$base" }}
                                src="https://res.cloudinary.com/dcgd4vnz5/image/upload/v1682174735/katherine-hanlon-9-Hgi9w9bDM-unsplash_fet7e1.jpg"
                                width={"100%"}
                                showSkeleton
                                autoResize
                            />

                            <Row justify="flex-start">
                                <Spacer x={4} />
                                <Text>Photo by <a href="https://unsplash.com/@tinymountain?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Katherine Hanlon</a> on <a href="https://unsplash.com/photos/9-Hgi9w9bDM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                                </Text>
                            </Row>
                        </Col>
                    </Grid>
                    <Grid lg={5}>
                        <Col>
                            <Spacer y={2} />
                            <Row>
                                <Text size={37} weight={"bold"} span color="primary">
                                    Etnomedicine?
                                </Text>
                            </Row>
                            <Row>
                                <Text>
                                    Etnomedisin adalah studi tentang praktik pengobatan tradisional dari berbagai kelompok etnis. Etnomedisin adalah bidang yang luas yang mencakup penggunaan tanaman, hewan, dan mineral untuk tujuan penyembuhan, serta penggunaan ritual dan praktik lainnya. Etnomedisin sering kali dipraktikkan oleh orang-orang yang memiliki sedikit akses ke pengobatan Barat, seperti masyarakat adat.
                                </Text>
                            </Row>
                            <Spacer y={1}/>
                            <Row justify="flex-start">
                                <Link href="/racik-obat">
                                    <Button css={{ px: "$10" }}>
                                        <ArrowRight filled />
                                        <Spacer x={0.5} />
                                        <Text color="white" span> Mulai meracik obat! </Text>
                                    </Button>
                                </Link>
                            </Row>
                        </Col>
                    </Grid>
                </Grid.Container>
            </Container>
        </>
    )
}