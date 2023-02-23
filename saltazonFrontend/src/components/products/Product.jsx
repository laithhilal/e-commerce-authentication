import './Product.css'

function Product({product, addToCart, onClick}) {
    
    return (
        <div>
            <article className={"product_item"} onClick={onClick}>
                <section className={"text_section"}>
                    <h1>
                        {product.title}
                    </h1>
                    <h2>
                        {product.description}
                    </h2>
                </section>
                <img src={product.imageUrl} alt={"picture of product"}/>
            </article>
            <button className='addtocart' onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
    )
}

export default Product;