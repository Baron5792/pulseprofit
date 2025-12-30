<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $userId = $_GET['userId'] ?? null;

        if (!$userId || $userId === null) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // fetch users data
        $query = $connection->prepare("SELECT * FROM users WHERE id = ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result()->fetch_assoc();
        $data = [
            'id' => $result['id'],
            'username' => $result['username'],
            'fullname' => $result['fullname'],
            'email' => $result['email'],
            'balance' => $result['balance'],
            'interest' => $result['interest'],
            'admin' => $result['admin'],
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Successful', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }