<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $userId = $data['userId'] ?? null;
        $amount = $data['amount'] ?? null;

        if (!$data || $data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        if ($userId === null || $amount === null || $amount <= 0 || !is_numeric($amount)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid Inputs received']);
            exit;
        }

        // check if users balance exceed the debited amount
        $validate = $connection->prepare("SELECT * FROM users WHERE id = ?");
        $validate->bind_param('i', $userId);
        $validate->execute();
        $result = $validate->get_result()->fetch_assoc();
        $usersBalance = $result['balance'];
        if ($usersBalance < $amount) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Amount inputed exceeds the users balance']);
            exit;
        }

        // update users table
        $update = $connection->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $update->bind_param('di', $amount, $userId);
        if ($update->execute()) {
            // insert into transaction history
            $title = 'Charge';
            $status = 'COMPLETED';
            $wallet_name = 'NULL';
            $txn_id = uniqid('fee_', true);
            $stmt = $connection->prepare("INSERT INTO transactions (userId, title, txn_id, amount, status, wallet_name) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('issdss', $userId, $title, $txn_id, $amount, $status, $wallet_name);
            if ($stmt->execute()) {
                $connection->commit();
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'User has been debited successfully']);
            }

            else {
                $connection->rollback();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while inserting into users transaction history']);
            }
        }

        else {
            $connection->rollback();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while updating users balance']);
        }
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }