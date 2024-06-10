export interface ReviewType {
    title: string,
    cover: string,
    overall: string
}

export const visualNovelReviews: ReviewType[] = [
    {
        title: "House in Fata Morgana",
        cover: "z",
        overall: "8"
    },
    {
        title: "Wonderful Everyday",
        cover: "z",
        overall: "8"
    },
    {
        title: "Song of Saya",
        cover: "z",
        overall: "7"
    },
    {
        title: "Danganronpa 1",
        cover: "z",
        overall: "6"
    },
    {
        title: "Doki Doki Literature Club",
        cover: "z",
        overall: "5"
    },
    {
        title: "Danganronpa 2",
        cover: "z",
        overall: "5"
    },
    {
        title: "Danganronpa 3",
        cover: "z",
        overall: "1"
    },
    {
        title: "Chaos:Head",
        cover: "z",
        overall: "1"
    },
]

export const gameReviews: ReviewType[] = [
    {
        title: "Lego Ninjago",
        cover: "z",
        overall: "10"
    },
    {
        title: "Elden Ring",
        cover: "z",
        overall: "8"
    },
    {
        title: "ICO",
        cover: "z",
        overall: "7"
    },
    {
        title: "Yakuza 0",
        cover: "z",
        overall: "6"
    },
    {
        title: "Portal 2",
        cover: "z",
        overall: "4"
    },
    {
        title: "Amnesia Dark Descent",
        cover: "z",
        overall: "4"
    },
    {
        title: "Amnesia Rebirth",
        cover: "z",
        overall: "4"
    },
    {
        title: "World of Horror",
        cover: "z",
        overall: "2"
    },
    {
        title: "Yume Nikki",
        cover: "z",
        overall: "2"
    },
    {
        title: "Postal Redux",
        cover: "z",
        overall: "1"
    },
    {
        title: "The Long Dark",
        cover: "z",
        overall: "1"
    },
]

export const movieReviews: ReviewType[] = [
    {
        title: "Seven",
        cover: "z",
        overall: "4"
    },
    {
        title: "Shogun",
        cover: "z",
        overall: "7"
    },
]

export interface CategoryType {
    title: string,
    reviews: ReviewType[]
}

export const reviewCategories: CategoryType[] = [
    {
        title: "Visual Novels",
        reviews: visualNovelReviews
    },
    {
        title: "Games",
        reviews: gameReviews
    },
    {
        title: "Movies",
        reviews: movieReviews
    },
]