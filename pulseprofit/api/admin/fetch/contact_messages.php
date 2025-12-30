<?php
    require "../../../component/required.php";
    require "../../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired']);
        exit;
    }

    try {
        $data = [];
        $query = $connection->prepare("SELECT * FROM contact_us ORDER BY date DESC");
        if ($query->execute()) {
            $result = $query->get_result();
            while ($row = $result->fetch_assoc()) {
                $data[] = [
                    'id' => $row['id'],
                    'fullname' => $row['fullname'],
                    'email' => $row['email'],
                    'subject' => $row['subject'],
                    'message' => $row['message'],
                    'status' => $row['status'],
                    'date' => $row['date']
                ];
            }
            http_response_code(200);
            echo json_encode(['status' => 'success', 'data' => $data]);
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