'use client'

import { useThree } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { common } from "../styles/styles";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()

    const vw = useThree().size.width;
    const vh = useThree().size.height;

    return (
        <Container flexGrow={1} width={vw} height={vh} backgroundColor="white" flexDirection="column">
            <Text onClick={() => router.push('/000')} {...common.title} >
                001
            </Text>
        </Container>
    )
}