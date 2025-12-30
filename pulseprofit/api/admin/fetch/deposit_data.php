<?php   
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired. Please refresh the page to continue']);
        exit;
    }

    try {
        $deposit_id = isset($_GET['deposit_id']) ? $_GET['deposit_id'] : null;
        $userId = $_SESSION['user']['id'];

        if (!$deposit_id || empty($deposit_id)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // fetch deposits data
        $stmt = $connection->prepare("SELECT * FROM deposit WHERE id = ?");
        $stmt->bind_param('i', $deposit_id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$result) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Deposit record not found']);
        }
        
        // fetch users fullname
        $recipientId = $result['userId'];
        $query = $connection->prepare("SELECT fullname, email FROM users WHERE id = ?");
        $query->bind_param('i', $recipientId);
        $query->execute();
        $userResult = $query->get_result();
        $query->close();

        if ($userResult->num_rows > 0) {
            $userData = $userResult->fetch_assoc();
            $fullname = $userData['fullname'] ?? null;
            $email = $userData['email'] ?? null;
            $data = [
                'id' => $result['id'],
                'userId' => $recipientId,
                'fullname' => $fullname,
                'email' => $email,
                'txn_id' => $result['txn_id'],
                'amount' => $result['amount'],
                'reference_id' => $result['reference_id'],
                'wallet_name' => $result['wallet_name'],
                'screenshot' => $result['screenshot'],
                'wallet' => $result['wallet'],
                'status' => $result['status'],
                'date' => $result['date'],
            ];

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Successful', 'data' => $data]);
        }

        else {

        }
    }

    catch (Exception $e) {
        http_response_code(500);
    }