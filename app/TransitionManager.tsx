import { createContext, useEffect, useState } from "react";
import { PostProcessing } from "./PostProcessing";
import { useRouter } from "next/navigation";

interface TransitionContextType {
    link: (url: any) => void
}

var tempContext: TransitionContextType = {
    link: (url: any) => {}
}

export const TransitionContext = createContext(tempContext)

export default function TransitionManager({ children }: Readonly<{ children: React.ReactNode }>) {

    const router = useRouter()

    const [transitionStage, setTransitionStage] = useState('fadeIn')

    function link(url: any)
    {
        setTransitionStage('fadeOut')
        setTimeout(() => {
            location.href = url
            /* setTransitionStage('fadeIn') */
        }, 1000)
    }

    return (
        <>
            <PostProcessing transitionStage={transitionStage} />
            <TransitionContext.Provider value={{link: (url: any) => link(url)}}>
                {children}
            </TransitionContext.Provider>
        </>
    )
}