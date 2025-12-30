<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];
        // fetch users referral Id
        $fetch = $connection->prepare("SELECT referral_id FROM users WHERE id = ?");
        $fetch->bind_param('i', $userId);
        $fetch->execute();
        $result = $fetch->get_result()->fetch_assoc();
        $referral_id = $result['referral_id'];

        // fetch all referrals
        $data = [];
        $query = $connection->prepare("SELECT fullname, email, id, referer, avatar, date FROM users WHERE referer = ?");
        $query->bind_param('s', $referral_id);
        if ($query->execute()) {
            $userData = $query->get_result();
            while ($row = $userData->fetch_assoc()) {
                $data[] = [
                    'fullname' => $row['fullname'],
                    'email' => $row['email'],
                    'id' => $row['id'],
                    'date' => $row['date'],
                    'avatar' => $row['avatar']
                ];
            }

            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Success', 'data' => $data]);
        }


        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }