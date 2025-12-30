<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $transactionId = isset($_GET['transactionid']) ? $_GET['transactionid'] : '';
        
        if (empty($transactionId) || !$transactionId) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
            exit;
        }

        // fetch transactions
        $query = $connection->prepare("SELECT * FROM transactions WHERE id = ? AND userId= ?");
        $query->bind_param('ii', $transactionId, $userId);
        $query->execute();
        $result = $query->get_result()->fetch_assoc();
        $data = [
            'title' => $result['title'],
            'reference_id' => $result['reference_id'],
            'txn_id' => $result['txn_id'],
            'amount' => $result['amount'],
            'status' => $result['status'],
            'wallet_name' => $result['wallet_name'],
            'date' => $result['date'],
            'from' => $result['sender'],
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }