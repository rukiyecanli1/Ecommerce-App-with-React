import React from 'react';
import { postProduct } from '../../../api';
import { useMutation, useQueryClient } from 'react-query';
import { Text, Box, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react'
import { FieldArray, Formik } from 'formik'
import validationSchema from './validation'
import { message } from 'antd'

//admin products sayfasında "+New product" butonuna basarsa
//bu sayfa açılır, admin yeni ürün ekleyebilir
function NewProduct() {

    const queryClient = useQueryClient();

    //useMutation hook ile silme, güncelleme gibi işlemler yapılır
    //burada backend'e yeni ürün ekleme işlemi yapıyoruz
    const newProductMutation = useMutation(postProduct, {
        onSuccess: () => {
            //ürün liste güncelleme işlemi burada yapılır
            //bir önceki ürün çekme fonkisyonundan dönen liste geçersiz sayılır 
            //ve fonksiyon yeniden çalıştırılıp güncellemiş liste döndürülür
            queryClient.invalidateQueries("admin-products");
            // Sayfa yeniden yüklenir
            // window.location.reload()
        }
    });

    //admin ürün bilgilerini girip "Save" butonuna bastığında
    //bu fonksiyon çalışır
    //girilen değerler parametre olarak alınır
    const handleSubmit = async (values, bag) => {
        console.log("suvbmitted")
        console.log(values)

        //butona bastıktan sonra admine "loading..." mesajı gösterilir
        message.loading({ content: "Loading...", key: "product_save" })



        //postProduct fonksiyonuna fotoğrafları string olarak göndermek gerektiğinden
        //values.photos değerini JSON.stringify ile string'e dönüştürdük
        //fakat bu sayfada fotoğrafların adreslerinin gösterilebilmesi için 
        //values.photos'un orijinal halinde yani dizi olarak kalması gerekir
        //values.photos = JSON.stringify(values.photos)
        //console.log(values)

        //bu yüzden yeni bir değer oluşturduk ve bu değere önceki değerleri
        //ve string'e dönüştürülmüş fotoğraf adreslerini atadık ardından
        //bu yeni değeri postProduct fonksiyonuna parametre olarak verdik
        const newValues = {
            ...values,
            photos: JSON.stringify(values.photos)
        }


        // console.log(newValues)

        //api.js'teki postProduct fonksiyonu ile ürün backend'e post edilir
        try {
            newProductMutation.mutate(newValues, {
                onSuccess: () => {
                    console.log("saved");
                    //save işlemi başarılıysa başarılı olduğuna dair mesaj gösterilir
                    message.success({
                        content: "The product has been saved successfully!",
                        key: "product_save",
                        duration: 2,
                    })

                },
            });

            //post işlemi gerşekleşirken bir hata oluştuysa hatalı olduğuna dair mesaj gösterilir
        } catch (e) {
            message.error("The product could not been saved")
        }


    }


    return (
        <div>
            <Text mt="17" fontSize="2xl" >New Product</Text>

            <Formik
                //form açıldığında gösterilecek ilk değerler
                initialValues={{
                    title: "",
                    description: "",
                    price: "",
                    photos: []
                }}

                //validasyon şeması tanımlanır
                validationSchema={validationSchema}

                //admin "Save" butonuna bastığında "handleSubmit" fonksiyonu çağrılır
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
                                            //save butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
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
                                            //save butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
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
                                            value={values.pricw}
                                            //save butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
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
                                                                    //save butonuna basıldığında "isSubmitting=true olur, formda değişim engellenir"
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
                                        Save
                                    </Button>
                                </form>
                            </Box>

                        </>
                }


            </Formik>

        </div>
    );
}

export default NewProduct;
