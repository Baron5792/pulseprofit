<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $userId = isset($_GET['userId']) ? $_GET['userId']: null;

        if (!$userId || $userId === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        // fetch every of this users details using the userId
        $fetch = $connection->prepare("SELECT * FROM users WHERE id = ?");
        $fetch->bind_param('i', $userId);
        if ($fetch->execute()) {
            $result = $fetch->get_result()->fetch_assoc();
            if ($result) {
                $data = [
                    'id' => $result['id'],
                    'username' => $result['username'],
                    'fullname' => $result['fullname'],
                    'email' => $result['email'],
                    'phone' => $result['phone'] ?? NULL,
                    'avatar' => $result['avatar'],
                    'balance' => $result['balance'],
                    'referer' => $result['referer'] ?? NULL,
                    'telegram' => $result['telegram'] ?? NULL,
                    'date' => $result['date'],
                    'gender' => $result['gender'],
                    'date_of_birth' => $result['date_of_birth'],
                    'country' => $result['country'] ?? NULL,
                    'address' => $result['address'] ?? NULL,
                    'city' => $result['city'] ?? NULL,
                    'state' => $result['state'] ?? NULL,
                    'zipcode' => $result['zipcode'] ?? NULL,
                    'nationality' => $result['nationality'] ?? NULL,
                    'total_deposit' => $result['total_deposit'],
                    'interest' => $result['interest'],
                    'admin' => $result['admin'],
                ];

                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'User not found']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Users data not found']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }