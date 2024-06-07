'use client'

import { useRouter } from "next/navigation"

export function link(url: string)
{
    useRouter().push(url)
}