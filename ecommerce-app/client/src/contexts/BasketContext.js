import { useState, createContext, useContext, useEffect } from 'react'

const BasketContext = createContext();

//sayfayı yenilediğimizde sepetteki ürünler gittiği için
//ürünleri localStorage'a atıyoruz
//basket isimli localStorage nesnesi boşsa defaultBasket'e boş bir array atanır
const defaultBasket = JSON.parse(localStorage.getItem('basket')) || []

const BasketProvider = ({ children }) => {

    const [items, setItems] = useState(defaultBasket);

    //items'de her değişiklik olduğunda(sepete ekleme veya sepetten kaldırma yapıldığında) 
    //basket isimli localStorage nesnesi set edilir
    useEffect(() => {
        localStorage.setItem('basket', JSON.stringify(items));
    }, [items])

    const setBasket = (product, FoundItemInBasket) => {
        //eğer ürün sepette yoksa ekleme yapılır
        if (!FoundItemInBasket) {
            setItems((items) => [product, ...items])
            //not:  bu iki fonksiyonla da ürün listeye eklenir:
            //"setItems((items) => [ ...items, product])",  "setItems((items) => [product, ...items])""
            //fakat farklı olarak birinde ürün dizinin sonuna diğerinde ise listenin başına eklenir
            //bu projede ürün sırasıyla ilgili bir durum olmadığı için dilediğimizi kullanabiliriz
        }
        //sepette varsa items filtrelenir ve filtreli hali set edilir
        //filter ile eklenmiş olanların haricindekiler bulunup filtered'e atanır
        else {
            const filtered = items.filter((item) => item._id !== FoundItemInBasket._id)
            setItems(filtered);
        }
    }

    /* Basket sayfasında ürünü sepetten kaldırmak için bu fonksiyonu kulanabilirdik
    fakat setBasket ile bunu sağlattığım için bu fonksiyona ihtiyaç kalmadı
    const removeFromBasket = (itemInBasket_id) => {
        const filtered = items.filter((item) => item._id !== itemInBasket_id)
       setItems(filtered);
    }
    */

    //kullanıcı sipariş verdikten sonra sepet boşaltılır
    const emptyBasket = () => setItems([]);

    const values = {
        items,
        setItems,
        setBasket,
        emptyBasket
    };


    return (
        <BasketContext.Provider value={values}>{children}</BasketContext.Provider>
    )
};

const useBasket = () => useContext(BasketContext);

export { BasketProvider, useBasket };