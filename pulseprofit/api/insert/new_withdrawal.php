<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (empty($data) || $data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $userId = $_SESSION['user']['id'];
        $coin_name = $data['coin_name'];
        $network = $data['network'] ?? '';
        $wallet_address = $data['wallet_address'];
        $amount = $data['amount'];
        $uniqId = uniqid('withdraw_', true);

        function generateReferenceID() {
            $timestamp_part = date('Ymd-His');
            $random_part = strtoupper(bin2hex(random_bytes(2))); 
            $ref_id = $timestamp_part . '-' . $random_part;
            return $ref_id;
        }
        $transaction_id = generateReferenceID();

        if (empty($coin_name) || empty($wallet_address) || empty($amount)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Please fill every required fields to proceed']);
            exit;
        }

        // check if user has an available balance for this
        $query = $connection->prepare("SELECT interest FROM users WHERE id = ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result()->fetch_assoc();
        if ($result['interest'] < $amount) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Insufficient funds to process this withdrawal']);
            exit;
        }

        // insert into withdrawal and transaction table
        $status = 'PENDING';
        $insert = $connection->prepare("INSERT INTO withdraw (userId, uniqId, amount, coin_name, network, wallet_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insert->bind_param('isdssss', $userId, $uniqId, $amount, $coin_name, $network, $wallet_address, $status);
        if ($insert->execute()) {
            // insert into transaction history
            $title = 'Withdrawal';
            $stmt = $connection->prepare("INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status, wallet_name) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('isssdss', $userId, $title, $uniqId, $transaction_id, $amount, $status, $coin_name);
            if ($stmt->execute()) {
                $connection->commit();
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Withdrawal has been made successfully']);
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'An error occured during the process']);
        }
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }