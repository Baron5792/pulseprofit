<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Session has expire']);
        exit;
    }

    $connection->begin_transaction();
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $userId = $data['userId'] ?? null;

        if ($data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $stmt = $connection->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $data = [
            'id' => $result['id'],
            'balance' => $result['balance'],
            'fullname' => $result['fullname'],
            'email' => $result['email'],
            'username' => $result['username']
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $data]);
    }

    catch(Exception $e) {
        $connection->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }