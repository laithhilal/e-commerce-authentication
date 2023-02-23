import './Cart.css';
function CartItem({product, removeFromCart}) {

  const price = product.price;
  const newPrice = price.replace('$', '')
  const amount = product.amount;
  const totalPrice = parseFloat(newPrice) * amount;
  return (
      <article className={"cart_item"}>
        <img src={product.imageUrl} alt={"picture of product"}/>
        <section className={"text_section"}>
          <h2>
            {product.title}
          </h2>
          <h3>Quantity: {product.amount}</h3>
          <h3>Item Price: {product.price}</h3>
          <h3>TotalPrice: ${totalPrice}</h3>
        </section>
        <button onClick={() => removeFromCart(product.id)}>Remove from Cart</button>
      </article>
  )
}

export default CartItem;