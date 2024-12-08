/**
 * Calculate discounts based on the cart and applicable offers.
 * @param {Array} cart - The shopping cart containing items.
 * @returns {Object} - Subtotal, discount, and total after applying offers.
 */
export const calculateDiscounts = (cart) => {
    let subtotal = 0;
    let discount = 0;

    const updatedCart = cart.map((item) => {
        subtotal += item.quantity * item.price;

        // Offer: Buy 6 cans of Coca-Cola, get 1 free
        if (item.name === 'Coca-Cola' && item.quantity >= 6) {
            const freeCans = Math.floor(item.quantity / 6);
            discount += freeCans * item.price;
        }

        // Offer: Buy 3 croissants, get 1 coffee free
        if (item.name === 'Croissant' && item.quantity >= 3) {
            const freeCoffees = Math.floor(item.quantity / 3);
            discount += freeCoffees * 3; // Assuming coffee price is $3
        }

        return item;
    });

    return {
        updatedCart,
        subtotal,
        discount,
        total: subtotal - discount,
    };
};
