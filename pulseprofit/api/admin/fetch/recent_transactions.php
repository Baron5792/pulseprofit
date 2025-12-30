<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $userId = isset($_GET['userId']) ? $_GET['userId'] : null;
        if (empty($userId) || $userId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // check if userId actually exist for this user
        $query = $connection->prepare("SELECT id FROM users WHERE id = ?");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            // fetch transactions
            $data = [];
            $fetch = $connection->prepare("SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC LIMIT 15");
            $fetch->bind_param('i', $userId);
            $fetch->execute();
            $selected = $fetch->get_result();
            while ($row = $selected->fetch_assoc()) {
                $data[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'reference_id' => $row['reference_id'] ?? null,
                    'txn_id' => $row['txn_id'] ?? null,
                    'amount' => $row['amount'],
                    'wallet_name' => $row['wallet_name'] ?? null,
                    'status' => $row['status'] ?? null,
                    'date' => $row['date']
                ];
            }

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No user found with this ID']);
            exit;
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }