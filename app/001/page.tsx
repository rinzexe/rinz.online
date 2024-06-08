'use client'

import { useThree } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { common } from "../styles/styles";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { TransitionContext } from "../TransitionManager";

export default function Page() {

    const vw = useThree().size.width;
    const vh = useThree().size.height;
    
    const context = useContext(TransitionContext)

    return (
        <Container flexGrow={1} width={vw} height={vh} backgroundColor="black" flexDirection="column">
            <Text marginLeft={200} onClick={() => {context.link("/000")}} {...common.title} >
                001
            </Text>
        </Container>
    )
}