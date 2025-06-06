const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/asociates";

export const Asociations = {
  
  createAsociation: async (tenant_id, contract_id, token) => {
    let asociate = {
      "tenant_id": tenant_id,
      "contract_id": contract_id,
      "is_active": Boolean(true),
    };
  console.log(asociate)
    try {
      const request = await fetch(`${Url}/create`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer  ${token}`
        },
        body: JSON.stringify(asociate),
      });
      const response = await request.json();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
