const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/contracts";


 export const contracts = {

    create_contract: async (start, end, document, owner_id, token) => {
    console.log("Subiendo contrato a Cloudflare R2...");
    
   
    if (!document || !document.name.toLowerCase().endsWith('.pdf')) {
        console.error("Error: Solo se permiten archivos PDF");
        return { error: "Formato no válido. Solo se aceptan PDFs" };
    }

    const formData = new FormData();
    formData.append("start_date", start);
    formData.append("end_date", end);
    formData.append("document", document); 
    formData.append("owner_id", owner_id);

    try {
        const response = await fetch(`${Url}/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del backend:", errorData.error);
            return { error: errorData.error || "Error en el servidor" };
        }

        return await response.json(); // { message, file_url, contract }

    } catch (error) {
        console.error("Error de red:", error);
        return { error: "Error de conexión. Revisa tu red" };
    }
},
getcontract: async () => {
        try {
            const request = await fetch(`${Url}/`, {
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
    downloadcontract: async (id, token) => {
  try {
    const request = await fetch(`${Url}/download/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!request.ok) throw new Error("Error al descargar");

    const blob = await request.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrato.pdf"; // puedes poner aquí el nombre dinámico
    a.click();
    a.remove();

    return blob;

  } catch (error) {
    console.log(error);
    return error;
  }
},
delete_contract: async (id,token) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
                method: "DELETE",
                 headers: {
                "Authorization": `Bearer ${token}` 
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

 }
