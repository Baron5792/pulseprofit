<?php
    require "../../component/required.php";

    require "../../config/database.php";

    // validate csrf token
    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;

    if (!$received_token || !$session_token || $session_token !== $received_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh page to continue']);
        exit;
    }

    if (!$_SESSION['user']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
        exit;
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if ($data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // fetch data
        $walletType = $data['wallet'];
        $userId = $_SESSION['user']['id'];

        if (empty($walletType)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Please select a wallet to proceed with your deposit']);
            exit;
        }

        // generate referrence ID
        function generateReferenceID() {
            $timestamp_part = date('Ymd-His');
            $random_part = strtoupper(bin2hex(random_bytes(2))); 
            $ref_id = $timestamp_part . '-' . $random_part;
            return $ref_id;
        }
        $transaction_id = generateReferenceID();

        // generate TXN ID
        function generateTransactionID() {
            $txn_id = uniqid('', true);
            $txn_hash = strtoupper(sha1($txn_id . microtime()));
            return $txn_hash;
        }
        $reference_id = generateTransactionID();

        // submit data
        $stmt = $connection->prepare("INSERT INTO deposit_wallet (userId, reference_id, txn_id, wallet_type) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('isss', $userId, $reference_id, $transaction_id, $walletType);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Wallet registered successfully', 'reference_id' => $reference_id]);
        }

        else {
            http_response_code(400);
            json_encode(['status' => 'error', 'message' => 'An error occured during the deposit process']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }

