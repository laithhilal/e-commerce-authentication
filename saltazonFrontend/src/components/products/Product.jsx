import './Product.css'

function Product({product, addToCart, onClick}) {
    return (
        <div onClick={onClick}>
            <article className={"product_item"}>
                <section className={"text_section"}>
                    <h1>
                        {product.title}
                    </h1>
                    <h2>
                        {product.description}
                    </h2>
                </section>
                <img src={product.imageUrl} alt={"picture of product"}/>
                <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </article>
        </div>
    )
}

export default Product;