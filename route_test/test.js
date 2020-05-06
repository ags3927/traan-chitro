let axios = require('axios');

let params = {
    bounds: {
        northeast: {
            lat: 24.510338411688174,
            lng: 90.9214621008292,
        },
        southwest: {
            lat: 22.8544133690995,
            lng: 89.79113789917083,
        },
    },
    filter: {
        orgName: null,
        schedule: 'PAST',
        typeOfRelief: []
    }
};

// let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWE5NmEzMzdmYmFkNjBiYmNmN2MwNTAiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTg4MTYxMTM4fQ.xIIqOdqZjTaSngILv4HIcw1hFt6vhINHijh31Z82wvI';
let token = 'lekhaporaputkirmoddhebhoiradimu';

let headers = {
    'x-auth': token
};

// let orgBody = {
//     orgName: 'Traan Chitro',
//     description: 'A non profit organization to coordinate relief distribution',
//     phone: '+8801816394369',
//     email: 'something@nothing.com',
//     facebook: 'https://www.facebook/com/traanchitro',
//     website: 'https://www.facebook/com/traanchitro',
//     donate: 'https://www.facebook/com/traanchitro'
// };

let userBody = {
    orgName: 'Traan Chitro',
    username: 'traanchitro',
    password: 'traanchitro'
}

// let activityBody = {
//     orgName: 'Tran Chitro',
//     typeOfRelief: ['PPE'],
//     location: {
//         lng: 90.21,
//         lat: 23.04
//     },
//     supplyDate: new Date().setMonth(7),
//     contents: "Food for 250 families worth 1 month",
//     redundant: false
// }

let url = 'https://stormy-lake-20015.herokuapp.com/api/login';
// let url = 'http://localhost:3000/api/login'

axios.post(url, userBody, {
    headers
}).then((res) => {

    console.log('response = ', res.data);

}).catch(e => {

    console.log('error =', e.response.data);

}).finally(() => {
    
    console.log('loaded finished');

});
