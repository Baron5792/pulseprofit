<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired, Please refresh the page and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];

        // check if user is an admin
        $query = $connection->prepare("SELECT admin FROM users WHERE id= ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows === 1) {
            $data = $result->fetch_assoc();
            if ($data['admin'] === 1) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Authenticated']);
            }

            else {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Access denied to perform this action']);
                exit;
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }