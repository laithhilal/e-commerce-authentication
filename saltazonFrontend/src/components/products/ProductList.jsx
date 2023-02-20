import Product from './Product.jsx';
import "../../App.css"
import CategorySorter from "./CategorySorter.jsx";
import React, { useState } from 'react';

const sorted = false;

function sortByCategory(products) {
    console.log(products)
    return products.sort(compareProductCategory);
}

function compareProductCategory(a, b) {
    if (a.category < b.category) {
        return -1;
    }
    if (a.category > b.category) {
        return 1;
    }
    return 0;
}

function sortSomething(category) {
    console.log('sorting things would be cool' + category);
}

function ProductList({products, addToCart}) {
    const [searchQuery, setSearchQuery] = useState('');

    let sortedProducts;
    if (sorted) {
        sortedProducts = sortByCategory(products);
    } else {
        sortedProducts = products;
    }

    const filteredProducts = sortedProducts.filter((product) => {
        return product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
      
    return (
        <>
            <CategorySorter categories={['First Category', 'Second Category']} sorterFunction={sortSomething}/>
            <div className="search-wrapper">
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </div>
            <section className={"product_list"}>{
                filteredProducts
                    .map((p) => {
                        return (
                            <Product key={p.id}
                                     product={p}
                                     addToCart={addToCart}/>)
                    })
            }
            </section>
        </>)
}

export default ProductList;