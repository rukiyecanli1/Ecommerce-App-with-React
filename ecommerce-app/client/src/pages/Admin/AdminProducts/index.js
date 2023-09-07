import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, QueriesObserver, QueryClient } from 'react-query';
import { fetchProductList, deleteProduct } from '../../../api'
import { Text, Button, Flex } from '@chakra-ui/react'
import { Table, Popconfirm } from 'antd'
import { Link } from 'react-router-dom';

function AdminProducts() {

  const queryClient = useQueryClient();

  //useQuery ile ürünleri api aracılığıyla backend'den çekiyoruz
  const { isLoading, isError, data, error } = useQuery('admin: products', fetchProductList);

  //useMutation hook ile silme, güncelleme gibi işlemler yapılır
  //burada backend'den ürün silme işlemi yapıyoruz
  const deleteMutation = useMutation(deleteProduct);

  //refetchQueries ile ürün silindikten sonra güncellenmiş listeyi tekrar çekebilirdik
  //bunu onSucces'De invalidateQueries fonksiyonuyla yaptığımız için buna gerek kalmadı
  /* const deleteMutation = useMutation(deleteProduct, {
     refetchQueries :  ["admin: products"],
   })
  */

  //ekranda ürün listesi oluşturuyoruz
  //columns ile kolon adlarını, dataSource ile ürün bilgilerini ifade ediyoruz
  //ekranda gösterilecek columns sadece bir kere oluşturulsun 
  //her render edildiğinde oluşturulmasın diye diye useMemo kullanıyoruz
  const columns = useMemo(() => {
    return [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },

      /*Her satırda edit ve delete butonları oluşturuyoruz
      admin delete butonuna basarsa "emin misiniz mesajı alır
      evet cevabını verirse ürün silinir ve ürün listesi yenilenir */
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>

            {/*Admin edit butonuna bastığında "<AdminProductDetail/>" componenti açılır
          bu linkin o komponente gideceğini app.js'de belirlemiştik*/}
            <Link to={`/admin/products/${record._id}`}>Edit</Link>
            <Popconfirm
              title={"Are you sure?"}
              onConfirm={() => {
                deleteMutation.mutate(record._id, {
                  onSuccess: () => {
                    console.log("deleted");
                    //ürün liste güncelleme işlemi burada yapılır
                    //bir önceki ürün çekme fonkisyonundan dönen liste geçersiz sayılır 
                    //ve fonksiyon yeniden çalıştırılıp güncellemiş liste döndürülür
                    queryClient.invalidateQueries("admin:products");
                    // Sayfa yeniden yüklenir
                    window.location.reload();
                  },
                });
              }}
              onCancel={() => console.log("cancelled")}
              okText={"Yes"}
              cancelText={"No"}
              placement={"left"}
            >
              {/* href="#" ifadesi, kullanıcı bu bağlantıya tıkladığında 
                sayfanın en üstüne geri dönecektir.*/}
              <a href="#" style={{ marginLeft: 10 }}>
                Delete
              </a>
            </Popconfirm>
          </>
        ),
      },
    ];
  }, []);

  //ürünler yükleniyorsa
  if (isLoading) {
    return <div>
      Loading...
    </div>
  }

  //yüklenirken bir hata olduysa
  if (isError) {
    return <div>
      Error {error.message}
    </div>
  }

  console.log(data)



  return (
    <div>

      <Flex justifyContent="space-between" alignItems="center">

        <Text fontSize="2xl" p="5">Products</Text>

        <Link to="/admin/products/new">
          <Button >+ New product</Button>
        </Link>

      </Flex>

      <Table dataSource={data} columns={columns} rowKey={"_id"}></Table>
    </div>
  );
}

export default AdminProducts;
