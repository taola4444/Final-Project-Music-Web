import axios from "axios";
const baseURL = "http://localhost:4000/";
var qs = require('qs');

export const validateUser = async (token) => {
    try {
        const res = await axios.get(`${baseURL}api/users/login`,{
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return res.data;
    } catch (error) {
        return null
    }
}

export const deleteUserFirebase = async (uid) => {
    try {
        const res = await axios.delete(`${baseURL}api/users/deleteFirebase/${uid}`)
        return res;
    } catch (error) {
        return null
    }
}

export const getAllUser = async () => {
    try {
        const res = await axios.get(`${baseURL}api/users/getUsers`);
        return res.data;
    } catch (error) {
        
    }
}

export const getAllArtist = async () => {
    try {
        const res = await axios.get(`${baseURL}api/artists/getAll`);
        return res.data;
    } catch (error) {
        
    }
}

export const getAllAlbum = async () => {
    try {
        const res = await axios.get(`${baseURL}api/albums/getAll`);
        return res.data;
    } catch (error) {
        
    }
}

export const getAllSong = async () => {
    try {
        const res = await axios.get(`${baseURL}api/songs/getAll`);
        return res.data;
    } catch (error) {
        
    }
}

export const changeingUserRole = async (userId,role) => {
    try {
        const res = await axios.put(`${baseURL}api/users/updateRole/${userId}`,{
            data: {
                role: role
            }
        });
        return res;
    } catch (error) {
        
    }
}

export const removeUser = async (userId) => {
    try {
        const res = axios.delete(`${baseURL}api/users/delete/${userId}`);
        return res;
    } catch (error) {
        
    }
}

export const saveNewSong = async (data) => {
    try {
        const res = axios.post(`${baseURL}api/songs/save`,data);
        return res;
    } catch (error) {
        return null;
    }
}

export const saveNewArtist = async (data) => {
    try {
        const res = axios.post(`${baseURL}api/artists/save`,data);
        return res;
    } catch (error) {
        
    }
}

export const saveNewAlbum = async (data) => {
    try {
        const res = axios.post(`${baseURL}api/albums/save`,data);
        return res;
    } catch (error) {
        
    }
}

export const deleteSong = async (id) => {
    try {
        const res = axios.delete(`${baseURL}api/songs/delete/${id}`);
        return res;
    } catch (error) {
        
    }
}

export const deleteAlbum = async (id) => {
    try {
        const res = axios.delete(`${baseURL}api/albums/delete/${id}`);
        return res;
    } catch (error) {
        
    }
}

export const deleteArtist = async (id) => {
    try {
        const res = axios.delete(`${baseURL}api/artists/delete/${id}`);
        return res;
    } catch (error) {
        
    }
}

export const editSong = async (id,data) => {
    try {
        const res = axios.put(`${baseURL}api/songs/update/${id}`,data);
        return res;
    } catch (error) {
        return null;
    }
}

export const editArtist = async (id,data) => {
    try {
        const res = axios.put(`${baseURL}api/artists/update/${id}`,data);
        return res;
    } catch (error) {
        return null;
    }
}

export const editAlbumApi = async (id,data) => {
    try {
        const res = axios.put(`${baseURL}api/albums/update/${id}`,data);
        return res;
    } catch (error) {
        return null;
    }
}

export const editUserApi = async (id,data) => {
    try {
        const res = axios.put(`${baseURL}api/users/updateUser/${id}`,data);
        return res;
    } catch (error) {
        return null;
    }
}

export const getUserById = async (id) => {
    try {
        const res = axios.get(`${baseURL}api/users/getUserById/${id}`);
        return res;
    } catch (error) {
        return null;
    }
}

export const registerPayPal = async () => {
    try {
        const res = axios.post(`${baseURL}paypal/pay`,{
            header: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        return res;
    } catch (error) {
        
    }
}

export const registerPayPalSuccess = async (PayerID,paymentId) => {
    try {
        const res = await axios.get(`${baseURL}paypal/success/${PayerID}&${paymentId}`);
        return res;
    } catch (error) {
        
    }
}

export const refundPaypal = async (id_refund) => {
    console.log(id_refund);
    try {
        const res = await axios.post(`${baseURL}paypal/refund`, {
            data: {
                id_refund: id_refund
            }
        });
        return res;
    } catch (error) {
        
    }
}

export const changeRoleAndRefundID = async (userId,role,id_refund,payer_id,create_time,amount) => {
    try {
        const res = await axios.put(`${baseURL}api/users/updateRoleAndRefund/${userId}`,{
            data: {
                role: role,
                id_refund: id_refund,
                payer_id: payer_id,
                create_time: create_time,
                amount: amount
            }
        });
        return res;
    } catch (error) {
        
    }
}

export const addFavourite = async (userId,id_song) => {
    try {
        const res = await axios.put(`${baseURL}api/users/favourites/${userId}?song_id=${id_song}`);
        return res;
    } catch (error) {
        
    }
}

export const removeFavourite = async (userId,id_song) => {
    try {
        const res = await axios.put(`${baseURL}api/users/removeFavourites/${userId}?song_id=${id_song}`);
        return res;
    } catch (error) {
        
    }
}

export const getUserFavorite = async (userId) => {
    try {
        const res = await axios.get(`${baseURL}api/users/getUser/${userId}`);
        return res.data;
    } catch (error) {
        
    }
}

export const getMyFavourite = async (song_id) => {
    try {
        const res = await axios.get(`${baseURL}api/songs/getFavouritesSongs?songId=${song_id}`);
        return res.data;
    } catch (error) {
        
    }
}

export const registerEmailAndPassword = async (data) => {
    try {
        const res = await axios.post(`${baseURL}api/users/register`,{
            data: data
        });
        return res.data;
    } catch (error) {
        
    }
}

export const loginWithEmailAndPassword = async (email,password,user_id) => {
    try {
        const res = await axios.get(`${baseURL}api/users/loginWithEmailAndPassword/${email}&${password}&${user_id}`)
        return res.data;
    } catch (error) {
        return null
    }
}

export const changePassword = async (userId,password) => {
    try {
        const res = await axios.put(`${baseURL}api/users/changePassword/${userId}&${password}`)
        return res.data;
    } catch (error) {
        return null
    }
}

export const getBalance = async (accessToken,date) => {
    
    try {
        const res = await axios.get(`https://api-m.sandbox.paypal.com/v1/reporting/balances?as_of_time=${date}T00:00:00.000Z&currency_code=USD&include_crypto_currencies=true`,{
            headers: { 
                'Authorization': 'Bearer ' + accessToken
            }
        });
        return res.data
    } catch (error) {
        console.log(error);
    }
} 

export const getAccessToken = async () => {
    var data = qs.stringify({
      'grant_type': 'client_credentials',
      'ignoreCache': 'true',
      'return_authn_schemes': 'true',
      'return_client_metadata': 'true',
      'return_unconsented_scopes': 'true' 
    });
    var config = {
      method: 'post',
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      headers: { 
        'Authorization': 'Basic QWNoWDF2X01NOHEzWEg1REZOdHhmblQ2cEYyOXVvQVJsN0hPdkduaWVYRHRZUnRvVXZIUS1mMThPdmhSVTFJeEJXUFRGTlV6S2lqaVdTZUQ6RUdndjVCUkhNUnFVYzkxZ09pTHFuZ2lQM21EdGhvRU9iV3FWdzd0bHQ4Ui1oV3NZVDBiUWJTRWtRRmNwMnh1U3hJTWhBeDdXVlBudHMyaUM=', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };

    const res = axios(config);
    return res

} 