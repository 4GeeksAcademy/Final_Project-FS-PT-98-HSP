import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";

import { format, differenceInDays } from 'date-fns';



const Contrato = () => {
  const { store, dispatch } = useGlobalReducer();
  const [item, setItem] = useState(null)

  const fetchData = async () => {
    try {

      const data = await users.getUserContracts(store.todos.id, store.token);
      if (!data.error) {
        await dispatch({ type: "add_contracts", value: data.contracts });
      }
    } catch (error) {

    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  const handleDownloadContract = async () => {
    console.log(item)
    try {

      const data = contracts.downloadcontract(item, store.token)


    } catch (error) {

    }
  };
  const downContract = async () => {
    await handleDownloadContract();
  }
  const handleCreatecontract = async () => {

    try {
      const data = await contracts.create_contract(store.contract_start_date, store.contract_end_date, store.contract, store.todos.id, store.token);
      console.log(data);
      console.log(data.error)
      if (data.message === "El contrato ha sido registrado satisfactoriamente") {
        swal({
          title: "CONTRATO",
          text: "El contrato ha sido registrado satisfactoriamente",
          icon: "success",
          buttons: true,
        });
      }
      else {
        swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }

    } catch (error) {
      console.log(error)
      return error
    }
  };
  const Ccontract = async () => {
    await
      handleCreatecontract();
  };

  return (
    <>


      <div className="container-fluid mt-4">
        <div className="row">
          {/* Menú lateral */}
          <MenuLateral setActiveOption={() => { }} />

          {/* Contenido principal */}
          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Contratos</h2>
              <p>Aquí puedes visualizar, cargar o gestionar contratos activos.</p>
              <div className="map" style={{ display: `${store.visibility2}` }}>

                <ul className="list-group">
                  {
                    store && store.contracts.map((item) => {
                      const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });

                      const endDate = new Date(item.end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      }
                      );
                      const splitDocument = item.document.split("/").pop();
                      const start = new Date();
                      const end = new Date(item.end_date);
                      const diffDays = differenceInDays(end, start, "days")
                      return (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between"
                          style={{ background: item.background }}>
                          <div className="contratitem">
                            <p>Fecha de inicio: {startDate}, Fecha de Finalizacion: {endDate}, Documento: {splitDocument} Flatán {diffDays} días para su finalización </p>
                          </div>
                          <button className="btn btn-success bt"
                            onClick={(e) => {
                              setItem(item.id);
                              downContract(item.id);
                            }}>
                            Consultar Contrato
                          </button>
                        </li>
                      );
                    })}
                </ul>
                <button className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({
                      type: "register",
                      value: "none",
                    })
                    dispatch({
                      type: "login",
                      value: "",
                    })
                  }}>Añadir Contrato</button>

              </div>

              <div className="form" style={{ display: `${store.visibility}` }}>
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
                <button className="btn btn-success " onClick={Ccontract}>
                  Guardar Contrato
                </button>
                <button className="btn btn-success mi-button"
                  onClick={() => {
                    dispatch({
                      type: "register",
                      value: "",
                    })
                    dispatch({
                      type: "login",
                      value: "none",
                    })
                    fetchData()
                  }}>Salir</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Contrato;
