import { useEffect, useState } from "react";
import { PostProcessing } from "./PostProcessing";

const memoryState: any = {};

function useMemoryState(key: any, initialState: any){
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
    const [displayChildren, setDisplayChildren] = useMemoryState('children', children)
    const [transitionStage, setTransitionStage] = useMemoryState('transitionStage', ['fadeIn'])
    console.log(transitionStage)
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