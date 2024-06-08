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
        console.log(transitionStage)
        console.log(displayChildren)
        console.log(children)
        if (children !== displayChildren) {
            console.log("CHILDREN ARE NOT THE SAME")
            setTransitionStage("fadeOut")
        }
        else
        {
            console.log("CHILDREN ARE SAME")
        }
    }, [children, setDisplayChildren, displayChildren])

    return (
        <>
            <PostProcessing transitionStage={transitionStage} />
            {children}
            {displayChildren}
        </>
    )
}