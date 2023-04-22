import { Button, Col, Modal, Row, Spacer, Text } from "@nextui-org/react"
import { Danger, InfoCircle, TickSquare } from "react-iconly"

interface ComponentProps {
    open: boolean,
    closeHandler: any,
    notification: {
        type: string,
        message: string
    }
}


export default function NotificationModal({ open, closeHandler, notification }: ComponentProps) {
    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={open}
            onClose={closeHandler}
        >
            <Modal.Header justify="flex-start" css={{ color: (notification.type === "success" ? "$success" : "$error") }} >
                {
                    (notification.type === "success") ? <TickSquare filled size={"xlarge"} /> :
                        (notification.type === "warning") ? <InfoCircle filled size={"xlarge"} /> :
                            <Danger filled size={"xlarge"} />
                }
                <Spacer x={0.2}></Spacer>
                <Text id="modal-title" h3 b>
                    {
                        (notification.type === "success") ? "Berhasil!" : "Gagal!"
                    }
                </Text>
            </Modal.Header>
            <Modal.Body>
                    <Text size={15}>
                        {notification.message}
                    </Text>
            </Modal.Body>

        </Modal>
    )
}