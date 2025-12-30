<?php
    require "../../component/required.php";
    require "../../config/database.php";

    $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : null;

    if (!$received_token || !$session_token || $received_token !== $session_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    try {
        $userId = $_SESSION['user']['id'];
        $uniqId = $data['uniqId'] ?? null;
        $plan_track = uniqId('track_', true);
        if (!$uniqId || empty($uniqId)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid Token']);
            exit;
        }

        // confirm plan with the uniqID 
        $query = $connection->prepare("SELECT uniqId, min FROM plans WHERE uniqId = ?");
        $query->bind_param('s', $uniqId);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows == 0) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Selected plan is invalid. Plaese try again later']);
            exit;
        }

        // fetch minimum amount
        $planDetails = $result->fetch_assoc();
        $planMin = $planDetails['min'];

        // compare users balance
        $fetchUsresData = $connection->prepare("SELECT balance FROM users WHERE id = ?");
        $fetchUsresData->bind_param('i', $userId);
        $fetchUsresData->execute();
        $usersData = $fetchUsresData->get_result();
        $userRow = $usersData->fetch_assoc();
        $balance = $userRow['balance'];

        if ($balance >= $planMin) {
            // insert into plan_selected
            $stmt = $connection->prepare("INSERT INTO plan_selected (userId, plan_id, uniqId) VALUES (?, ?, ?)");
            $stmt->bind_param('iss', $userId, $uniqId, $plan_track);
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Success']);
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured.']);
            }
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Insufficient funds to purchase this plan']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }