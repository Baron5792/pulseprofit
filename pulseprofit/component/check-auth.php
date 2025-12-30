<?php
    require "./required.php";
    require '../config/database.php';

    if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
        $userId = $_SESSION['user']['id'];
        $stmt = $connection->prepare("SELECT * FROM users WHERE id= ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $data = $stmt->get_result();
        $details = $data->fetch_assoc();
        $_SESSION['user'] = [
            'id' => $details['id'],
            'reg_id' => $details['reg_id'],
            'username' => $details['username'],
            'referral_id' => $details['referral_id'],
            'fullname' => $details['fullname'],
            'email' => $details['email'],
            'balance' => $details['balance'],
            'referer' => $details['referer'],
            'avatar' => $details['avatar'],
            'phone' => $details['phone'],
            'telegram' => $details['telegram'],
            'gender' => $details['gender'],
            'date_of_birth' => $details['date_of_birth'],
            'country' => $details['country'],
            'address' => $details['address'],
            'address1' => $details['address1'],
            'address2' => $details['address2'],
            'city' => $details['city'],
            'state' => $details['state'],
            'zipcode' => $details['zipcode'],
            'nationality' => $details['nationality'],
            'date' => $details['date'],
            'interest' => $details['interest'],
            'admin' => $details['admin'],
            'total_deposit' => $details['total_deposit'],
            'total_withdrawal' => $details['total_withdrawal']
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'User is authenticated', 'authenticated' => true, 'data' => $_SESSION['user']]);

    }

    else {
        unset($_SESSION['user']);
        session_destroy();
        echo json_encode(['status' => 'error', 'message' => 'User is not isset', 'authenticated'=> false]);
    }