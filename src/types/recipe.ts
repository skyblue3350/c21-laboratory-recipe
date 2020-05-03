export interface Item {
    item: string
    required: number
    safety: boolean
}

export interface Recepi {
    name: string
    no: number
    recipe: Item[]
}

export default Recepi