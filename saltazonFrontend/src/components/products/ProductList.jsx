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

function sortSomething(category, products, setFilteredProducts) {
    console.log('sorting things would be cool' + category);
    const filteredProducts = products.filter((product) => {
        return product.category === category;
    });
    setFilteredProducts(filteredProducts);
}

function ProductList({products, addToCart}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(products);

    let sortedProducts;
    if (sorted) {
        sortedProducts = sortByCategory(products);
    } else {
        sortedProducts = products;
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    useEffect(() => {
        const filteredProducts = products.filter((product) => {
            return product.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredProducts(filteredProducts);
    }, [searchQuery, products]);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const handleProductClick = (productId) => {
        const product = products.find((p) => p.id === productId);
        setSelectedProduct(product);
    };

    const categories = [...new Set(products.map(product => product.category))];

    function handleCategoryChange(category) {
        if (category === 'All') {
            setFilteredProducts(products); // show all products
        } else {
            sortSomething(category, products, setFilteredProducts);
        }
    }


    return (
        <>
        {!selectedProduct && 
            <>
            <CategorySorter categories={['All', ...categories]} sorterFunction={handleCategoryChange}/>
            <div className="search-wrapper">
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </div>
            <section className={"product_list"}>{
                paginatedProducts
                    .map((product) => {
                        return (
                            <Product 
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                                onClick={() => handleProductClick(product.id)}
                            />
                        )
                    })
            }
            </section>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
            </>
        }
        {selectedProduct && 
            <>
          <button className='back-button' onClick={() => setSelectedProduct(null)}>&larr; Back</button>
            <div>
                <Product  
                    key={selectedProduct.id}
                    product={selectedProduct}
                    addToCart={addToCart}/>
            </div>
            </>
        }
        </>
    )
}

export default ProductList;