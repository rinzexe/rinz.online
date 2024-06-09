import { useThree } from "@react-three/fiber"
import { FontFamilyProvider, Fullscreen, Root } from "@react-three/uikit"

interface UIKitProps {
    children?: React.ReactNode
    onWheel?: (e: WheelEvent) => void
}

export default function UIkit({ children, onWheel = () => {} }: UIKitProps ) {
    const vw = useThree().size.width
    const vh = useThree().size.height
    return (
        <FontFamilyProvider
            default={{
                light: "/fonts/PPTelegraf-UltraLight-msdf.json",
                medium: "/fonts/PPTelegraf-Regular-msdf.json",
                bold: "/fonts/PPTelegraf-UltraBold-msdf.json",
            }}
        >
            <Fullscreen onWheel={(e: any) => {onWheel(e)}} distanceToCamera={100} width={vw} height={vh} flexDirection="column">
                {children}
            </Fullscreen>
        </FontFamilyProvider>
    )
}