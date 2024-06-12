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
        title: "Portfolio",
        subtitle: "For employers",
        description: "A quick look into my skillset, experience and projects.",
        image: "/images/20.png",
        date: "12/06/2024"
    },
    {
        id: 2,
        title: "Reviews",
        subtitle: "Media I like, ranked",
        description: "A quick look into my skillset, experience and projects.",
        image: "/images/10.png",
        date: "10/06/2024"
    },
    {
        id: 2,
        title: "Reviews",
        subtitle: "Media I like, ranked",
        description: "A quick look into my skillset, experience and projects.",
        image: "/images/13.png",
        date: "10/06/2024"
    },
]