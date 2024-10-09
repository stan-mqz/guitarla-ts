
export type Guitar = {
    
    id: number
    name: string
    image: string
    description: string
    price: number

}


export type CartItem = Pick <Guitar, 'id'  | 'image' | 'name' | 'price'> & {
    quantity: number
}


