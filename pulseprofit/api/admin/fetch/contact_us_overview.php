<?php
    include "../../../component/required.php";
    require "../../../config/database.php";

    try {
        $fetch = $connection->prepare("SELECT COUNT(*) AS total FROM contact_us");
        $fetch->execute();
        $result = $fetch->get_result()->fetch_assoc();
        $total_messages = $result['total'];

        // fetch the unreplied ones
        $status = 'PENDING';
        $fetch_unreplied = $connection->prepare("SELECT COUNT(*) AS unreplied FROM contact_us WHERE status = ?");
        $fetch_unreplied->bind_param('s', $status);
        $fetch_unreplied->execute();
        $unreplied_result = $fetch_unreplied->get_result()->fetch_assoc();
        $unreplied_messages = $unreplied_result['unreplied'];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => [
            'total_messages' => $total_messages,
            'unreplied_messages' => $unreplied_messages
        ]]);
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }