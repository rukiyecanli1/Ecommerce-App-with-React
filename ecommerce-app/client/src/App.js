
import './App.css';
import {
  BrowserRouter as Router,
  Routes,

  Route,
} from "react-router-dom";
import Navbar from './components/Navbar'
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Profile";
import Basket from './pages/Basket';
import Error404 from './pages/Error404';
import Admin from './pages/Admin';
import ProtectedRouteAdmin from './pages/ProtectedRouteAdmin';
import ProtectedRouteBasket from './pages/ProtectedRouteBasket';
import ProtectedRouteProfile from './pages/ProtectedRouteProfile';

import Home from './pages/Admin/Home';
import Orders from './pages/Admin/Orders';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminProductDetail from './pages/Admin/AdminProductDetail';
import NewProduct from './pages/Admin/AdminProducts/newProduct';

function App() {
  return (
    <Router>

      <Navbar />
      <div id="content">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:product_id" element={<ProductDetail />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Profile route'u korunumludur
          login olup olunmamasına göre gösterilir */}
          <Route element={<ProtectedRouteProfile />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route element={<ProtectedRouteBasket />}>
            <Route path='/basket' element={<Basket />} />
          </Route>

          {/* hiçbir şeyle eşleşmezse*/}
          <Route path="*" element={<Error404 />} />

          {/* Admin sayfası korunumludur
          sadecd rolu admin olan kullanıcılar erişebilir
          Ayrica admin sayfasında 3 route bulunmaktadır:
          admin/home
          admin/orders
          admin/products
          route'lara tıklansa bile ekranda gözükeceklerinden 
          şu şekilde bir yapı kullanılabilir: 
          (kaynak video: https://www.youtube.com/watch?v=PWi9V9d_Jsc)*/}
          <Route element={<ProtectedRouteAdmin />}>
            <Route path='admin' element={<Admin />}>
              <Route path='home' element={<Home />} />
              <Route path='orders' element={<Orders />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path="products/:product_id" element={<AdminProductDetail />} />
              <Route path='products/new' element={<NewProduct />} />
            </Route>
          </Route>


        </Routes>
      </div>

    </Router>
  );
}

export default App;

