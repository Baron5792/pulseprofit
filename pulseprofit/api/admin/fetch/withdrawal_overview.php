<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $query = $connection->prepare("SELECT SUM(amount) as total_withdrawal FROM withdraw WHERE status = 'COMPLETED'");
        if ($query->execute()) {
            $result = $query->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $totalWithdrawal = $row['total_withdrawal'] ?? 0.00;
            }

            else {
                $totalWithdrawal = 0.00;
            }
        }

        // fetch total pending
        $stmt = $connection->prepare("SELECT * FROM withdraw WHERE status = 'PENDING'");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->num_rows;

        $data = [
            'total_withdrawal' => $totalWithdrawal,
            'row' => $row
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'success', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }