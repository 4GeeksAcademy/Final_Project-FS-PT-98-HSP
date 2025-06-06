
import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { format, differenceInDays } from 'date-fns';
import MenuLateral from "../components/MenuLateral";


const Incidencias = () => {
     const { store, dispatch } = useGlobalReducer();
    return (
        <>


            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Menú lateral */}
                    <MenuLateral setActiveOption={() => { }} />

                    {/* Contenido principal */}
                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Incidencias</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar incidencias activas.</p>
                            <div className="map" style={{ display: `${store.visibility2}` }}>
                                            <ul className="list-group">
                                              {
                                                store && store.apartments.map((item) => {
                                                  const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                                                  return (
                                                    <li
                                                      key={item.id}
                                                      className="list-group-item d-flex justify-content-between">
                                                      <div className="contratitem">
                                                        <p>Dirección: {item.address}, CP: {item.postal_code}, CP: {item.postal_code}, Ciudad: {item.city}, Parking: {item.parking_slot}, Estado: {alquilado}</p>
                                                          
                            
                                                      </div>
                                                      <button className="btn btn-success">
                                                        Consultar incidencias
                                                      </button>
                                                    </li>
                                                  );
                                                })}{(!store.apartments || store.apartments.length === 0) && (
                                                  <h1>Todavía no has registrado ninguna vivienda</h1>
                                                )}
                                            </ul>
                                            <button className="btn btn-success mt-2"
                                              onClick={(e) => {
                                                dispatch({
                                                  type: "register",
                                                  value: "none",
                                                })
                                                dispatch({
                                                  type: "login",
                                                  value: "",
                                                })
                                              }}>Añadir Vivienda</button>
                                          </div>
                                         <div className="form" style={{ display: `${store.visibility}` }}>
                                          <div className="mb-3">
                                          <label htmlFor="address" className="form-label">
                                            Direccion
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            onChange={(e) =>
                                              dispatch({ type: "address", value: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="postal_code" className="form-label">
                                            Codigo Postal
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="postal_code"
                                            onChange={(e) =>
                                              dispatch({ type: "postal_code", value: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="city" className="form-label">
                                            Ciudad
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            onChange={(e) =>
                                              dispatch({ type: "city", value: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="parking_slot" className="form-label">
                                            Cochera
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="parking_slot"
                                            onChange={(e) =>
                                              dispatch({ type: "parking_slot", value: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label htmlFor="is_rent" className="form-label">
                                            Esta Arrendado
                                          </label>
                                          <input
                                            type="checkbox"
                                            className="form-control"
                                            id="is_rent"
                                            checked={store.is_rent}
                                            onChange={(e) =>
                                              dispatch({ type: "is_rent", value: e.target.checked })
                                            }
                                          />
                                        </div>
                                        <button className="btn btn-success" /*onClick={}*/>
                                          Añadir vivienda
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
                                            //fetchData()
                                          }}>Salir</button>
                                        </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Incidencias;