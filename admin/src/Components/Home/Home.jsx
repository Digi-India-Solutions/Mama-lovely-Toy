import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Header from '../Header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import AllUser from '../../Pages/Users/AllUser'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'

import Login from '../Auth/Login'
import ErrorPage from '../../Pages/Error/ErrorPage'
import AllEnquiry from '../../Pages/Enquiry/AllEnquiry'
import AllNews from '../../Pages/News/AllNews'
import AddNews from '../../Pages/News/AddNews'
import EditNews from '../../Pages/News/EditNews'
import AllColor from '../../Pages/Color/AllColor'
import AllSizes from '../../Pages/Sizes/AllSizes'
import Category from '../../Pages/Category/Category'
import AllSubCategory from '../../Pages/SubCategory/AllSubCategory'
import AddCategory from '../../Pages/Category/AddCategory'
import EditCategory from '../../Pages/Category/EditCategory'
import AddSubCategory from '../../Pages/SubCategory/AddSubCategory'
import EditSubCategory from '../../Pages/SubCategory/EditSubCategory'
import AddProduct from '../../Pages/Product/AddProduct'
import AllProduct from '../../Pages/Product/AllProduct'
import EditProduct from '../../Pages/Product/EditProduct'
import AllBanner from '../../Pages/Banner/AllBanner'
import AddBanner from '../../Pages/Banner/AddBanner'
import EditBanner from '../../Pages/Banner/EditBanner'
import AllOrders from '../../Pages/Orders/AllOrders'
import UpdateOrder from '../../Pages/Orders/UpdateOrder'


const Home = () => {

  const mamaLovelyToyToken = sessionStorage.getItem("mamaLovelyToyToken")
  // console.log(mamaLovelyToyToken);
  return (
    <>

    {mamaLovelyToyToken ? (
      <>
        <Header/>
      <div className="rightside">
        <Routes>
          <Route path={"/dashboard"} element={<Dashboard/>}/>

          <Route path={"/all-colors"} element={<AllColor/>}/>
          <Route path={"/all-sizes"} element={<AllSizes/>}/>

          <Route path={"/all-products"} element={<AllProduct/>}/>
          <Route path={"/add-product"} element={<AddProduct/>}/>
          <Route path={"/edit-product/:_id"} element={<EditProduct/>}/>

          <Route path={"/all-category"} element={<Category/>}/>
          <Route path={"/add-category"} element={<AddCategory/>}/>
          <Route path={"/edit-category/:_id"} element={<EditCategory/>}/>

          <Route path={"/all-subcategory"} element={<AllSubCategory/>}/>
          <Route path={"/add-subcategory"} element={<AddSubCategory/>}/>
          <Route path={"/edit-subcategory/:_id"} element={<EditSubCategory/>}/>

          <Route path={"/all-banners"} element={<AllBanner/>}/>
          <Route path={"/add-banner"} element={<AddBanner/>}/>
          <Route path={"/edit-banner/:_id"} element={<EditBanner/>}/>
       
          <Route path={"/all-users"} element={<AllUser/>}/>

          <Route path={"/all-orders"} element={<AllOrders/>}/>
          <Route path={"/edit-order/:_id"} element={<UpdateOrder/>}/>

          {/* --- Vouchers --- */}
          <Route path={"/all-voucher"} element={<AllVoucher/>}/>   {/* // All Vouchers */}
          <Route path={"/add-voucher"} element={<CreateVoucher/>}/>


          {/* --- News --- */}
         <Route path={"/all-news"} element={<AllNews/>}/>
         <Route path={"/add-news"} element={<AddNews/>}/>
         <Route path={"/edit-news/:id"} element={<EditNews/>}/>


          <Route path={"/all-enquiry"} element={<AllEnquiry/>}/>
          <Route path={"/*"} element={<ErrorPage/>}/>
        </Routes>
      </div>
      </>
    ) : (
      <Routes>
        <Route path={"/"} element={<Login/>}/>
        <Route path={"/*"} element={<ErrorPage/>}/>
      </Routes>
    )}
    
      

    </>
  )
}

export default Home