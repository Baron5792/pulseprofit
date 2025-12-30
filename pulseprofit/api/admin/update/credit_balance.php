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

        if ($data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $userId = $data['userId'] ?? null;
        $credit_amount = $data['credit_amount'] ?? null;

        if (empty($credit_amount) || empty($userId)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid data received']);
            exit;
        }

        if ($credit_amount === 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Amount should exceed 0 USD']);
            exit;
        }

        // update users balance and transaction history
        $title = 'Profit';
        $txn_id = uniqid('profit_' . true);
        $status = 'COMPLETED';
        $reference_id = '';
        $wallet_name = 'NULL';
        $usersUpdate = $connection->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
        $usersUpdate->bind_param('di', $credit_amount, $userId);
        if ($usersUpdate->execute()) {
            if ($usersUpdate->affected_rows == 0) {
                $userUpdate->close();
                $connection->rollback();
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'User not found']);
                exit;
            }

            // insert into transaction history
            $insert = $connection->prepare("INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status, wallet_name) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insert->bind_param('isssdss', $userId, $title, $reference_id, $txn_id, $credit_amount, $status, $wallet_name);
            if ($insert->execute()) {
                $connection->commit();
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Success']);
            }

            else  {
                $insert->close();
                $connection->rollback();
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while updating transaction history']);
                exit;
            }

        }

        else {
             http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while updating transaction users table']);
            exit;
        }
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }