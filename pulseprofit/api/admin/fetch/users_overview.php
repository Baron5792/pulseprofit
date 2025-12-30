<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        // fetch number of registered users
        $query = $connection->prepare("SELECT COUNT(*) as total_users FROM users");
        if ($query->execute()) {
            $result = $query->get_result()->fetch_assoc();
            $users = $result['total_users'] ?? 0;
        }

        // check if any users registered today and fetch their number
        $stmt = $connection->prepare("SELECT COUNT(*) as users_today FROM users WHERE DATE(date) = CURDATE()");
        if ($stmt->execute()) {
            $result = $stmt->get_result()->fetch_assoc();
            $usersToday = $result['users_today'] ?? 0;
            $stmt->close();
        } else {
             // Optional: Handle query error
             throw new Exception("Error fetching today's users: " . $connection->error);
        }

        $data = [
            'total_users' => (int)$users,
            'users_today' => (int)$usersToday
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        exit;
    }