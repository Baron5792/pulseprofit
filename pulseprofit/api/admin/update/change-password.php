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

        if (!$data || $data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $userId = $data['userId'] ?? null;
        $new_password = $data['new_password'] ?? null;

        if ($userId === null || $new_password ===  null || empty($userId) || empty($new_password)) {
            http_response_code(400);
            echo json_encode("Invalid JSON format");
            exit;
        }

        // be sure a user exist with the userId
        $query = $connection->prepare("SELECT * FROM users WHERE id = ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            // hash password and update
            $hash = password_hash($new_password, PASSWORD_DEFAULT);

            // reupdate the users password
            $stmt = $connection->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->bind_param('si', $hash, $userId);
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Password has been changed successfully']);
            }

            else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'An error occured while changing the users password']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No user found with this ID']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }