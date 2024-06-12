import { useThree } from "@react-three/fiber"
import { FontFamilyProvider, Fullscreen, Root } from "@react-three/uikit"
import { ReactNode, useMemo } from "react"

interface UIKitProps {
    children?: React.ReactNode
    onWheel?: (e: WheelEvent) => void
    isfullscreen?: boolean
}

export default function UIkit({ children, onWheel = () => { }, isfullscreen = true }: UIKitProps) {
    const vw = useThree().size.width
    const vh = useThree().size.height

    const mainContent: any = () => {
        return () => {
            switch (isfullscreen) {
                case true:
                    return (
                        <Fullscreen onWheel={(e: any) => { onWheel(e) }} width={vw} height={vh} flexDirection="column">
                            {children}
                        </Fullscreen>
                    );

                case false:
                    return (
                        <Root onWheel={(e: any) => { onWheel(e) }} width={vw} height={vh} flexDirection="column">
                            {children}
                        </Root>
                    );
            }
        }
    }

    return (
        <FontFamilyProvider
            default={{
                light: "/fonts/PPTelegraf-UltraLight-msdf.json",
                medium: "/fonts/PPTelegraf-Regular-msdf.json",
                bold: "/fonts/PPTelegraf-UltraBold-msdf.json",
            }}
        >
            {mainContent()()}
        </FontFamilyProvider>
    )
}