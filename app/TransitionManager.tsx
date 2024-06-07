import { useEffect, useState } from "react";

export default function TransitionManager({ children }: Readonly<{ children: React.ReactNode }>) {
    const [displayChildren, setDisplayChildren] = useState(children)
    const [transitionStage, setTransitionStage] = useState("fadeOut")
    useEffect(() => {
        setTransitionStage("fadeIn")
    }, [])

    useEffect(() => {
        console.log(transitionStage)
        if (children !== displayChildren) {
            setTransitionStage("fadeOut")
        }
    }, [children, setDisplayChildren, displayChildren])

    return (
        <>
            {displayChildren}
        </>
    )
}