const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/users"

  export const users = {

    createuser: async (firstname, lastname, email, pass, phone, national_id, aacc) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`${phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"PROPIETARIO"
           
        };
        
        console.log(user)
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },


    createtenant: async (firstname, lastname, email, pass, phone, national_id, aacc) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`${phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"INQUILINO"
           
        };
        console.log(user)
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                
                body: JSON.stringify(user)
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
      loginguser: async (email, pass) => {

        let user = {
             "email": `${email}`, "password": `${pass}`
        };
        
        try {
            const request = await fetch(`${Url}/login`, {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const response = await request.json();
            
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    privateareauser: async (token) => {
        try {
            const request = await fetch(`${Url}/private`, {
                method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
               
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUser: async (id) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
                method: "GET"
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUserContractsCount: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts/count`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUserContracts: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    getUserApartmentsCount: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments/count`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    getUserApartments: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    getUserApartmentsNotRented: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments/notrented`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    get_asociation: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts/assoc`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    delete_tenant: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
                  method: "DELETE", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    
    forgotPassword: async (email) => {
        let mail = {"email":email}
        try {
            const request = await fetch(`${Url}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mail),
            });
            console.log(mail)
            
            const response = await request.json();
            return  response;

        } catch (error) {
            console.error("Error al solicitar restablecimiento:", error);
            return { error };
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const request = await fetch(`${Url}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const response = await request.json();

            return { message: response.message, success: request.ok };

        } catch (error) {
            console.error("Error al restablecer contraseña:", error);
            return { message: "Error de conexión. Intenta más tarde.", success: false };
        }
    },
createtenant: async (firstname, lastname, email, pass, phone, national_id, aacc, token) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`$ {phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"INQUILINO"
           
        };
        console.log(user)
        try {
            const request = await fetch(`${Url}/create/tenant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer  ${token}`
                },
                
                body: JSON.stringify(user)
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    sendTenantInvite: async (firstname, lastname, email, pass, phone, national_id, aacc, token) => {
         let tenantData= {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`$ {phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"INQUILINO"
           
        };
        try {
            const request = await fetch(`${Url}/register-tenant-initiate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(tenantData),
            });
            const response = await request.json();
            return response
        } catch (error) {
            console.error("Error al enviar invitación de inquilino:", error);
            return { success: false, message: "Error de conexión al enviar invitación." };
        }
    },

    setTenantInitialPassword: async (token, newPassword) => {
        try {
            const request = await fetch(`${Url}/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword }),
            });
            const response = await request.json();

            if (!request.ok) {
                return { success: false, message: response.message || response.msg || "Error al configurar la contraseña." };
            }
            return { success: true, message: response.message || "Contraseña configurada exitosamente." };
        } catch (error) {
            console.error("Error al configurar contraseña del inquilino:", error);
            return { success: false, message: "Error de conexión. Intenta más tarde." };
        }
    },
};