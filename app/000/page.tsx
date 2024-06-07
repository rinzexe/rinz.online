'use client'

import { Container, Text } from "@react-three/uikit";
import { common } from "../styles/styles";
import { useThree } from "@react-three/fiber";

export default function Page() {
    const vw = useThree().size.width;
    const vh = useThree().size.height;
    return (
        <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column" >
            <Text {...common.title}>
                000
            </Text>
        </Container>
    )
}