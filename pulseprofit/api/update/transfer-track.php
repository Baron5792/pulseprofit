<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    // validate csrf token
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ?? null;
    $session_token = isset($_SESSION['csrf_token']) ?? null;

    if (!$session_token || !$received_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. PLease try again later.']);
        exit;
    }

    try {
        $file_content = file_get_contents('php://input');
        $decode_file = json_decode($file_content, true);

        if (!$decode_file || $decode_file === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $reference = $decode_file['reference'] ?? null;
        $amount = $decode_file['amount'] ?? null;
        $userId = $_SESSION['user']['id'];

        if (!$reference || empty($amount) || $amount === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid input fields']);
            exit;
        }

        if ($amount < 5) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Amount must exceed minimum amount required']);
            exit;
        }

        // validate users balance
        $query = $connection->prepare("SELECT balance, id FROM users WHERE id = ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $senderResult = $query->get_result()->fetch_assoc();

        if ($amount > $senderResult['balance']) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Insufficient funds to process this transaction']);
            exit;
        }

        // update amount and redirect back to react
        $status = 'PENDING';
        $update = $connection->prepare("UPDATE initial_transfer_track SET amount = ?, status = ? WHERE reference_id = ? AND userId = ?");
        $update->bind_param('dssi', $amount, $status, $reference, $userId);
        if ($update->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Successful']);
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while processing your transfer request']);
            exit;
        }
     }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }