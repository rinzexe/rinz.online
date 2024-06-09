import { useThree } from "@react-three/fiber"
import { FontFamilyProvider, Fullscreen, Root } from "@react-three/uikit"

export default function UIkit({ children }: { children: React.ReactNode }) {
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
            <Fullscreen distanceToCamera={100} width={vw} height={vh} flexDirection="column">
                {children}
            </Fullscreen>
        </FontFamilyProvider>
    )
}