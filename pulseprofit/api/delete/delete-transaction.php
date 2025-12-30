<?php
    require "../../component/required.php";
    require "../../config/database.php";

    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;

    if (!$session_token || !$received_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page to continue']);
        exit;
    }

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page to continue']);
        exit;
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $reference_id = $data['reference_id'] ?? null;
        $userId = $_SESSION['user']['id'];

        if (!$reference_id || empty($reference_id)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // check if it belongs to this user
        $check = $connection->prepare("SELECT reference_id, userId FROM deposit_wallet WHERE userId = ? AND reference_id = ?");
        $check->bind_param('is', $userId, $reference_id);
        $check->execute();
        $result = $check->get_result();
        if ($result->num_rows > 0) {
            // delete the reference ID
            $stmt = $connection->prepare("DELETE FROM deposit_wallet WHERE reference_id= ? AND userId= ?");
            $stmt->bind_param('si', $reference_id, $userId);
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Deposit process has been cancelled successfully']);
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured during the deletion process']);
                exit;
            }
        }

        else {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Access forbidden to perform this action']);
            exit;
        }
    }

    catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        exit;
    }