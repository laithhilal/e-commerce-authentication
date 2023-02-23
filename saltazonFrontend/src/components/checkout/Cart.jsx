import CartItem from './CartItem.jsx';

let sumOfItems = 0;

function Cart({products, removeFromCart}) {
  if (products.length === 0) {
    return <h3>No items in cart, why not add some?</h3>
  }

  sumOfItems = products.reduce((acc, p) => {
    const price = parseFloat(p.price.replace('$', ''));
    const amount = p.amount;
    return acc + (price * amount);
  }, 0);

  return (
      <div>{
        products
            .map((p) => {
              return (
                  <CartItem 
                      key={p.id}
                      product={p}
                      removeFromCart={removeFromCart}/>
              )
            })
      }
      <h3>Total price for items: ${sumOfItems.toFixed(2)}</h3>
      </div>)
}

export default Cart;