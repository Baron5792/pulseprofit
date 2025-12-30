<?php
    require '../../../component/required.php';
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];

        $data = [];
        $query = $connection->prepare("SELECT d.*, u.fullname FROM deposit d INNER JOIN users u ON d.userId = u.id ORDER BY d.date DESC");
        $query->execute();
        $result = $query->get_result();

        while ($row = $result->fetch_assoc()) {
            $fullname = $row['fullname'];
            $data[] = [
                'id' => $row['id'],
                'userId' => $row['userId'],
                'fullname' => $fullname,
                'txn_id' => $row['txn_id'],
                'amount' => $row['amount'],
                'reference_id' => $row['reference_id'],
                'wallet_name' => $row['wallet_name'],
                'wallet_address' => $row['wallet_address'],
                'screenshot' => $row['screenshot'],
                'wallet' => $row['wallet'],
                'status' => $row['status'],
                'date' => $row['date']
            ];
        }

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    } 