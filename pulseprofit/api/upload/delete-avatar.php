    <?php
        require "../../component/required.php";
        require '../../config/database.php';

        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
            exit;
        }

        const UPLOAD_DIR = '../../images/';
        $userId = $_SESSION['user']['id'];

        try {
            // fetch current avatar
            $query = $connection->prepare("SELECT avatar FROM users WHERE id= ?");
            $query->bind_param('i', $userId);
            $query->execute();
            $queryResult = $query->get_result();
            $old_avatar = $queryResult->fetch_assoc();
            $old_avatar_name = $old_avatar['avatar'];
            $old_file_path = UPLOAD_DIR . $old_avatar_name;
            if (@unlink($old_file_path)) {
                $stmt = $connection->prepare("UPDATE users SET avatar= '' AND id= ?");
                $stmt->bind_param('i', $userId);
                if ($stmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Avatar deleted successfully']);
                }
                else {
                    echo json_encode(['status' => 'error', 'message' => 'An error occured']);
                }
            }

            else {
                http_response_code(400);
                echo json_encode((['status' => 'error', 'message' => 'An error occured, please try again later']));
            }

        }

        catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        }