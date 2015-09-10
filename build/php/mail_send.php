<?php


$info = $_POST['info'];
$data = $_POST['data'];
$captions = $_POST['captions'];
$currentUrl = $_POST['currentUrl'];

$mail_to = $info['mail_to'];
$email_title = $info['email_title'];
$nm;
$em;
$type;
$headers = "From: test\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8 \r\n";
$com;
$telnumber;
$want;
// Формирование тела письма
$msg = "<html><body style='font-family:Arial,sans-serif;'>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>" . $email_title . "</h2>\r\n";
foreach ($data as $key => $value) {
    $msg .= "<p><strong>" . $captions[$key] . "</strong> " . $value . "</p>\r\n";
    $com .= $captions[$key] . $value . ' ';
    if (strstr($value, 'Холодные продажи')) {
        $want = $value;
    }
    if (strstr($value, 'Аутсорсинг входящей линии')) {
        $want = $value;
    }
    if (strstr($value, 'Маркетинговые исследования')) {
        $want = $value;
    }
    if (strstr($captions[$key], 'Имя:')) {
        $nm = $value;
    }

    if (strstr($captions[$key], 'Телефон:')) {
        $telnumber = $value;
        $telnumber = str_replace(" ", "", $telnumber);
        $telnumber = str_replace("-", "", $telnumber);
        $telnumber = str_replace("(", "", $telnumber);
        $telnumber = str_replace(")", "", $telnumber);
        $telnumber = str_replace("+", "", $telnumber);
        if ((strlen($telnumber)) == 10) {
            $telnumber = '7' . $telnumber;
        }
        if ($telnumber[0] == '8') {
            $telnumber[0] = '7';
        }
        $tel1 = $telnumber[0] . '-';
        $tel2 = $telnumber[1] . '' . $telnumber[2] . '' . $telnumber[3] . '-';
        $tel3 = $telnumber[4] . '' . $telnumber[5] . '' . $telnumber[6] . '' . $telnumber[7] . '' . $telnumber[8] . '' . $telnumber[9] . '' . $telnumber[10];
        $telnumber = $tel1 . $tel2 . $tel3;
    }

    if (strstr($captions[$key], 'Email:')) {
        $em = $value;
    }


}

$msg .= "</body></html>";

if (mail($mail_to, $email_title, $msg, $headers)) {
    echo "true";
} else {
    echo "false";
}

include('Request.php');

$host = 'outsale.megaplan.ru';
$login = 'ivan@outsale.org';
$password = 'outsaleivan20';

$request = new SdfApi_Request('', '', $host, true);
$response = json_decode(
    $request->get(
        '/BumsCommonApiV01/User/authorize.api',
        array(
            'Login' => $login,
            'Password' => md5($password)
        )
    )
);

$accessId = $response->data->AccessId;
$secretKey = $response->data->SecretKey;

unset($request);
$request = new SdfApi_Request($accessId, $secretKey, $host, true);

$raw = $request->post('/BumsCrmApiV01/Contractor/save.api',
    array(
        'Model[TypePerson]' => 'human',        // 0	// Имя
        'Model[FirstName]' => $nm,        // 0	// Имя
        'Model[Email]' => $em,            // 3	// Почта
        'Model[Category183CustomFieldPervichniyInteres]' => $want,        // 8	// дата рождения в формате YYYY-MM-DD
        'Model[Phones]' => array("ph_m-" . $telnumber . "\t"),                // 9-11	// телефоны (мобильный, рабочий, добавочный)
    )
);
$query = json_decode($raw, true);
$test = '<pre>' . print_r($query, 1) . '</pre>';
$test = preg_replace("/[^0-9]/", '', $test);
$idc = $test[0] . $test[1] . $test[2] . $test[3] . $test[4] . $test[5] . $test[6];

unset($request);
$request = new SdfApi_Request($accessId, $secretKey, $host, true);

$raw = $request->post('/BumsCommonApiV01/Comment/create.api',
    array(
        'SubjectType' => 'contractor',            // Task (задача), project (проект), contractor (клиент), deal (сделка) // Тип комментируемого объекта
        'SubjectId' => $idc,            // ID комментируемого объекта
        'Model[Text]' => $com,    // Текст комментария
    )
);


?>