<?php   
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $title = 'Deposit';
        $data = [];
        $fetch = $connection->prepare("SELECT * FROM transactions WHERE userId= ? AND title= ? ORDER BY date DESC");
        $fetch->bind_param('is', $userId, $title);
        $fetch->execute();
        $result = $fetch->get_result();
        while ($query = $result->fetch_assoc()) {
            $data[] = [
                'id' => $query['id'],
                'userId' => $query['userId'],
                'title' => $query['title'],
                'reference_id' => $query['reference_id'],
                'txn_id' => $query['txn_id'],
                'amount' => $query['amount'],
                'status' => $query['status'],
                'wallet_name' => $query['wallet_name'],
                'date' => $query['date'],
            ];
        }

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }