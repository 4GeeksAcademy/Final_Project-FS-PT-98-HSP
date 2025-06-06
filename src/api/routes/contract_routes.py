from flask import request, jsonify, Blueprint, current_app, url_for, send_from_directory, abort, send_file
from api.models import db, Contract
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import boto3
from botocore.client import Config
from io import BytesIO
from botocore.exceptions import ClientError

contracts_api = Blueprint('contracts_api', __name__, url_prefix='/contracts')

CORS(contracts_api)

def get_r2_client():
    return boto3.client(
        's3',
        endpoint_url=os.getenv("R2_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"), 
        config=Config(signature_version='s3v4'),
        region_name='auto'
    )

@contracts_api.route('/', methods=["GET"])
@jwt_required()
def get_all_contracts():
    contracts = Contract.query.all()
    return jsonify([contract.serialize() for contract in contracts]), 200

@contracts_api.route('/<int:contract_id>', methods=["GET"])
@jwt_required()
def get_contract(contract_id):
    contract = Contract.query.get(contract_id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404
    return jsonify(contract.serialize()), 200

@contracts_api.route('/<int:contract_id>', methods=["PUT"])
@jwt_required()
def update_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data_request = request.get_json()

    contract.start_date = data_request.get("start_date", contract.start_date)
    contract.end_date = data_request.get("end_date", contract.end_date)
    contract.owner_id = data_request.get("owner_id", contract.owner_id)

    try:
        db.session.commit()
        return jsonify({"msg": "Contract updated", "contract": contract.serialize()}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500



@contracts_api.route('/download/<contract_id>', methods=['GET'])
@jwt_required()
def download_contract(contract_id):
    try:
      
        contract = Contract.query.get_or_404(contract_id)
        
        filename = contract.document.split('/')[-1]
        
        s3 = get_r2_client()
        
        file_stream = BytesIO()
        s3.download_fileobj(
            os.getenv("R2_BUCKET_NAME"),
            filename,
            file_stream
        )
        file_stream.seek(0) 
        
        
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return jsonify({"error": "Archivo no encontrado en R2"}), 404
        return jsonify({"error": f"Error de AWS: {str(e)}"}), 500
        
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

@contracts_api.route('/create', methods=['POST'])
@jwt_required()
def create_contract():
    # Debug 1: Verificar llegada de datos
    print("\n=== INICIO DE SOLICITUD ===")
    print("Headers:", request.headers)
    print("Form data:", request.form)
    print("Files recibidos:", request.files)
    
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf'}

    # Debug 2: Verificación de archivo
    if 'document' not in request.files:
        print("ERROR: No se encontró el campo 'document' en request.files")
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['document']
    print("Archivo recibido - Nombre:", file.filename, "Tipo:", file.content_type)
    
    if file.filename == '':
        print("ERROR: Nombre de archivo vacío")
        return jsonify({"error": "No selected file"}), 400
        
    if not (file and allowed_file(file.filename)):
        print("ERROR: Archivo no permitido - Extensión inválida")
        return jsonify({"error": "Solo se permiten archivos PDF"}), 400

    # Generación de nombre único
    original_name = secure_filename(file.filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{original_name.rsplit('.', 1)[0]}_{timestamp}.pdf"
    print("Nombre único generado:", unique_filename)
    
    try:
        # Debug 3: Verificación de variables R2
        print("\nConfiguración R2:")
        print("Bucket:", os.getenv("R2_BUCKET_NAME"))
        print("Endpoint:", os.getenv("R2_ENDPOINT_URL"))
        print("Clave de acceso:", bool(os.getenv("R2_ACCESS_KEY_ID")))
        
        # Debug 4: Verificar contenido del archivo
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        print("Tamaño del archivo:", file_size, "bytes")
        
        if file_size == 0:
            raise ValueError("El archivo está vacío")

        # Subida a R2 con verificación
        s3 = get_r2_client()
        print("\nIniciando subida a R2...")
        s3.upload_fileobj(
            file,
            os.getenv("R2_BUCKET_NAME"),
            unique_filename,
            ExtraArgs={
                'ContentType': 'application/pdf',
                'ACL': 'private'  # Cambiar a 'public-read' si necesitas acceso público
            }
        )
        print("Subida a R2 completada con éxito")

        # Generación de URL
        file_url = f"{os.getenv('R2_PUBLIC_URL')}/{unique_filename}"
        print("URL generada:", file_url)
        
        # Debug 5: Verificación de datos del formulario
        print("\nDatos del contrato:")
        print("Start Date:", request.form.get('start_date'))
        print("End Date:", request.form.get('end_date'))
        print("Owner ID:", request.form.get('owner_id'))

        # Creación del contrato
        new_contract = Contract(
            start_date=datetime.fromisoformat(request.form['start_date']),
            end_date=datetime.fromisoformat(request.form['end_date']),
            owner_id=request.form['owner_id'],
            document=file_url
        )
        
        db.session.add(new_contract)
        db.session.commit()
        print("Contrato guardado en base de datos")

        return jsonify({
            "msg": "El contrato ha sido registrado satisfactoriamente",
            "file_url": file_url,
            "contract": new_contract.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        error_msg = f"ERROR DETALLADO: {str(e)}"
        print(error_msg)
        current_app.logger.error(error_msg)
        
        # Manejo específico de errores de AWS
        if hasattr(e, 'response'):
            print("Respuesta de error de AWS:", e.response)
            
        return jsonify({
            "error": "Error al procesar el archivo",
            "details": str(e)
        }), 500


@contracts_api.route('/<int:contract_id>', methods=["DELETE"])
@jwt_required()
def delete_contract(contract_id):
    contract = Contract.query.get(contract_id)

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    try:
        db.session.delete(contract)
        db.session.commit()
        return jsonify({"msg": "Contract deleted"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error in the server"}), 500