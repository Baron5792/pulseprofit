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
        $data = [];
        $query = $connection->prepare("SELECT * FROM beneficiary WHERE userId = ?");
        $query->bind_param('i', $userId);
        if ($query->execute()) {
            $result = $query->get_result();

            while ($row = $result->fetch_assoc()) {
                // query for users fullname and avatar
                $fetch = $connection->prepare("SELECT fullname, avatar, reg_id FROM users WHERE id = ?");
                $fetch->bind_param('i', $row['beneficiaryId']);
                $fetch->execute();
                $beneficiaryResult = $fetch->get_result();
                if ($beneficiaryResult->num_rows > 0) {
                    $beneficiaryData = $beneficiaryResult->fetch_assoc();
                    $fullname = $beneficiaryData['fullname'] ?? null;
                    $avatar = $beneficiaryData['avatar'] ?? null;
                    $beneficiaryRegId = $beneficiaryData['reg_id'] ?? null;

                    $data[] = [
                        'id' => $row['id'] ?? null,
                        'beneficiaryId' => $row['beneficiaryId'] ?? null,
                        'fullname' => $fullname ?? null,
                        'avatar' => $avatar ?? null,
                        'reg_id' => $beneficiaryRegId ?? null,
                    ];
                }
            }

            http_response_code(200);
            echo json_encode(['status' => 'success', 'data' => $data]);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }