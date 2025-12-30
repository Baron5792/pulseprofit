<?php
    require "../../component/required.php";

    require "../../config/database.php";

    // validate csrf token
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
        exit;
    }

    $reference_id = isset($_GET['reference_id']) ? $_GET['reference_id'] : null;
    $userId = $_SESSION['user']['id'];

    try {
        if (empty($reference_id) || !$reference_id) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Access denied for this request']);
            exit;
        }

        // check if reference ID exist with this user
        $query = $connection->prepare("SELECT reference_id, userId, wallet_type FROM deposit_wallet WHERE userId= ? AND reference_id= ?");
        $query->bind_param('is', $userId, $reference_id);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows !== 1) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Access denied to perform this action', 'redirect' => true]);
            exit;
        }

        // if it exist with this user
        // fetch every data with the reference ID
        $depositData = $result->fetch_assoc();
        // $data = [];
        $data = [
            'reference_id' => $depositData['reference_id'] ?? 'empty',
            'wallet' => $depositData['wallet_type'] ?? 'empty',
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }