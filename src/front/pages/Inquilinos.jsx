import React from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import {Asociations} from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";

const Inquilinos = () => {
  const [itemcontract, setItemcontract] = useState()
  const [itpartment, setItapartment] = useState()
  const { store, dispatch } = useGlobalReducer();
 

  
 const fetchData = async () => {
   try {

      const data = await users.getUserContracts(store.todos.id, store.token);
      if (data.msg === "ok") {
        await dispatch({ type: "add_contracts", value: data.contracts });
      }
    } catch (error) {

    }
    try {

      const data = await users.getUserApartmentsNotRented(store.todos.id, store.token);
        console.log 
        dispatch({ type: "add_apartments", value: data.apartments });
      
    } catch (error) {

    }
     try {

      const data = await users.get_asociation(store.todos.id, store.token);
        
          await dispatch({ type: "add_asociation", value: data });
       
    } catch (error) {
    }
  };

  useEffect(() => {

    fetchData();
  }, []);
 

const handleCreatenant = async () => {
  let createdTenantId = null;
  let createdContractId = null;

  try {
    // Paso 1: Crear inquilino
    const tenantResult = await users.sendTenantInvite(
      store.firstname,
      store.lastname,
      store.email,
      store.phone,
      store.national_id,
      store.aacc,
      store.token
    );

    if (tenantResult.error) throw new Error(tenantResult.error);
    createdTenantId = tenantResult.tenant.id;
    await dispatch({ type: "add_tenant", value: tenantResult.tenant });

    // Paso 2: Crear contrato
    const contractResult = await contracts.create_contract(
      store.contract_start_date,
      store.contract_end_date,
      store.contract,
      store.todos.id,
      store.token
    );

    if (contractResult.error) throw new Error(contractResult.error);
    createdContractId = contractResult.contract.id;
    await dispatch({ type: "add_contracts", value: contractResult.contract });

    // Paso 3: Crear asociación
    const asociationResult = await Asociations.createAsociation(
      createdTenantId,
      createdContractId,
      store.token
    );
    
    if (asociationResult.error) throw new Error(asociationResult.error);

    const asociationload = await users.get_asociation(
      store.todos.id,
      store.token
    );

    if (asociationload.error) throw new Error(asociationload.error);

    await dispatch({ type: "add_asociation", value: asociationload });
    swal({ title: "ÉXITO", text: "Operaciones completadas", icon: "success" });

  } catch (error) {
    // 🔁 ROLLBACK
    if (createdContractId) {
      await contracts.delete_contract(createdContractId, store.token).catch(() => {});
    }
    if (createdTenantId) {
      await users.delete_tenant(createdTenantId, store.token).catch(() => {});
    }

    swal({ title: "ERROR", text: error.message, icon: "error" });
  }
};

 
  const Ctenant = async () => {
    if(store.firstname==="" || store.lastname===""|| store.email==="" || store.phone==="" || store.national_id==="" || store.aacc===""                           
    || store.contract_start_date==="" || store.contract_end_date==="" ||  store.contract==="" ){
       swal({
          title: "ERROR",
          text: "No puede haber ningún campo vacio",
          icon: "warning",
          buttons: true,
        });
    }else{
       await
        handleCreatenant();
    }
  
  };

  console.log(itpartment)
  console.log(itemcontract)
  return (
    <>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Menú lateral */}
          <MenuLateral setActiveOption={() => { }} />

          {/* Contenido principal */}
          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Inquilinos</h2>
              <p>Aquí puedes visualizar, cargar o gestionar inquilinos activos.</p>
              <div className="tenantContracts" style={{ display: `${store.vista2}` }}>
              <div className="map" >
                <div className="form-outline mb-1 " >
                  <label
                    className="form-label"
                    htmlFor="firsth"
                  >
                    "First name"
                  </label>
                  <input
                  style={{height:"10px"}}
                    type="text"
                    id="firsth"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addFirtsname",
                        value: e.target.value,
                      })
                    }
                  />
                  
                </div>

                <div className="form-outline mb-1">
                   <label
                    className="form-label"
                    htmlFor="lasth"
                  >
                    "Last name"
                  </label>
                  <input
                   
                    type="text"
                    id="lasth"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addLastname",
                        value: e.target.value,
                      })
                    }
                  />
                 
                </div>

                <div className="form-outline mb-1">
                  <label
                    className="emailh"
                    htmlFor="form2Example3"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailh"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addEmail",
                        value: e.target.value,
                      })
                    }
                  />
                  
                </div>


                <div className="form-outline mb-1">
                  <label
                    className="form-label"
                    htmlFor="phoneh"
                  >
                    Telefono
                  </label>
                  <input
                    type="text"
                    id="phoneh"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addPhone",
                        value: e.target.value,
                      })
                    }
                  />
                  
                </div>

                <div className="form-outline mb-1">
                   <label
                    className="form-label"
                    htmlFor="nidh"
                  >
                    "DNI"
                  </label>
                  <input
                    type="text"
                    id="nidh"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addNid",
                        value: e.target.value,
                      })
                    }
                  />
                 
                </div>

                <div className="form-outline mb-1">
                  <label
                    className="form-label"
                    htmlFor="aacch"
                  >
                    "Account Number"
                  </label>
                  <input
                    type="text"
                    id="aacch"
                    className="form-control form-control-lg"
                    onChange={(e) =>
                      dispatch({
                        type: "addAacc",
                        value: e.target.value,
                      })
                    }
                  />
                  
                </div>
                <button className="btn btn-info" onClick={Ctenant}>
                  Añadir Inqulino
                </button>
                <button className="btn btn-info mi-button"
                  onClick={() => {
                    dispatch({
                      type: "vista",
                      value: "",
                    })
                    dispatch({
                      type: "vista2",
                      value: "none",
                    })
                  fetchData()
                  }}>Registra el Alquiler</button>
              </div>
              <div className="form" >
                <div className="mb-3">
                  <label htmlFor="start_day" className="form-label">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start_day"
                    onChange={(e) =>
                      dispatch({ type: "addstart_date", value: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="start_day" className="form-label">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_day"
                    onChange={(e) =>
                      dispatch({ type: "addend_date", value: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="pdfUpload" className="form-label">
                    Sube tu contrato en PDF
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="pdfUpload"
                    accept="application/pdf"
                    onChange={(e) => dispatch({ type: "addcontract", value: e.target.files[0] })}
                  />
                </div>
                <button className="btn btn-success mi-button">contrato</button>
              </div>
              </div>
              <div className="map" style={{ display: `${store.vista}` }}>

                <div className="map" >
                  <h3>CONTRATOS PENDIENTES DE ASIGNAR VIVIENDA</h3>

                  <ul className="list-group">

                    {store && store.asociation.map((item) => {
                      const startDate = new Date(item.asociaciones[0].contract.start_date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        });
                        console.log(item.asociaciones[0].tenant.first_name)
                        return (
                          <li
                            key={item.asociaciones[0].assoc_id}
                            className="list-group-item d-flex justify-content-between contenedor">
                               <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" 
                               type="checkbox" value="" id="checkDefault"onClick={(e)=>{setItemcontract(item.asociaciones[0].assoc_id)} }/></div>
                            <div className="contratitem">
                              <h5>Tu Contrato con:</h5>
                              <p> Inquilino: {item.asociaciones[0].tenant.first_name}, {item.asociaciones[0].tenant.last_name} y de fecha  {startDate} </p>
                               <p>No tiene vivienda signada. Puedes asignarle una de las viviendas que estan más abajo.</p>
                            </div>
                        
                          </li>
                        );
                      })}
                  </ul>
        
                </div>
                <div className="map" >
                  <h3>VIVIENDAS</h3>
                  <ul className="list-group">
                    {store && store.apartments.map((item) => {
                        const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                        return (
                          <li
                            key={item.id}
                            className="list-group-item d-flex justify-content-between contenedor">
                             <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" type="checkbox" value="" 
                             id="checkDefault" onClick={()=>{setItapartment(item.id)}} /></div> 
                            <div className="contratitem">
                              <p>Dirección: {item.address}, CP: {item.postal_code}, Ciudad: {item.city}, Parking: {item.parking_slot}, Estado: {alquilado}</p>
                            </div>
                          </li>
                        );
                      })}{(!store.apartments || store.apartments.length === 0) && (
                        <h1>No hay viviendas que mostrar</h1>
                      )}
                  </ul>

                </div>
             
                <button className="btn btn-info mt-2" >Crear Alquiler</button>
                <button className="btn btn-info mt-2 mi-button"
                  onClick={() => {
                    dispatch({
                      type: "vista",
                      value: "none",
                    })
                    dispatch({
                      type: "vista2",
                      value: "",
                    })
                  }}>volver</button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </>
  );
};

      export default Inquilinos;