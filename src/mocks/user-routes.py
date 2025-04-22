from flask import Blueprint, request, jsonify
from services.auth import login_required
from typing import Dict, Any

user_bp = Blueprint("user", __name__)


@user_bp.route("/me", methods=["GET"])
@login_required
def get_current_user() -> Dict[str, Any]:
    """
    Get the current user's information
    """
    user = request.user
    return jsonify(
        {
            "phone": user.phone,
            "message": "User information retrieved successfully",
        }
    )


@user_bp.route("/me", methods=["PUT"])
@login_required
def update_user_info() -> Dict[str, Any]:
    """
    Update the current user's information
    """
    user = request.user
    data = request.get_json()

    # TODO: Implement user update in database
    return jsonify(
        {
            "message": "User information updated successfully",
            "updated_fields": data,
        }
    )


@user_bp.route("/me/settings", methods=["GET"])
@login_required
def get_user_settings() -> Dict[str, Any]:
    """
    Get the current user's settings
    """
    user = request.user
    # TODO: Implement settings retrieval from database
    return jsonify(
        {
            "message": "User settings retrieved successfully",
        }
    )


@user_bp.route("/me/settings", methods=["PUT"])
@login_required
def update_user_settings() -> Dict[str, Any]:
    """
    Update the current user's settings
    """
    user = request.user
    data = request.get_json()

    # TODO: Implement settings update in database
    return jsonify(
        {
            "message": "User settings updated successfully",
            "updated_settings": data,
        }
    )


@user_bp.route("/me/password", methods=["PUT"])
@login_required
def change_password() -> Dict[str, Any]:
    """
    Change the current user's password
    """
    user = request.user
    data = request.get_json()

    if not data or "current_password" not in data or "new_password" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # TODO: Implement password change logic using Supabase auth
    return jsonify({"message": "Password changed successfully"})


@user_bp.route("/me/profile", methods=["GET"])
@login_required
def get_user_profile() -> Dict[str, Any]:
    """
    Get the current user's profile information
    """
    user = request.user
    # TODO: Implement profile retrieval from database
    return jsonify(
        {
            "message": "User profile retrieved successfully",
        }
    )


@user_bp.route("/me/profile", methods=["PUT"])
@login_required
def update_user_profile() -> Dict[str, Any]:
    """
    Update the current user's profile information
    """
    user = request.user
    data = request.get_json()

    # TODO: Implement profile update in database
    return jsonify(
        {
            "message": "User profile updated successfully",
            "updated_profile": data,
        }
    )