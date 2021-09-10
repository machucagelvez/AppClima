const axios = require('axios')

class Busquedas {
    historial = ['Medellín', 'Bucaramanga', 'Bogotá']

    constructor() {
        // TODO: leer DB si existe
    }

    async ciudad(lugar = '') {

        try {
            //Petición http
            //console.log('ciudad', lugar)
            const resp = await axios.get('https://reqres.in/api/users?page=2')
            console.log(resp.data)
            return []
        } catch (error) {
            return []
        }

    }
}




module.exports = Busquedas