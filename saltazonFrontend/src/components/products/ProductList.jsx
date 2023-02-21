import Product from './Product.jsx';
import "../../App.css"
import CategorySorter from "./CategorySorter.jsx";
import React, { useState, useEffect } from 'react';

const sorted = false;
const PAGE_SIZE = 5;

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
    const [currentPage, setCurrentPage] = useState(1);

    let sortedProducts;
    if (sorted) {
        sortedProducts = sortByCategory(products);
    } else {
        sortedProducts = products;
    }

    const filteredProducts = sortedProducts.filter((product) => {
        return product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    useEffect(() => {
        setCurrentPage(1);
      }, [searchQuery]);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
      
    return (
        <>
            <CategorySorter categories={['First Category', 'Second Category']} sorterFunction={sortSomething}/>
            <div className="search-wrapper">
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </div>
            <section className={"product_list"}>{
                paginatedProducts
                    .map((p) => {
                        return (
                            <Product key={p.id}
                                     product={p}
                                     addToCart={addToCart}/>)
                    })
            }
            </section>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </>
    )
}

export default ProductList;