
from api.models import db, User, Apartment, Contract,AssocTenantApartmentContract
from api.models.users import Role
from sqlalchemy.orm import joinedload
import os
import uuid
from flask import request, jsonify, Blueprint, render_template, current_app
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta, datetime
from api.extensions import mail
from flask_mail import Message

users_api = Blueprint('users_api', __name__, url_prefix='/users')

CORS(users_api)

bcrypt = Bcrypt()

"""ENDPOINT OF USER"""
@users_api.route('/', methods=["GET"])
@jwt_required()
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200


@users_api.route('/<int:user_id>', methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify({"user":user.serialize()}), 200



@users_api.route('/<int:user_id>', methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data_request = request.get_json()

    if 'email' in data_request:
        existing_user = User.query.filter_by(
            email=data_request["email"]).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"error": "El email ya está registrado"}), 409

    user.first_name = data_request.get("first_name", user.first_name)
    user.last_name = data_request.get("last_name", user.last_name)
    user.phone = data_request.get("phone", user.phone)
    user.national_id = data_request.get("national_id", user.national_id)
    user.account_number = data_request.get(
        "account_number", user.account_number)
    user.roll = data_request.get("roll", user.roll)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario actualizado", "user": user.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500
    


@users_api.route('/create', methods=["POST"])
def create_user():
    print("msg")
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' or not 'first_name' in data_request:
        return jsonify({"error": "Los campos: first_name, email, password son obligatorios"}), 400

    if '@' not in data_request["email"] or len(data_request["password"]) < 8:
        return jsonify({"error": "Email o contraseña inválidos"}), 400

    email = data_request["email"].strip().lower()

    existing_user = User.query.filter_by(email=data_request["email"]).first()
    if existing_user:
        return jsonify({"error": "El email ya está registrado"}), 409

    new_user = User(
        first_name=data_request["first_name"],
        last_name=data_request["last_name"],
        email=email,
        password=bcrypt.generate_password_hash(
            data_request["password"]).decode('utf-8'),
        phone_number=data_request.get("phone_number"),
        national_id=data_request.get("national_id"),
        account_number=data_request.get("account_number"),
        role=data_request["role"]
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            "msg": "Usuario creado",
            "token": access_token,
            "user": new_user.serialize()
        }), 201

    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500
@users_api.route('/<int:user_id>', methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500
    
"""TENANT ENDPOINT"""

@users_api.route('/create/tenant', methods=["POST"])
@jwt_required()
def create_tenant():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' or not 'first_name' in data_request:
        return jsonify({"error": "Los campos: first_name, email, password son obligatorios"}), 400

    if '@' not in data_request["email"] or len(data_request["password"]) < 8:
        return jsonify({"error": "Email o contraseña inválidos"}), 400

    email = data_request["email"].strip().lower()

    existing_user = User.query.filter_by(email=data_request["email"]).first()
    if existing_user:
        return jsonify({"error": "El email ya está registrado"}), 409

    new_user = User(
        first_name=data_request["first_name"],
        last_name=data_request["last_name"],
        email=email,
       password=bcrypt.generate_password_hash(data_request["password"]).decode('utf-8'),
        phone=data_request.get("phone"),
        national_id=data_request.get("national_id"),
        account_number=data_request.get("account_number"),
        role=data_request["role"]
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        """access_token = create_access_token(identity=str(new_user.id))"""
        

        return jsonify({
            "msg": "El Inquilino ha sido creado exitosamente",
            "tenant": new_user.serialize()
        }), 201

    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500
    



@users_api.route('/<int:user_id>/apartments', methods=["GET"])
@jwt_required()
def get_user_apartments(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    apartments = user.apartments
    if not apartments:
        return jsonify({"error": "No hay apartamentos para este usuario"}), 404

    return jsonify({"msg":"ok", 
                    "apartments":[apartment.serialize() for apartment in apartments]}), 200

@users_api.route('/<int:user_id>/apartments/notrented', methods=["GET"])
@jwt_required()
def get_user_not_rented_apartments(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    not_rented_apartments = Apartment.query.filter(Apartment.owner_id == user_id, Apartment.is_rent == False).all()

    return jsonify({"apartments":[apartment.serialize() for apartment in not_rented_apartments]}), 200



@users_api.route('/<int:user_id>/apartments/count', methods=["GET"])
@jwt_required()
def get_user_apartments_count(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    apartments = user.apartments
    count = len(apartments)
    if not apartments:
        return jsonify({"error": "No hay apartamentos para este usuario"}), 404
    return jsonify({"total":count}), 200



@users_api.route('/<int:user_id>/contracts/count', methods=["GET"])
@jwt_required()
def get_user_contracts_count(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    contracts = user.contracts
    count = len(contracts)

    if not contracts:
        return jsonify({"error": "No hay contratos para este usuario"}), 404
    return jsonify({"total": count}), 200


@users_api.route('/<int:user_id>/contracts', methods=["GET"])
@jwt_required()
def get_user_contracts(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    contracts = user.contracts
    
    if not contracts:
        return jsonify({"error": "No hay contratos para este usuario"}), 404
    return jsonify({"msg":"ok",
        "contracts":[contracts.serialize() for contracts in contracts]}), 200

@users_api.route('/<int:user_id>/contracts/assoc', methods=["GET"])
@jwt_required()
def get_contracts_by_owner(user_id):
    owner = User.query.options(
        joinedload(User.contracts)
            .joinedload(Contract.association)
            .joinedload(AssocTenantApartmentContract.tenant),
        joinedload(User.contracts)
            .joinedload(Contract.association)
            .joinedload(AssocTenantApartmentContract.apartment),
        joinedload(User.contracts)
            .joinedload(Contract.association)
            .joinedload(AssocTenantApartmentContract.contract)
    ).filter_by(id=user_id).first()

    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404

    contratos_data = []

    for contrato in owner.contracts:
        contrato_dict = contrato.serialize()
        asociaciones = []
    
        for assoc in contrato.association:
            if assoc.tenant and assoc.tenant.role == Role.INQUILINO:
                asociaciones.append({
                    "assoc_id": assoc.id,
                    "tenant": assoc.tenant.serialize(),
                    "apartment": assoc.apartment.serialize() if assoc.apartment else None,
                    "contract": assoc.contract.serialize()
                })

        contrato_dict["asociaciones"] = asociaciones
        contratos_data.append(contrato_dict)

    return jsonify(asociaciones), 200

"""VALIDATION ENDPOINT"""
@users_api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify({
        "msg":True}), 200

"""LOGIN ENDPOINT"""
@users_api.route('/login', methods=["POST"])
def sing_in():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email y password son requeridos"}), 400

    user = User.query.filter_by(email=data_request["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data_request["password"]):
        return jsonify({"msg": "El email o la contraseña es incorrecto"}), 401

    try:

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "user": user.serialize(),
            "token": access_token
        }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500



@users_api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data_request = request.get_json()
    email = data_request.get('email')

    if not email:
        return jsonify({"message": "El email es necesario"}), 404

    user = User.query.filter_by(email=email).first()

    if not user:
        print(
            f"Intento de restablecimiento de contraseña para correo NO registrado: {email}")
        return jsonify({"message": "Si tu correo electrónico está registrado, recibirás un enlace de restablecimiento."}), 200

    claims = {"forgot_password": True, "email": email}
    reset_token = create_access_token(identity=str(user.id),
                                      expires_delta=timedelta(minutes=15),
                                      additional_claims=claims)

    frontend_url = current_app.config.get("FRONTEND_URL")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    try:
        html_body = render_template('reset_password_email.html',
                                    reset_link=reset_link,
                                    current_year=datetime.now().year)
        
        msg = Message('Restablece tu contraseña - InmuGestion',
                      sender=os.getenv("MAIL_USERNAME"),
                      recipients=[email],
                      html=html_body)

        mail.send(msg)
        return jsonify({"message": "Email enviado"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error en el servidor, intenta más tarde"}), 500


@users_api.route('/reset-password', methods=["POST"])
@jwt_required()
def reset_password():
    data_request = request.get_json()
    new_password = data_request.get('password')
    if not new_password:
        return jsonify({"message": "La contraseña es obligatoria"}), 400

    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        claims = get_jwt()

        if claims.get("forgot_password") and claims.get("email") == user.email:
            user.password = bcrypt.generate_password_hash(new_password).decode('utf-8') 
            db.session.commit()
            return jsonify({"message": "Contraseña restablecida"}), 200
        else:
            return jsonify({"message": "Error en la validación de los datos, contacta al administrador"}), 401
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "Error en el servidor, intenta más tarde"}), 500


@users_api.route('/register-tenant-initiate', methods=["POST"])
@jwt_required()
def register_tenant_initiate():
    owner_id = get_jwt_identity()

    data_request = request.get_json()
    first_name = data_request.get("first_name")
    last_name = data_request.get("last_name")
    email = data_request.get("email")
    phone = data_request.get("phone")
    national_id = data_request.get("national_id")
    account_number = data_request.get("account_number")


    if not email or not first_name:
        return jsonify({"message": "Nombre y email del inquilino son obligatorios"}), 400
    
    if '@' not in email:
        return jsonify({"message": "Formato de email inválido"}), 400

    email_lower = email.strip().lower()
    existing_user = User.query.filter_by(email=email_lower).first()

    if existing_user:
        return jsonify({"message": "Ya existe un usuario con este email"}), 409

    temporary_password = str(uuid.uuid4())
    hashed_temporary_password = bcrypt.generate_password_hash(temporary_password).decode('utf-8')

    new_tenant = User(
        first_name=first_name,
        last_name=last_name,
        email=email_lower,
        password=hashed_temporary_password,
        phone=phone,
        national_id=national_id,
        account_number=account_number,
        role="INQUILINO"
    )

    claims = {"setup_password": True, "email": new_tenant.email}

    try:
        db.session.add(new_tenant)
        db.session.commit()

        setup_password_token = create_access_token(
            identity=str(new_tenant.id),
            expires_delta=timedelta(days=30),
            additional_claims=claims
        )

        frontend_url = current_app.config.get("FRONTEND_URL")
        setup_password_link = f"{frontend_url}/set-password?token={setup_password_token}"

        
        html_body = render_template('tenant_welcome_email.html',
                                    first_name=new_tenant.first_name,
                                    setup_password_link=setup_password_link)

        test_email_recipient = os.getenv("TEST_MAIL")
        recipients_list = [new_tenant.email]
        if test_email_recipient and test_email_recipient != new_tenant.email:
            recipients_list.append(test_email_recipient)

        msg = Message('¡Bienvenido a InmuGestion! Configura tu Contraseña',
                      sender=os.getenv("MAIL_USERNAME"),
                      recipients=recipients_list,
                      html=html_body)
        mail.send(msg)

        return jsonify({"message": "Inquilino registrado exitosamente. Se ha enviado un email para configurar su contraseña."}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error al registrar inquilino o enviar email: {e}")
        return jsonify({"message": "Error en el servidor al registrar inquilino, intenta más tarde."}), 500


@users_api.route('/set-password', methods=["POST"])
@jwt_required()
def set_tenant_password():
    tenant_id = get_jwt_identity()
    data_request = request.get_json()
    new_password = data_request.get('password')

    if not new_password:
        return jsonify({"message": "La contraseña es obligatoria"}), 400

    try:
        tenant = User.query.get(tenant_id)
        if not tenant:
            return jsonify({"message": "Inquilino no encontrado o token inválido."}), 404

        claims = get_jwt()

        if not claims.get("setup_password") or claims.get("email") != tenant.email:
            return jsonify({"message": "Token inválido o no autorizado para esta operación."}), 401
        
        tenant.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        
        db.session.commit()
        return jsonify({"message": "Contraseña configurada exitosamente. Ya puedes iniciar sesión."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al configurar contraseña del inquilino: {e}")
        return jsonify({"message": "Error en el servidor al configurar la contraseña, intenta más tarde."}), 500
