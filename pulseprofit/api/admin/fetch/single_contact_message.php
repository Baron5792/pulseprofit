<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    try {
        $messageId = isset($_GET['id']) ? $_GET['id']: null;
        if (!$messageId || $messageId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $query = $connection->prepare("SELECT id, fullname, subject, message FROM contact_us WHERE id = ?");
        $query->bind_param('i', $messageId);
        $query->execute();
        $result = $query->get_result()->fetch_assoc();
        $data = [
            'id' => $result['id'] ?? null,
            'fullname' => $result['fullname'] ?? null,
            'subject' => $result['subject'] ?? null,
            'message' => $result['message'] ?? null,
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }