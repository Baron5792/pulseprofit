<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page to continue']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        $reference_id = isset($_GET['reference_id']) ? $_GET['reference_id'] : null;

        if (!$reference_id || empty($reference_id)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
            exit;
        }

        // fetch from deposit_track
        $status = 'PENDING';
        $fetch = $connection->prepare("SELECT reference_id, txn_id, amount, wallet_name, wallet_address, wallet, status FROM deposit_track WHERE userId= ? AND reference_id= ? AND status= ?");
        $fetch->bind_param('iss', $userId, $reference_id, $status);
        $fetch->execute();
        $result = $fetch->get_result();
        if ($result->num_rows > 0) {
            // fetch deposit data
            $data = $result->fetch_assoc();
            $reactValue = [
                'reference_id' => $data['reference_id'],
                'txn_id' => $data['txn_id'],
                'amount' => $data['amount'],
                'wallet_name' => $data['wallet_name'],
                'wallet_address' => $data['wallet_address'],
                'wallet' => $data['wallet']
            ];

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $reactValue]);
        }

        else {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'An error occured. Please try again later', 'redirect' => 'true']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error', 'redirect' => 'false']);
    }