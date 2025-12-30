<?php
    ob_start();
    require "../component/required.php";
    session_start();

    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    echo json_encode(['status' => 'success', 'token' => $_SESSION['csrf_token']]);
    exit();