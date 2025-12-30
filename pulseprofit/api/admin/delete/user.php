<?php   
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $userId = $data['userId'] ?? null;

        if (!$userId || $userId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // delete user
        $delete = $connection->prepare("DELETE FROM users WHERE id = ?");
        $delete->bind_param('i', $userId);
        if ($delete->execute()) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'User has been successfully deleted']);
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while deleting this user']);
        }
    }

    catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        exit;
    }