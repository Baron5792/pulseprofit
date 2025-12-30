<?php
    include "../../component/required.php";

    include "../../config/database.php";

    if (!$_SESSION['user']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh and try again']);
        exit;
    }

    $userId = $_SESSION['user']['id'];

    try {
        $status = 'ACTIVE';
        $data = [];
        // fetch every active wallet
        $query = $connection->prepare("SELECT id, wallet_name, wallet_address, status FROM wallet WHERE status= ?");
        $query->bind_param('s', $status);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            while ($assoc = $result->fetch_assoc()) {
                $data[] = [
                    'wallet_name' => $assoc['wallet_name'],
                    'wallet_address' => $assoc['wallet_address'],
                    'id' => $assoc['id'],
                ];
            }

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No active wallets found', 'data' => []]);
        }
    }

    catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }