<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        // fetch all
        $data = [];
        $query = $connection->prepare("SELECT * FROM users WHERE NOT id = ? ORDER BY date DESC");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result();
        while ($row = $result->fetch_assoc()) {

            $data[] = [
                'id' => $row['id'],
                'fullname' => $row['fullname'],
                'username' => $row['username'],
                'reg_id' => $row['reg_id'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'avatar' => $row['avatar'],
                'balance' => $row['balance'],
                'date' => $row['date'],
                'gender' => $row['gender'],
                'date_of_birth' => $row['date_of_birth'],
                'country' => $row['country'],
                'state' => $row['state'],
                'nationality' => $row['nationality'],
                'interest' => $row['interest'],
                'admin' => $row['admin'],
            ];
        }

        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }