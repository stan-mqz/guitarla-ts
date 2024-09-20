import { useState, useEffect, useMemo } from "react"
import { db } from '../data/db.ts'
import type { Guitar, CartItem } from "../types/types.ts"

export default function useCart() {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    const maxItems = 5
    const minItems = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])


    function addToCart(item : Guitar) {

        const itemExists = cart.findIndex(guitar => guitar.id === item.id)

        if (itemExists >= 0) {

            if (cart[itemExists].quantity >= maxItems) return

            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++;
            setCart(updatedCart)

        } else {

            //Si el artículo no esta en el carrito agregamos una nueva propiedad

            //Nueva variable que toma el tipo de dato "CartItem", crea una copia del item tipo "Guitar" y le añade la nueva propiedad
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])

        }



    }

    function removeFromCart(id : Guitar['id']) {

        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))

    }


    function increaseQuantity(id : Guitar['id']) {

        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < maxItems) {

                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item
        })

        setCart(updatedCart)
    }

    function decreaseQuantity(id :Guitar['id']) {

        const updatedCart = cart.map(item => {

            if (item.id === id && item.quantity > minItems) {
                return {

                    ...item,
                    quantity: item.quantity - 1
                }

            }

            return item

        })

        setCart(updatedCart)

    }

    function clearCart() {
        setCart([])
    }

    //State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])

    //Array Method que sirve para calcular el total de un carrito
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}