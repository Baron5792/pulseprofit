        <?php
            ini_set('display_errors', 1); // Only for local testing
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);
            require "../../component/required.php";
            require "../../config/database.php";

            $received_token = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN']: null;
            $session_token = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token']: null;

            if (!$received_token || !$session_token || $session_token !== $received_token) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Your session has expired please refresh the page and try again']);
                exit;
            }

            if (!$_SESSION['user']['id']) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Something went wrong, please refresh the page and try again']);
                exit;
            }

            try {
                $json = file_get_contents('php://input');
                $data = json_decode($json, true);

                if ($data == null) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format']);
                    exit;
                }

                $userId = (int)$_SESSION['user']['id'];
                $amount = $data['amount'];
                $reference_id = $data['reference_id'];
                $wallet_address = $data['wallet_address'];

                if (empty($amount) || empty($reference_id) || empty($wallet_address)) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'All fields are required to proceed']);
                    exit;
                }

                if ($amount < 500) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'The minimum deposit amount is 500 USD.']);
                    exit;
                }

                if (!is_numeric($amount)) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid amount inputed']);
                    exit;
                }

                // fetch wallet name
                $query = $connection->prepare('SELECT * FROM wallet WHERE wallet_address= ?');
                $query->bind_param('s', $wallet_address);
                $query->execute();
                $fetchResult = $query->get_result();
                $fetchAssoc = $fetchResult->fetch_assoc();
                $wallet_name = $fetchAssoc['wallet_name'] ?? null;
                $wallet_asset = $fetchAssoc['asset'] ?? null;
                $query->close();

                if (empty($wallet_name)) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid wallet address selected.']);
                    exit;
                }

                // make sure the reference belong to this user
                $status = 'PENDING';
                $verify = $connection->prepare("SELECT userId, reference_id, txn_id, wallet_type FROM deposit_wallet WHERE userId= ? AND reference_id= ? ORDER BY date DESC LIMIT 1");
                $verify->bind_param('is', $userId, $reference_id);
                $verify->execute();
                $result = $verify->get_result();
                if ($result->num_rows > 0) {
                    // update the track
                    $deposit_details = $result->fetch_assoc();
                    $transaction_id = $deposit_details['txn_id'] ?? null;
                    $wallet_type = $deposit_details['wallet_type'] ?? null;

                    // insert into deposit track
                    $insert = $connection->prepare("INSERT INTO deposit_track (userId, txn_id, reference_id, amount, wallet_name, wallet_address, wallet, status, wallet_asset) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $insert->bind_param('ississsss', $userId, $transaction_id, $reference_id, $amount, $wallet_name, $wallet_address, $wallet_type, $status, $wallet_asset);
                    if ($insert->execute()) {
                        http_response_code(201);
                        echo json_encode(['status' => 'success', 'message' => 'Successful']);
                    }

                    else {
                        http_response_code(400);
                        echo json_encode(['status' => 'error', 'message' => 'Something went wrong']);
                        exit;
                    }
                }        

                else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Something went wrong, please try again later']);
                    exit;
                }
            }

            catch(Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Internal server error: ' . $e->getMessage()]);
                exit;
            }