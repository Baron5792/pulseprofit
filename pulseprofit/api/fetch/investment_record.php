<?php   
    require "../../component/required.php";
    require "../../config/database.php";

    try {
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Your session has expired, please try again later']);
            exit;
        }

        $userId  = $_SESSION['user']['id'];

        // fetch total amount invested
        $fetchTotal = $connection->prepare("SELECT SUM(amount) AS total_invested FROM investment WHERE userId = ? AND status = 'active'");
        $fetchTotal->bind_param('i', $userId);
        if ($fetchTotal->execute()) {
            $total_result = $fetchTotal->get_result()->fetch_assoc();
            $total_invested  = $total_result['total_invested'] ?? 0;

            $data = [
                'total_invested' => $total_invested
            ];

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Investment record fetched successfully', 'data' => $data]);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while fetching data']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }