<?php
    require "../../component/required.php";

    require "../../config/database.php";

    // generate a random maths captcha 
    $num1 = rand(1, 10);
    $num2 = rand(1, 10);

    $captcha_question = "What is $num1 + $num2?";
    $captcha_answer = $num1 + $num2;


    // store the answer in session
    $_SESSION['captcha_answer'] = $captcha_answer;
    echo json_encode(['question' => $captcha_question]);

    exit();
    