<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    $session_token = $_SESSION['csrf_token'] ?? null;
    $header_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (!$session_token || !$header_token || $session_token !== $header_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Invalid CSRF token']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $userId = $_SESSION['user']['id'];
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $amount = filter_var($data['amount'], FILTER_VALIDATE_FLOAT);
        $planId = $data['planId'] ?? null;
        $uniqId = $data['uniqId'] ?? null;

        if (!$amount || $amount <= 0 || $amount  === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Amount is required']);
            exit;
        }

        if (!is_numeric($amount)) {
            echo json_encode(['status' => 'error', 'message' => 'Amount must be a valid number']);
            exit;
        }

        if (!$planId || !$uniqId) {
            $connection->rollback();
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Plan identification is missing.']);
            exit;
        }

        // check if users balance is enough
        $fetchUser = $connection->prepare("SELECT balance FROM users WHERE id = ?");
        $fetchUser->bind_param('i', $userId);
        $fetchUser->execute();
        $fetchRow = $fetchUser->get_result()->fetch_assoc();

        if (!$fetchRow) {
            $connection->rollback();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User account not found.']);
            exit;
        }

        $balance = (float)$fetchRow['balance'];

        if ($balance < $amount){
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Insufficient funds in your balance to activate this investment']);
            exit;
        }

        // check if plan_selected exist before updating
        $checkStmt = $connection->prepare("SELECT id, amount FROM plan_selected WHERE userId = ? AND uniqId = ? AND plan_id = ? ORDER BY date DESC LIMIT 1");
        $checkStmt->bind_param('iss', $userId, $uniqId, $planId);
        $checkStmt->execute();
        $existingRecord = $checkStmt->get_result()->fetch_assoc();
        if (!$existingRecord) {
            error_log("ERROR: No record found to update");
            $connection->rollback();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No investment plan found to update']);
            exit;
        }

        // calculate profit amount
        // first fetch daily_interest, days and amount inputed
        $planDetails = $connection->prepare("SELECT * FROM plans WHERE uniqId = ?");
        $planDetails->bind_param('s', $planId);
        $planDetails->execute();
        $planInfo = $planDetails->get_result()->fetch_assoc();
        if (!$planInfo) {
            $connection->rollback();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'The selected plan details could not be found.']);
            exit;
        }
        $daily_interest = $planInfo['daily_interest'];
        $days = $planInfo['days'];
        $percentInterest = $daily_interest / 100;
        $profitAmount = $amount * $percentInterest * $days;

        // Insert selected plan
        $stmt = $connection->prepare("UPDATE plan_selected SET amount = ?, profit= ? WHERE userId = ? AND uniqId = ? AND plan_id = ? ORDER BY date DESC LIMIT 1");
        $stmt->bind_param('ddiss', $amount, $profitAmount, $userId, $uniqId, $planId);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Plan selected successfully']);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while selecting plan. Please try again later.']);
        }
        $connection->commit();
    }

    catch (Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }