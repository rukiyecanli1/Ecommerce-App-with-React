import React from 'react';
import { useParams } from 'react-router-dom'
import { fetchProduct, updateProduct } from '../../../api';
import { useQuery } from 'react-query'
import { Text, Box, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react'
import { FieldArray, Formik } from 'formik'
import validationSchema from './validation'
import { message } from 'antd'

//admin ürünün yanındaki "edit" butonuna basınca bu sayfa açılır
function AdminProductDetail() {

  //linkteki product id useParams ile alınır
  const { product_id } = useParams();
  console.log(product_id);

  //product id bilgisine göre backend'den product getirilir
  const { isLoading, isError, data, error } = useQuery(["admin:product", product_id], () =>
    fetchProduct(product_id)
  );

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error!! {error.message}</div>
  }


  //admin ürün ile ilgili değişiklikleri yapıp "update" butonuna bastığında
  //bu fonksiyon çalışır
  //girilen değerler parametre olarak alınır
  const handleSubmit = async (values, bag) => {
    console.log("suvbmitted")

    //butona bastıktan sonra admine "loading..." mesajı gösterilir
    message.loading({ content: "Loading...", key: "product_update" })

    //api.js'teki updateProduct fonksiyonu ile ürün backend'de update edilir
    try {
      await updateProduct(values, product_id);
      //update işlemi başarılıysa başarılı olduğuna dair mesaj gösterilir
      message.success({
        content: "The product has been updated successfully!",
        key: "product_update",
        duration: 2,
      })
      //update işlemi gerşekleşirken bir hata oluştuysa hatalı olduğuna dair mesaj gösterilir
    } catch (e) {
      message.error("The product could not been updated")
    }

  }

  return (
    <div>
      <Text fontSize="2xl">Edit</Text>

      <Formik

        //form açıldığında gösterilecek ilk değerler
        initialValues={{
          title: data.title,
          description: data.description,
          price: data.price,
          photos: data.photos,
        }}

        //validasyon şeması tanımlanır
        validationSchema={validationSchema}

        //admin "update" butonuna bastığında "handleSubmit" fonksiyonu çağrılır
        onSubmit={handleSubmit}
      >

        {
          ({ handleSubmit,
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            isSubmitting
          }) => <>
              <Box>
                <Box my="5" textAlign="left"></Box>
                <form onSubmit={handleSubmit}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      //update butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
                      disabled={isSubmitting}
                      //title kısmında validasyon hatası varsa isInvalid değeri true olur, 
                      //hata ekranda gösterilir ve form submit edilemez
                      isInvalid={touched.title && errors.title}
                    />
                    {touched.title && errors.title && <Text color='red'>{errors.title}</Text>}
                  </FormControl>
                  <FormControl mt="4">
                    <FormLabel>Description</FormLabel>
                    <Textarea name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      //update butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
                      disabled={isSubmitting}
                      //description kısmında validasyon hatası varsa isInvalid değeri true olur, 
                      //hata ekranda gösterilir ve form submit edilemez
                      isInvalid={touched.description && errors.description}
                    />
                    {touched.description && errors.description && <Text color='red'>{errors.description}</Text>}
                  </FormControl>
                  <FormControl mt="4">
                    <FormLabel>Price</FormLabel>
                    <Input name="price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      //update butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
                      disabled={isSubmitting}
                      //price kısmında validasyon hatası varsa isInvalid değeri true olur, 
                      //hata ekranda gösterilir ve form submit edilemez
                      isInvalid={touched.price && errors.price}
                    />
                    {touched.price && errors.price && <Text color='red'>{errors.price}</Text>}
                  </FormControl>

                  <FormControl mt="4">
                    <FormLabel>Photos</FormLabel>
                    <FieldArray name="photos"

                      //fotoğraf linki silme ve ekleme işlemleri
                      render={(arrayHelpers) => (
                        <div>
                          {
                            values.photos && values.photos.map((photo, index) => (
                              <div key={index}>
                                <Input
                                  name={`photos.${index}`}
                                  value={photo}
                                  //update butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
                                  disabled={isSubmitting}
                                  onChange={handleChange}
                                  width="3xl"
                                />
                                <Button ml="4" type="button" colorScheme="red" onClick={() => arrayHelpers.remove(index)}>
                                  Remove
                                </Button>
                              </div>
                            ))
                          }

                          <Button mt="5" onClick={() => arrayHelpers.push('')}>
                            Add a photo
                          </Button>
                        </div>
                      )}
                    />
                  </FormControl>

                  <Button mt="4" width="full" type="submit" isLoading={isSubmitting}>
                    Update
                  </Button>
                </form>
              </Box>

            </>
        }


      </Formik>

    </div>
  );
}

export default AdminProductDetail;
