from flask import Blueprint, jsonify, request, current_app
from functools import wraps
from services.auth import send_otp, verify_otp, login_required
from models.customer_master_model import (
    get_customer_id_by_phone_number,
    get_customer_by_id,
)
import random
import string
from utils.api import require_apikey

auth_bp = Blueprint("auth", __name__)

# In-memory storage for OTP (replace with proper storage in production)
otp_storage = {}


@auth_bp.route("/send-otp", methods=["POST"])
@require_apikey
def send_otp_route():
    payload = request.json
    if "phone_number" not in payload:
        return jsonify({"error": "Phone number is required"}), 400

    phone_number = payload.get("phone_number")
    return jsonify(send_otp(phone_number)), 200


@auth_bp.route("/verify-otp", methods=["POST"])
@require_apikey
def verify_otp_route():
    payload = request.json
    if "phone_number" not in payload or "token" not in payload:
        return jsonify({"error": "Phone number and token are required"}), 400

    phone_number = payload.get("phone_number")
    token = payload.get("token")

    # Get customer ID if available
    customer_id = None
    if phone_number:
        customer_id = get_customer_id_by_phone_number(phone_number.replace("+", ""))

    response = verify_otp(phone_number, token, customer_id)
    return jsonify(response), 200 if response.get("success", False) else 400


@auth_bp.route("/send-otp-for-hotel-rp", methods=["POST"])
@require_apikey
def send_otp_for_hotel_rp():
    payload = request.json
    if "repricing_session_id" not in payload:
        return jsonify({"error": "repricing_session_id is required"}), 400

    # In a real implementation, you would get the phone number from the repricing session
    # For now, we'll use a mock phone number
    phone_number = "+1234567890"

    response = send_otp(phone_number)
    response["phone_number_last_4_digits"] = phone_number[-4:]
    return jsonify(response), 200


@auth_bp.route("/verify-otp-for-hotel-rp", methods=["POST"])
@require_apikey
def verify_otp_for_hotel_rp():
    payload = request.json
    if "repricing_session_id" not in payload or "token" not in payload:
        return jsonify({"error": "repricing_session_id and token are required"}), 400

    # In a real implementation, you would get the phone number from the repricing session
    # For now, we'll use a mock phone number
    phone_number = "+1234567890"
    token = payload.get("token")

    response = verify_otp(phone_number, token)
    return jsonify(response), 200 if response.get("success", False) else 400