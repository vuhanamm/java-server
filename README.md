# javalabs_server

*** Cần cài nodejs ***

Cách chạy server:
B1: Clone project, checkout nhánh develop
B2: Mở app, mở terminal, chạy lênh: npm start
B3: Mở trình duyệt, gõ: localhost:{port}  - hiện tại đang là port 3000 => localhost:3000


// Các api đã chạy:

http://localhost:3000/api/get-all-in-lesson - param: không có - trả về 1 list lesson, lesson sẽ chứa tất cả các trường của lesson, quiz và topic
http://localhost:3000/api/get-topic - param: lessonId  - trả về topic theo lesson id
http://localhost:3000/api/get-lesson: trả về toàn bộ lesson
http://localhost:3000/api/get-quiz - param: lessonId - trả về quiz theo lesson id
