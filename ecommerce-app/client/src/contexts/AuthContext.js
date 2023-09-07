import { useState, createContext, useEffect, useContext } from 'react';
import { fetchLogout, fetchMe } from '../api';
import { Flex, Spinner } from '@chakra-ui/react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    //sayfa her yenilendiğinde login olma durumuna true atanır.
    //eğer bu yapılmazsa sayfa yenilendiğinde LoggedIn için default değer
    //false olduğundan kayıt olmuş olan bi kullanıcı register sayfasını tekrargörecek
    //ve o an giriş yapan kullanıcı fetchMe'den getirilip setUser ile ayarlanır
    useEffect(() => {
        (async () => {
            try {
                const me = await fetchMe();
                setLoggedIn(true);
                setUser(me);
                //load olma işlemi durdurulur
                setLoading(false);
                console.log("me", me)
            } catch (e) {
                setLoading(false);
            }
        })()
    }, [])

    //kullanıcı Signup butonuyla kayıt olduğunda burası çalışır
    const login = (data) => {
        setLoggedIn(true);
        console.log(LoggedIn);
        setUser(data.user);

        //o an login olmuş olan kullanıcı token'leri websitesi yenilendiğinde 
        //ulaşılabilmek için localStorage'a atanır
        localStorage.setItem('access-token', data.accessToken)
        localStorage.setItem('refresh-token', data.refreshToken)
    }

    //kullanıcı Logout butonuyla çıkış yaptığında burası çalışır
    const logout = async () => {
        setLoggedIn(false);
        setUser(null);

        await fetchLogout();

        //o an logout olmuş olan kullanıcı token'leri localStorage'dan kaldırılır
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");

    }

    const values = {
        LoggedIn,
        user,
        login,
        logout
    }

    //o an  load olma işlemi true ise yani devam ediyorsa ortada bir ikon gösterilir
    if (loading) {
        return <Flex justifyContent="center" alignItems="center" height="100vh">
            <Spinner thickness='4px' speed="0.65s" emptyColor='gray.200' size="xl" color="red.500"></Spinner>
        </Flex>
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export {
    AuthProvider, useAuth
}
