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

        if ($data === null) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $fullname = $data['fullname'] ?? null;
        $email = $data['email'] ?? null;
        $admin = $data['admin'] ?? null;
        $interest = $data['interest'] ?? null;

        if (empty($fullname) || empty($email) || empty($interest)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'Please fill every required field to proceed']);
            exit;
        }

        $stmt = $connection->prepare("UPDATE users SET fullname = ?, email = ?, admin = ?, interest = ? WHERE email = ?");
        $stmt->bind_param('ssids', $fullname, $email, $admin, $interest, $email);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'User has been updated successfully']);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Not found']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }