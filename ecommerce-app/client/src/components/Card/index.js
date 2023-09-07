import { Box, Image, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useBasket } from "../../contexts/BasketContext";

function Card({ item }) {

  const { setBasket, items } = useBasket();

  //sepete eklenecek olan ürünün sepette olup olmadığı kontrol edilir
  //varsa değişkene o ürün atanır yoksa "undefined" atanır
  const isFoundItemInBasket = items.find((basket_item) => basket_item._id === item._id)

  return (
    <Box borderWidth="1px" borderRadius="lg" overfow="hidden" p="3">
      <Link to={`/product/${item._id}`}>
        <Image src={item.photos[0]} alt="product" loading="lazy" />
        <Box p="6">
          <Box d="flex" alignItems="baseLine">
            {moment(item.createdAt).format("DD/MM/YYYY")}
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            {item.title}
          </Box>
          <Box>
            {item.price}
          </Box>
        </Box>
      </Link>
      <Button
        colorScheme={isFoundItemInBasket ? 'green' : 'pink'} variant="solid"
        onClick={() => setBasket(item, isFoundItemInBasket)}>
        {isFoundItemInBasket ? "Remove from basket" : "Add to basket"}
      </Button>
    </Box>
  );
}

export default Card;
