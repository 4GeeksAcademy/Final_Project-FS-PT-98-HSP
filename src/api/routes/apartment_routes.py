from flask import request, jsonify, Blueprint
from api.models import db, Apartment
from flask_cors import CORS
from flask_jwt_extended import jwt_required

apartments_api = Blueprint('apartments_api', __name__, url_prefix='/apartments')

CORS(apartments_api)

@apartments_api.route('/create', methods=['POST'])
@jwt_required()
def create_apartment():
    body = request.get_json()
    
    if not body:
        return jsonify({"msg": "No data provided"}), 400
    
    new_apartment = Apartment(
        address=body.get("address"),
        postal_code=body.get("postal_code"),
        city=body.get("city"),
        owner_id=body.get("owner_id"),
        is_rent =body.get("is_rent")
    )
    
    try:
        new_apartment = Apartment(**body)
        db.session.add(new_apartment)
        db.session.commit()
        return jsonify({"apartments":new_apartment.serialize(),
                        "msg":"La vivienda se ha registrado con exito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_apartment(id):
    try:
        apartment = Apartment.query.get(id)
        if not apartment:
            return jsonify({"msg": "Apartment not found"}), 404
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/', methods=['GET'])
@jwt_required()
def get_apartments():
    try:
        apartments = Apartment.query.all()
        return jsonify([apartment.serialize() for apartment in apartments]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/notrented', methods=['GET'])
@jwt_required()
def get_apartments_not_rented():
    try:
        apartments = Apartment.query.filter_by(is_rent=False).all()
        return jsonify([apartment.serialize() for apartment in apartments]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_apartment(id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "No data provided"}), 400

    apartment = Apartment.query.get(id)

    if not apartment:
        return jsonify({"msg": "Apartment not found"}), 404
    protected_fields = ["id", "owner_id"]
    try:
        for key, value in body.items():
            if key in protected_fields:
                continue
            if hasattr(apartment, key):
                setattr(apartment, key, value)
        db.session.commit()
        return jsonify(apartment.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
@apartments_api.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_apartment(id):
    apartment = Apartment.query.get(id)

    if not apartment:
        return jsonify({"msg": "Apartment not found"}), 404

    try:
        db.session.delete(apartment)
        db.session.commit()
        return jsonify({"msg": "Apartment deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500