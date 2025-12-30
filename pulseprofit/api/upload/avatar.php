<?php
    require "../../component/required.php";
    require "../../config/database.php";

    const UPLOAD_DIR = '../../images/';

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        try {
            if (!isset($_SESSION['user'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'User is not authenticated']);
                exit;
            }

            $userId = $_SESSION['user']['id'];

            $avatar = $_FILES['avatar'];
            if (empty($_FILES['avatar']['name'])) {
                http_response_code(400); //bad request
                echo json_encode(['status' => 'error', 'message' => 'No file found']);
                exit;
            }

            $time = time();
            $avatarName = $time . $avatar['name'];
            $tmp_name = $avatar['tmp_name'];
            $allowed_files = ['png', 'jpg', 'jpeg'];
            $directory = UPLOAD_DIR  . $avatarName;
            $extension = explode('.', $avatarName);
            $extension = end($extension);

            if (!in_array($extension, $allowed_files)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'File must be an image']);
                exit;
            }

            if ($avatar['size'] > 6000000) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'File size should be less then 6MB']);
                exit;
            }

            // move uploaded file
            if (move_uploaded_file($tmp_name, $directory)) {
                $stmt = $connection->prepare("UPDATE users SET avatar= ? WHERE id= ?");
                $stmt->bind_param('si', $avatarName, $userId);
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(['status' => 'success', 'message' => 'Avatar has been uploaded successfully']);
                }

                else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'An error occured while uploading avatar']);
                }
            }
        }

        catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        }
    }

    else {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'No file found']);
    }