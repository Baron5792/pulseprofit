<?php   
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        // fetch total deposits made
        $query = $connection->prepare("SELECT SUM(amount) as total_deposit_amount FROM deposit WHERE status = 'COMPLETED'");
        if ($query->execute()) {
            $row = $query->get_result()->fetch_assoc();
            $totalAmount = $row['total_deposit_amount'];

            if ($totalAmount === null) {
                $totalAmount = 0.00;
            }
        }

        // fetch number of pending deposits
        $stmt = $connection->prepare("SELECT * FROM deposit WHERE status = 'PENDING'");
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $rows = $result->num_rows;
        }

        $data = [
            'total_deposit' => $totalAmount,
            'pending' => $rows
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }