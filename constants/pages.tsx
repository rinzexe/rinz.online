interface Page {
    id: number
    title: string
    subtitle: string
    description: string
    image: string
    date: string
}

export const pages: Page[] = [
    {
        id: 1,
        title: "About me",
        subtitle: "For employers",
        description: "A quick look into my skillset, experience and projects.",
        image: "/images/20.png",
        date: "12/06/2024"
    },
    {
        id: 2,
        title: "Reviews",
        subtitle: "Media I like, ranked",
        description: "Reviews of the media I consume, ranked from best to worst.",
        image: "/images/19.png",
        date: "10/06/2024"
    },
/*     {
        id: 3,
        title: "Visions",
        subtitle: "AMV's novels, and web development",
        description: "Overview of my latest inspirations and ideas.",
        image: "/images/16.png",
        date: "10/06/2024"
    }, */
]