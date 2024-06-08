import { useEffect, useState } from "react";
import { PostProcessing } from "./PostProcessing";

export default function TransitionManager({ children }: Readonly<{ children: React.ReactNode }>) {
    console.log("reset")
    const [displayChildren, setDisplayChildren] = useState(children)
    const [transitionStage, setTransitionStage] = useState("fadeIn")
    useEffect(() => {
        setTransitionStage("fadeIn")
    }, [])

    useEffect(() => {
        console.log(transitionStage)
        if (children !== displayChildren) {
            setTransitionStage("fadeOut")
            setTimeout(() => {
                setDisplayChildren(children)
                setTransitionStage("fadeIn")
            }, 1000)
        }
    }, [children, setDisplayChildren, displayChildren])

    return (
        <>
            <PostProcessing transitionStage={transitionStage} />
            {displayChildren}
        </>
    )
}