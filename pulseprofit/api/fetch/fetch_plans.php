<?php
    require "../../component/required.php";

    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page and try again']);
        exit;    
    }

    try {
        $data = [];
        $stmt = $connection->prepare("SELECT * FROM plans");
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row  = $result->fetch_assoc()) {
            $data[] = [
                'id' => $row['id'],
                'uniqId' => $row['uniqId'],
                'title' => $row['title'],
                'daily_interest' => $row['daily_interest'],
                'term' => $row['term'],
                'min' => $row['min'],
                'max' => $row['max'],
                'total_return' => $row['total_return']
            ];
        }
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }