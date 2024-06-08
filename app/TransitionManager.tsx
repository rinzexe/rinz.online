import { useEffect, useState } from "react";
import { PostProcessing } from "./PostProcessing";

const memoryState: any = {};

function useMemoryState(key: any, initialState: any) {
    const [state, setState] = useState(() => {
        const hasMemoryValue = Object.prototype.hasOwnProperty.call(memoryState, key);
        if (hasMemoryValue) {
            return memoryState[key]
        } else {
            return typeof initialState === 'function' ? initialState() : initialState;
        }
    });

    function onChange(nextState: any) {
        memoryState[key] = nextState;
        setState(nextState);
    }

    return [state, onChange];
}

export default function TransitionManager({ children }: Readonly<{ children: React.ReactNode }>) {
    const [displayChildren, setDisplayChildren] = useMemoryState('children', null)
    const [test, setTest] = useMemoryState('text', 'old')
    const [transitionStage, setTransitionStage] = useMemoryState('transitionStage', ['fadeIn'])
    console.log(transitionStage)

    useEffect(() => {
        console.log(transitionStage)

        if (children !== displayChildren) {
            console.log(test)
            setTest('new')
            setTransitionStage("fadeOut")
        }
        else {
            console.log("CHILDREN ARE SAME")
        }

        if (test == "old") {
            console.log("updated children")
            setDisplayChildren(children)
        }

    }, [children, setDisplayChildren, displayChildren])

    return (
        <>
            <PostProcessing transitionStage={transitionStage} />
            {displayChildren}
        </>
    )
}