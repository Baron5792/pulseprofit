<?php
    require "../../component/required.php";
    require "../../config/database.php";

    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired, please try again']);
        exit;
    }

    // validate csrf token
    $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ?? null;
    $session_token = isset($_SESSION['csrf_token']) ?? null;

    if (!$received_token || !$session_token || $session_token !== $received_token) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Your session has expired, please try again later']);
        exit;
    }

    try {
        $userId = $_SESSION['user']['id'];

        // fetch data
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data || $data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
            exit;
        }

        $reg_id = $data['reg_id'] ?? null;
        if (!$reg_id || $reg_id === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'No reference found']);
            exit;
        }

        // generate a reference and txn id
        function generateTxnId(): string {
            // Generates 16 bytes (128 bits) of cryptographic pseudo-random data
            $data = random_bytes(16);

            // Set the 4 most significant bits of the 7th byte to 0100'B, i.e. 4 (UUID version)
            $data[6] = chr(ord($data[6]) & 0x0f | 0x40);

            // Set the 2 most significant bits of the 9th byte to 10'B, i.e. 8, 9, a, or b (UUID variant)
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

            // Format the bytes into a standard UUID string
            return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
        }

        // for reference Id
        function generateRefId(int $length = 6): string {
            // 1. Get formatted date (YYYYMMDD)
            $datePart = date('Ymd');

            // 2. Get a short, random hex string for uniqueness
            // Use bin2hex on half the length of random bytes (e.g., 3 bytes for 6 hex chars)
            $randomBytes = random_bytes(ceil($length / 2));
            $randomPart = strtoupper(substr(bin2hex($randomBytes), 0, $length));

            // 3. Combine with a prefix
            return "REF-{$datePart}-{$randomPart}";
        }

        $reference_id = generateRefId();
        $txn_id = generateTxnId();

        // insert into the database 
        $insert = $connection->prepare("INSERT INTO initial_transfer_track (userId, recipient_reg, txn_id, reference_id) VALUES (?, ?, ?, ?)");
        $insert->bind_param('iiss', $userId, $reg_id, $txn_id, $reference_id);
        if ($insert->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'success', 'reference' => $reference_id]);
        }

        else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'An error occured while processing your transfer request']);
        }
    }

    catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
    }