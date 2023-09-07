import axios from 'axios';

//REACT_APP_BASE_ENDPOINT: ecommerce-app/client/.env dosyası

// Add a request interceptor
//bu token'i birden fazla fonksiyonda kullanacağımız için herbir
//fonksiyonda tek tek eklemek yerine tüm fonksiyonlara burada ekliyoruz
//token'i kullanıcı login olduğunda(AuthContext login()) localStorage'a 
//atıyoruz ve burada onu getiriyoruz
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log(config.url);
  const token = localStorage.getItem("access-token");
  config.headers.authorization = token;

  return config;
},
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  });



//ürünleri backend'den getirtip data objesi ile client'e return ediyoruz
//ürünler mongodb'den getirtilir
//ürünleri "pageParam" değerine yani sayfa sayısına göre getirtiyoruz
//pageParam=1 ise db'deki ilk 9 ürünü,
//pageParam=2 ise db'deki ikinci 9 ürünü,
//pageParam=3 ise db'deki 18-23 arasındaki 5 ürünü getirtiriz.
export const fetchProductList = async ({ pageParam }) => {
  const { data } = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/product?page=${pageParam}`)
  return data;
}

//ilgili ürünü id'sine göre backend'den getirtip data objesi ile client'e return ediyoruz
//ürünler mongodb'den getirtilir
export const fetchProduct = async (id) => {
  const { data } = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/product/${id}`)
  return data;
}

//register olan kullanıcı email ve password bilgisi client'ten backend'e post edilir
//kullanıcı backend ile mongodb'ye kaydedilir
export const fetchRegister = async (input) => {
  const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/register`, input);

  return data;
};

//login olan kullanıcı email ve password bilgisi client'ten backend'e gönderilir
//backend'de kullanıcının daha önceden register olup olmadığı kontrol edilir
//eğer register olmuşsa çekilen response data return edilir
//kullanıcı email veya şifreyi yanlış girerse ekranda hata mesajı alır
export const fetchLogin = async (input) => {
  const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/login`, input);
  return data;
}



/* buradaki endpoint'i birden fazla yerde kullanacağımız için header'i 
tek tek eklemek yerine en yukarıya tanımlıyoruz 
export const fetchMe = async () => {
  const {data} = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/me`,  {headers:{
    'Authorization': localStorage.getItem('access-token')
  }});
  return data;
}
*/

//o an login olmuş olan kullanıcı backend'en client'e return edilir
//header:authorization bilgisi en yukarıda
export const fetchMe = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/me`);
  return data;
}

//o an logout olmuş olan kullanıcının refresh-token bilgisi client'ten backend'e gönderilir
//o refres-token'a sahip olan kullacı redis üzerinden silinir ??
export const fetchLogout = async () => {
  const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/auth/logout`,
    {
      refresh_token: localStorage.getItem('refresh-token'),
    }
  );

  return data;
}

//basket sayfasında order butonuna basıp adres giren kullanıcının seçtiği ürünler
//ve adres bilgisi input ile alınır ve sipariş yapılması için backend'e gönderilir
export const postOrder = async (input) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BASE_ENDPOINT}/order`,
    input);
  return data;
}

//adimn/orders sayfasına backend'den tüm order'lar getirilir
export const fetchOrders = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_BASE_ENDPOINT}/order`)
  return data;
}

//admin/products sayfasında delete butonu ile seçilen ürün backend'den silinir
export const deleteProduct = async (product_id) => {
  const { data } = await axios.delete(`${process.env.REACT_APP_BASE_ENDPOINT}/product/${product_id}`)
  return data;
}

//admin/products sayfasında edit butonuna basılıp AdminProductDetail sayfasına gidilir
//orada admin ürün bilgilerini günceller
//güncellenen değer ve ürün id'si alınır ve bu fonksiyon ile backend'de güncellenir
export const updateProduct = async (input, product_id) => {
  const { data } = await axios.put(`${process.env.REACT_APP_BASE_ENDPOINT}/product/${product_id}`, input)
  return data;
}

//admin/products sayfasında "+ New Product" butonuna basıldığında AdminProducts 
//altındaki NewProduct sayfasına gidilir
//orada admin yeni ürün bilgilerini girer
//ürün bilgileri alınır ve kaydetmek üzere backend'e post edilir
export const postProduct = async (input) => {
  const { data } = await axios.post(`${process.env.REACT_APP_BASE_ENDPOINT}/product/`, input);
  return data;
}