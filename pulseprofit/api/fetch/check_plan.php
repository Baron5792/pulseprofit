<?php
    require "../../component/required.php";

    require "../../config/database.php";

    if (!isset($_SESSION['user']['id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];

        $query = $connection->prepare("SELECT plan_id, userId, uniqId, profit, amount FROM plan_selected WHERE userId = ? ORDER BY date DESC LIMIT 1");
        $query->bind_param('i', $userId);
        $query->execute();
        $result = $query->get_result();
        if ($result->num_rows > 0) {
            $plan_result = $result->fetch_assoc();
            $plan_id = $plan_result['plan_id'];
            $uniqId = $plan_result['uniqId'];

            // fetch this plan details
            $fetch = $connection->prepare("SELECT * FROM plans WHERE uniqId= ?");
            $fetch->bind_param('s', $plan_id);
            $fetch->execute();
            $selectedPlanResult = $fetch->get_result()->fetch_assoc();
            if ($selectedPlanResult) {
                $data = [
                    'amount' => (float)$plan_result['amount'],
                    'profit' => (float)$plan_result['profit'],
                    'plan_id' => $plan_id,
                    'uniqId' => $uniqId,
                    'title' => $selectedPlanResult['title'],
                    'daily_interest' => $selectedPlanResult['daily_interest'],
                    'term' => $selectedPlanResult['term'],
                    'min' => $selectedPlanResult['min'],
                    'max' => $selectedPlanResult['max'],    
                    'total_return' => $selectedPlanResult['total_return']
                ];

                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Fetched successfully', 'data' => $data]);
            }

            else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'The selected plan details could not be found.']);
            }
        }

        else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
    }