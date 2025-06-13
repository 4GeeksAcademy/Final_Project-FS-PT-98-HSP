from flask import request, jsonify, Blueprint
from api.models import db, AssocTenantApartmentContract,Apartment
from flask_cors import CORS
from flask_jwt_extended import jwt_required

asociates_api = Blueprint('asociates_api', __name__, url_prefix='/asociates')

CORS(asociates_api)


@asociates_api.route('/create', methods=['POST'])
@jwt_required()
def create_asociation():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No data provided"}), 400
    if not "tenant_id" in body  or not "contract_id" in body:
        return jsonify({"error":"No se han relacionado todos los campos necesarios para crear el alquiler. por favor revisa tu selección"})
    
    
    new_asociation = AssocTenantApartmentContract(
        tenant_id=body.get("tenant_id"),
        contract_id=body.get("contract_id"),
        is_active =body.get("is_active")
    )
    
    try:
        new_asociation = AssocTenantApartmentContract(**body)
        db.session.add(new_asociation)
        db.session.commit()
        return jsonify({"asociation":new_asociation.serialize(),
                        "msg":"La asociacion, se ha completado con exito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@asociates_api.route('/<int:id>/update', methods=['PUT'])
@jwt_required()
def update_asociates(id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "No data provided"}), 400

    asociates = AssocTenantApartmentContract.query.get(id)

    if not asociates:
        return jsonify({"msg": "No se encuentra la Asociación"}), 404
    protected_fields = ["id", "tenant_id","contract_id"]
    try:
        for key, value in body.items():
            if key in protected_fields:
                continue
            if hasattr(asociates, key):
                setattr(asociates, key, value)
        db.session.commit()
        return jsonify({"msg":"el Alquiler está activo",
                       "asosiate":asociates.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@asociates_api.route('/update-association-apartment/<int:assoc_id>/<int:apartment_id>', methods=['PUT'])
@jwt_required()
def update_association_and_apartment(assoc_id, apartment_id):
    assoc_body = request.get_json().get("association")
    apartment_body = request.get_json().get("apartment")

    if not assoc_body or not apartment_body:
        return jsonify({"msg": "Faltan datos para actualizar"}), 400

    try:
        # INICIO TRANSACCIÓN
        asociacion = AssocTenantApartmentContract.query.get(assoc_id)
        apartamento = Apartment.query.get(apartment_id)

        if not asociacion:
            return jsonify({"msg": "Asociación no encontrada"}), 404
        if not apartamento:
            return jsonify({"msg": "Apartamento no encontrado"}), 404

        # CAMPOS PROTEGIDOS
        assoc_protected = ["id", "tenant_id", "contract_id"]
        apt_protected = ["id", "owner_id"]

        for key, value in assoc_body.items():
            if key not in assoc_protected and hasattr(asociacion, key):
                setattr(asociacion, key, value)

        for key, value in apartment_body.items():
            if key not in apt_protected and hasattr(apartamento, key):
                setattr(apartamento, key, value)

        db.session.commit()

        return jsonify({
            "msg": "Asociación y apartamento actualizados correctamente",
            "association": asociacion.serialize(),
            "apartment": apartamento.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error durante la actualización", "error": str(e)}), 500
