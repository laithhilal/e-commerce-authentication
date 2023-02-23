import AdminProductList from "./products/AdminProductList.jsx";
import {fakeProducts} from "../fakedata/fakedata.js";

function AdminPage({ products }) {
    const currentStore = "Salt store number 2";
    return (
        <>
            <header>
                Welcome to the {currentStore}
            </header>
            <AdminProductList products={products} storeName={currentStore} />
        </>
    )
}

export default AdminPage;