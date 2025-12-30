<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    $session_token = $_SESSION['csrf_token'] ?? '';
    $header_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($header_token) || $header_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $userId = $_SESSION['user']['id'];
        $uniqId = $data['uniqId'] ?? '';
        $planId = $data['planId'] ?? '';
        $amount = $data['amount'] ?? 0;
        $title = $data['title'] ?? '';
        $daily_profit = $data['daily_interest'] ?? 0;
        $total_return = $data['total_return'] ?? 0;
        $status = 'active';

        if (empty($uniqId) || empty($planId)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid request parameters']);
            exit;
        }

        // first check if user has already finalized this investment
        $check = $connection->prepare("SELECT id FROM investment WHERE userId = ? AND planId = ? AND uniqId = ?");
        $check->bind_param('iss', $userId, $planId, $uniqId);
        $check->execute();
        $checkResult = $check->get_result();
        if ($checkResult->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'This investment has already been finalized']);
            exit;
        }

        // debit users account and finalize investment
        $usersBalance = $connection->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
        $usersBalance->bind_param('i', $userId);
        $usersBalance->execute();
        $balanceResult = $usersBalance->get_result()->fetch_assoc();
        $currentBalance = $balanceResult['balance'] ?? 0;

        $creditAmount = $currentBalance - $amount;
        if ($creditAmount < 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Insufficient balance to finalize this investment']);
            exit;
        }

        // update users balance 
        $updateBalance = $connection->prepare("UPDATE users SET balance = ? WHERE id = ?");
        $updateBalance->bind_param('di', $creditAmount, $userId);
        if ($updateBalance->execute()) {
            // insert into investment records
            $insertInvestment = $connection->prepare("INSERT INTO investment (userId, planId, uniqId, amount, title, daily_profit, total_return, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $insertInvestment->bind_param('issdsdds', $userId, $planId, $uniqId, $amount, $title, $daily_profit, $total_return, $status);

            if ($insertInvestment->execute()) {
                // update transaction history
                $transactionTitle = "Investment in " . $title . ' ' . 'Plan';
                $txn_id = 'NULL';
                $InsertTransaction = $connection->prepare('INSERT INTO transactions (userId, title, reference_id, txn_id, amount, status) VALUES (?, ?, ?, ?, ?, ?)');
                $InsertTransaction->bind_param('isssds', $userId, $transactionTitle, $uniqId, $txn_id, $amount, $status);
                if ($InsertTransaction->execute()) {
                    $connection->commit();
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Investment finalized successfully']);
                }

                else {
                    throw new Exception('Failed to insert transaction record');
                }
            }

            else {
                throw new Exception('Failed to insert investment record');
            }
        }

        else {
            throw new Exception('Failed to update user balance');
        }
    }

    catch(Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }